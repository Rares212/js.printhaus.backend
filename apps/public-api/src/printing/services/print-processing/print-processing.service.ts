import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException, Logger,
    NotFoundException
} from "@nestjs/common";
import {
    DICTIONARY_KEYS,
    INTERNAL_INFILL_WEIGHT_PERCENTAGE,
    PrintCostPartDto,
    PrintDimensionsDto,
    PrintMaterialDto,
    PrintModelDetailsRespDto,
    PRINT_QUALITY_SPEED_MULTIPLIER,
    PRINT_STRENGTH_INFILL,
    SupportedMeshFileTypes
} from '@printhaus/common';
import {PrintMaterialRepo} from "@haus/db-common/db-common/print-material/repo/print-material.repo";
import {PrintMaterial} from "@haus/db-common/db-common/print-material/model/print-material";

import {ConfigService} from "@nestjs/config";
import {CONFIG_KEYS} from "../../../common/util/config-keys.enum";
import {PrintCost, PrintCostService} from "../../../shop/services/print-cost/print-cost.service";
import {validateOrReject} from "class-validator";
import {gunzipSync} from "fflate";
import {BufferAttribute, BufferGeometry, Group, Mesh, Object3D, Vector3} from "three";
import {STLLoader} from "@src/printing/services/print-processing/stl-loader";
import {OBJLoader} from "@src/printing/services/print-processing/obj-loader";
import {mergeGeometries} from "@src/printing/services/print-processing/print-processing.utils";
import {PrintModelDetailsReqDto} from "@src/printing/models/print-model-details.req.dto";
import { CACHE_MANAGER, CacheKey } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { createHash } from 'crypto';
import { Readable } from 'stream';
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { DictionaryService } from "@src/dictionary/services/dictionary/dictionary.service";
@Injectable()
export class PrintProcessingService {

    private readonly logger = new Logger(PrintProcessingService.name);
    private readonly cacheResults: boolean = this.configService.get(CONFIG_KEYS.MESH.CACHE_MESHES);
    private readonly stlLoader = new STLLoader();
    private readonly objLoader = new OBJLoader();

    constructor(private printMaterialRepo: PrintMaterialRepo,
                private printCostService: PrintCostService,
                @InjectMapper() private mapper: Mapper,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,
                private configService: ConfigService,
                private dictionaryService: DictionaryService) {
        this.logger.log('Caching meshes: ' + this.cacheResults);
    }

    public async getModelDetails(file: Express.Multer.File, modelDetailsRequest: PrintModelDetailsReqDto): Promise<PrintModelDetailsRespDto> {

        const material: PrintMaterial = await this.printMaterialRepo.genericRepo.findById(modelDetailsRequest.materialId)
            .catch(() => {
                throw new NotFoundException(`Error retrieving material!`);
            });

        // Caching is necessary as a stateless means of not processing the file every time the user requests the same model details,
        // with different parameters. This is a very common use case, as the user will likely want to see the model details for
        // different materials, print settings, etc.
        let decompressedFileBuffer: Uint8Array;
        let geometry: BufferGeometry;

        if (this.cacheResults) {
            const fileHash: string = await this.computeHash(file);

            decompressedFileBuffer = await this.cacheManager.get(`decompressedFileBuffer-${fileHash}`);
            if (!decompressedFileBuffer) {
                decompressedFileBuffer = gunzipSync(new Uint8Array(file.buffer));
                this.cacheManager.set(`decompressedFileBuffer-${fileHash}`, decompressedFileBuffer, 1000 * 60)
                    .catch(() => this.logger.error('Error caching decompressed file buffer!'));
            }

            geometry = await this.cacheManager.get(`geometry-${fileHash}`);
            if (!geometry) {
                geometry = this.getGeometryFromFile(decompressedFileBuffer, modelDetailsRequest.fileType);
                this.cacheManager.set(`geometry-${fileHash}`, geometry, 1000 * 60)
                    .catch(() => this.logger.error('Error caching geometry!'));
            }
        } else {
            decompressedFileBuffer = gunzipSync(new Uint8Array(file.buffer));
            geometry = this.getGeometryFromFile(decompressedFileBuffer, modelDetailsRequest.fileType);
        }

        const totalCubicCm: number = this.getVolumeInCubicCentimeters(geometry);

        const infillPercent: number = PRINT_STRENGTH_INFILL[modelDetailsRequest.printSettings.strength];
        const totalGrams: number = totalCubicCm * material.gramsPerCubicCentimeter;
        const realGrams: number = totalGrams * (1.0 - INTERNAL_INFILL_WEIGHT_PERCENTAGE) +
                              totalGrams * infillPercent * INTERNAL_INFILL_WEIGHT_PERCENTAGE;

        const realCubicCm = realGrams / totalGrams * totalCubicCm;

        const dimensions: PrintDimensionsDto = this.getDimensions(geometry);

        const totalSpeedMultiplier: number = material.printSpeedMultiplier * PRINT_QUALITY_SPEED_MULTIPLIER[modelDetailsRequest.printSettings.quality];

        const printTimeHours: number = await this.getPrintTimeHours(realCubicCm, totalSpeedMultiplier);

        const printCost: PrintCost = await this.printCostService.getPrintCost(realGrams, printTimeHours, material);

        const response: PrintModelDetailsRespDto = new PrintModelDetailsRespDto(
            totalCubicCm,
            dimensions,
            realGrams,
            printTimeHours,
            printCost.totalCost.toObject(),
            printCost.costParts
        );

        try {
            await validateOrReject(response);
        } catch (errors) {
            throw new HttpException(errors, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return response;
    }

    public getGeometryFromFile(fileBuffer: Uint8Array, fileType: SupportedMeshFileTypes): BufferGeometry {
        switch (fileType) {
            case SupportedMeshFileTypes.STL: {
                return this.stlLoader.parse(fileBuffer.buffer);
            }
            case SupportedMeshFileTypes.OBJ: {
                const group: Group = this.objLoader.parse(fileBuffer.toString());
                return this.combineMeshes(group);
            }
            default: {
                throw new BadRequestException('Unsupported file type');
            }
        }
    }

    private combineMeshes(group: Group): BufferGeometry {
        const geometries: BufferGeometry[] = [];
        group.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
                geometries.push(child.geometry);
            }
        });

