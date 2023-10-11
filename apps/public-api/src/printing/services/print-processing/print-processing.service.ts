import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from '@nestjs/common';
import {
    INTERNAL_INFILL_WEIGHT_PERCENTAGE,
    PrintCostPartDto,
    PrintDimensionsDto,
    PrintMaterialDto,
    PrintModelDetailsRespDto,
    PRINT_QUALITY_SPEED_MULTIPLIER,
    PRINT_STRENGTH_INFILL,
    SupportedMeshFileTypes, MeshParserService, DictionaryKey
} from "@printhaus/common";

import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '@haus/api-common/config/util/config-keys.enum';
import { PrintCost, PrintCostService } from '../../../shop/services/print-cost/print-cost.service';
import { validateOrReject } from 'class-validator';
import { gunzipSync } from 'fflate';
import { BufferAttribute, BufferGeometry, Group, Mesh, Object3D, Vector3 } from 'three';
import { CACHE_MANAGER, CacheKey } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { Readable } from 'stream';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PrintMaterialRepo } from '@haus/db-common/print-material/repo/print-material.repo';
import { DictionaryService } from '../../../dictionary/services/dictionary/dictionary.service';
import { PrintModelDetailsReqDto } from '../../models/print-model-details.req.dto';
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';

@Injectable()
export class PrintProcessingService {
    private readonly logger = new Logger(PrintProcessingService.name);
    private readonly cacheResults: boolean = this.configService.get(CONFIG_KEYS.MESH.CACHE_MESHES);
    private readonly meshParser = new MeshParserService();

    constructor(
        private printMaterialRepo: PrintMaterialRepo,
        private printCostService: PrintCostService,
        @InjectMapper() private mapper: Mapper,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private configService: ConfigService,
        private dictionaryService: DictionaryService
    ) {
        this.logger.log('Caching meshes: ' + this.cacheResults);
    }

    public async getModelDetails(
        file: Express.Multer.File,
        modelDetailsRequest: PrintModelDetailsReqDto
    ): Promise<PrintModelDetailsRespDto> {

        const material: PrintMaterial = await this.printMaterialRepo
            .findById(modelDetailsRequest.materialId)
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

            geometry = await this.cacheManager.get(`geometry-${fileHash}`);
            if (!geometry) {
                decompressedFileBuffer = gunzipSync(new Uint8Array(file.buffer));
                geometry = this.meshParser.parseFile(decompressedFileBuffer.buffer, modelDetailsRequest.fileType);

                this.cacheManager
                    .set(`geometry-${fileHash}`, geometry, 1000 * 60 * 2)
                    .catch(() => this.logger.error('Error caching geometry!'));
            }
        } else {
            decompressedFileBuffer = gunzipSync(new Uint8Array(file.buffer));
            geometry = this.meshParser.parseFile(decompressedFileBuffer.buffer, modelDetailsRequest.fileType);
        }

        const totalCubicCm: number = this.getVolumeInCubicCentimeters(geometry);

        const infillPercent: number = PRINT_STRENGTH_INFILL[modelDetailsRequest.printSettings.strength];
        const totalGrams: number = totalCubicCm * material.gramsPerCubicCentimeter;
        const realGrams: number =
            totalGrams * (1.0 - INTERNAL_INFILL_WEIGHT_PERCENTAGE) +
            totalGrams * infillPercent * INTERNAL_INFILL_WEIGHT_PERCENTAGE;

        const realCubicCm = (realGrams / totalGrams) * totalCubicCm;

        const dimensions: PrintDimensionsDto = this.getDimensions(geometry);

        const totalSpeedMultiplier: number =
            material.printSpeedMultiplier * PRINT_QUALITY_SPEED_MULTIPLIER[modelDetailsRequest.printSettings.quality];

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

    private getDimensions(geometry: BufferGeometry): PrintDimensionsDto {
        geometry.computeBoundingBox();
        const vectorSize: Vector3 = new Vector3();
        geometry.boundingBox.getSize(vectorSize);
        return new PrintDimensionsDto(vectorSize.x, vectorSize.y, vectorSize.z);
    }

    private async getPrintTimeHours(cubicCentimeters: number, speedMultiplier: number): Promise<number> {
        const dictionaryValue = await this.dictionaryService.findByKey(DictionaryKey.AVERAGE_PRINT_SPEED);
        const averageCubicMillimetersPerSecond: number = Number(dictionaryValue.value);
        const printTimeSeconds: number =
            (speedMultiplier * (cubicCentimeters * 1000)) / averageCubicMillimetersPerSecond;
        return printTimeSeconds / 3600;
    }

    private getVolumeInCubicCentimeters(geometry: BufferGeometry): number {
        if (!geometry.isBufferGeometry) {
            throw new InternalServerErrorException('Error parsing geometry');
        }

        const isIndexed = geometry.index !== null;
        const position = geometry.getAttribute('position') as BufferAttribute;
        let sum = 0;
        const p1 = new Vector3(),
            p2 = new Vector3(),
            p3 = new Vector3();
        if (!isIndexed) {
            const faces = position.count / 3;
            for (let i = 0; i < faces; i++) {
                p1.fromBufferAttribute(position, i * 3 + 0);
                p2.fromBufferAttribute(position, i * 3 + 1);
                p3.fromBufferAttribute(position, i * 3 + 2);
                sum += this.signedVolumeOfTriangle(p1, p2, p3);
            }
        } else {
            const index = geometry.index;
            const faces = index.count / 3;
            for (let i = 0; i < faces; i++) {
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
            stream.push(null); // Signals the end of file contents.

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
