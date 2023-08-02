import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {INTERNAL_INFILL_WEIGHT_PERCENTAGE,
    PrintDimensionsDto, PrintMaterialDto, PrintModelDetailsRespDto, PRINT_QUALITY_SPEED_MULTIPLIER, PRINT_STRENGTH_INFILL, SupportedFileTypes } from '@printnuts/common';
import {PrintMaterialRepo} from "../../repos/print-material/print-material.repo";
import {PrintMaterial} from "../../models/print-material";
import {InjectMapper} from "@automapper/nestjs";
import {Mapper} from "@automapper/core";
import {ConfigService} from "@nestjs/config";
import {CONFIG_KEYS} from "../../../common/util/config-keys.enum";
import {PrintCost, PrintCostService} from "../../../shop/services/print-cost/print-cost.service";
import {validateOrReject} from "class-validator";
import {gunzipSync} from "fflate";
import {BufferAttribute, BufferGeometry, Group, Mesh, Object3D, Vector3} from "three";
import {STLLoader} from "@src/app/printing/services/print-processing/stl-loader";
import {OBJLoader} from "@src/app/printing/services/print-processing/obj-loader";
import {mergeGeometries} from "@src/app/printing/services/print-processing/print-processing.utils";
import {PrintModelDetailsReqDto} from "@src/app/printing/models/print-model-details.req.dto";

@Injectable()
export class PrintProcessingService {

    private readonly stlLoader = new STLLoader();
    private readonly objLoader = new OBJLoader();

    constructor(private printMaterialRepo: PrintMaterialRepo,
                private printCostService: PrintCostService,
                @InjectMapper() private mapper: Mapper,
                private configService: ConfigService) {
    }

    public async getMaterialList(): Promise<PrintMaterialDto[]> {
        const materials: PrintMaterial[] = await this.printMaterialRepo.genericRepo.findAll();

        return this.mapper.mapArray(materials, PrintMaterial, PrintMaterialDto);
    }

    public async getModelDetails(file: Express.Multer.File, modelDetailsRequest: PrintModelDetailsReqDto): Promise<PrintModelDetailsRespDto> {

        const material: PrintMaterial = await this.printMaterialRepo.genericRepo.findById(modelDetailsRequest.materialId)
            .catch(() => {
                throw new NotFoundException(`Error retrieving material!`);
            });

        const decompressedFileBuffer: Uint8Array = gunzipSync(new Uint8Array(file.buffer));

        const geometry: BufferGeometry = this.getGeometryFromFile(decompressedFileBuffer, modelDetailsRequest.fileType);

        const cubicCentimeters: number = this.getVolumeInCubicCentimeters(geometry);

        const infillPercent: number = PRINT_STRENGTH_INFILL[modelDetailsRequest.printSettings.strength];
        const totalGrams: number = cubicCentimeters * material.gramsPerCubicCentimeter;
        const grams: number = totalGrams * (1.0 - INTERNAL_INFILL_WEIGHT_PERCENTAGE) +
                              totalGrams * infillPercent * INTERNAL_INFILL_WEIGHT_PERCENTAGE;

        const dimensions: PrintDimensionsDto = this.getDimensions(geometry);

        const totalSpeedMultiplier: number = material.printSpeedMultiplier * PRINT_QUALITY_SPEED_MULTIPLIER[modelDetailsRequest.printSettings.quality];

        const printTimeHours: number = this.getPrintTimeHours(cubicCentimeters, totalSpeedMultiplier);

        const printCost: PrintCost = this.printCostService.getPrintCost(grams, printTimeHours);

        const response: PrintModelDetailsRespDto = new PrintModelDetailsRespDto(
            cubicCentimeters,
            dimensions,
            grams,
            printTimeHours,
            printCost.cost.toObject(),
            printCost.costCalculationMessage
        );

        try {
            await validateOrReject(response);
        } catch (errors) {
            throw new HttpException(errors, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return response;
    }

    public getGeometryFromFile(fileBuffer: Uint8Array, fileType: SupportedFileTypes): BufferGeometry {
        switch (fileType) {
            case SupportedFileTypes.STL: {
                return this.stlLoader.parse(fileBuffer.buffer);
            }
            case SupportedFileTypes.OBJ: {
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

    private getPrintTimeHours(cubicCentimeters: number, speedMultiplier: number): number {
        const averageCubicMillimetersPerSecond: number = this.configService.get(CONFIG_KEYS.COSTS.AVERAGE_PRINT_SPEED);
        const printTimeSeconds: number = speedMultiplier * (cubicCentimeters * 1000) / averageCubicMillimetersPerSecond;
        return  printTimeSeconds / 3600;
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
}