        return mergeGeometries(geometries, true);
    }

    private getDimensions(geometry: BufferGeometry): PrintDimensionsDto {
        geometry.computeBoundingBox();
        let vectorSize: Vector3 = new Vector3();
        geometry.boundingBox.getSize(vectorSize);
        return new PrintDimensionsDto(vectorSize.x, vectorSize.y, vectorSize.z);
    }

    private async getPrintTimeHours(cubicCentimeters: number, speedMultiplier: number): Promise<number> {
        const dictionaryValue = await this.dictionaryService.findByKey(DICTIONARY_KEYS.PRINT.AVERAGE_PRINT_SPEED);
        const averageCubicMillimetersPerSecond: number = Number(dictionaryValue.value);
        const printTimeSeconds: number = speedMultiplier * (cubicCentimeters * 1000) / averageCubicMillimetersPerSecond;
        return printTimeSeconds / 3600;
    }

    private getVolumeInCubicCentimeters(geometry: BufferGeometry): number {
        if (!geometry.isBufferGeometry) {
            throw new InternalServerErrorException('Error parsing geometry');
        }

        let isIndexed = geometry.index !== null;
        let position = geometry.getAttribute('position') as BufferAttribute;
        let sum = 0;
        let p1 = new Vector3(),
            p2 = new Vector3(),
            p3 = new Vector3();
        if (!isIndexed) {
            let faces = position.count / 3;
            for (let i = 0; i < faces; i++) {
                p1.fromBufferAttribute(position, i * 3 + 0);
                p2.fromBufferAttribute(position, i * 3 + 1);
                p3.fromBufferAttribute(position, i * 3 + 2);
                sum += this.signedVolumeOfTriangle(p1, p2, p3);
            }
        }
        else {
            let index = geometry.index;
            let faces = index.count / 3;
            for (let i = 0; i < faces; i++){
                p1.fromBufferAttribute(position, index.array[i * 3 + 0]);
                p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
                p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
                sum += this.signedVolumeOfTriangle(p1, p2, p3);
            }
        }
        return sum / 1000;
    }

    private signedVolumeOfTriangle(p1: Vector3, p2: Vector3, p3: Vector3) {
        return p1.dot(p2.cross(p3)) / 6.0;
    }


    private computeHash(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = createHash('md5'); // Or 'sha1'
            const stream = new Readable();

            stream.push(file.buffer);
            stream.push(null);  // Signals the end of file contents.

            stream.on('data', (chunk) => {
                hash.update(chunk);
            });

            stream.on('end', () => {
                resolve(hash.digest('hex'));
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
}
