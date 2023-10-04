import { Injectable, Logger } from '@nestjs/common';
import { PrintMaterialDto, PrintMaterialUseType } from '@printhaus/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Types } from 'mongoose';
import { PrintMaterialRepo } from '@haus/db-common/print-material/repo/print-material.repo';
import { PrintMaterialTypeRepo } from '@haus/db-common/print-material-type/repo/print-material-type.repo';
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';

@Injectable()
export class PrintMaterialService {
    private logger = new Logger(PrintMaterialService.name);

    constructor(
        private printMaterialRepo: PrintMaterialRepo,
        private printMaterialTypeRepo: PrintMaterialTypeRepo,
        @InjectMapper() private mapper: Mapper
    ) {}

    // Fetch the material list and populate the material type short name
    public async getPublicMaterialList(): Promise<PrintMaterialDto[]> {
        const materials: PrintMaterial[] = await this.printMaterialRepo.findAllByUseTypes([
            PrintMaterialUseType.CUSTOM_PRINTS,
            PrintMaterialUseType.STORE_PRINTS_AND_CUSTOM_PRINTS
        ]);

        const materialDtoList = this.mapper.mapArray(materials, PrintMaterial, PrintMaterialDto);

        const materialTypeIds = materials.map((material) => new Types.ObjectId(material.materialType.id));

        const materialTypes = await this.printMaterialTypeRepo.findShortNamesByMaterialTypeIds(materialTypeIds);

        const materialTypeShortNameMap = new Map<string, string>();
        materialTypes.forEach((mt) => {
            // @ts-ignore
            materialTypeShortNameMap.set(mt._id.toString(), mt.shortName);
        });

        materialDtoList.forEach((materialDto) => {
            const shortName = materialTypeShortNameMap.get(materialDto.materialTypeId);
            materialDto.materialTypeShortName = shortName || null;
        });

        return materialDtoList;
    }
}
