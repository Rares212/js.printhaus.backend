import { Injectable, Logger } from '@nestjs/common';
import { PrintMaterialDto } from '@printnuts/common';
import { PrintMaterial } from '@src/app/printing/models/print-material';
import { PrintMaterialRepo } from '@src/app/printing/repos/print-material/print-material.repo';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectModel } from 'nestjs-typegoose';
import { PrintMaterialType } from '@src/app/printing/models/print-material-type';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@Injectable()
export class PrintMaterialService {
    private logger = new Logger(PrintMaterialService.name);

    constructor(
        private printMaterialRepo: PrintMaterialRepo,
        @InjectModel(PrintMaterialType) private printMaterialTypeModel: ReturnModelType<typeof PrintMaterialType>,
        @InjectMapper() private mapper: Mapper
    ) {}

    // Fetch the material list and populate the material type short name
    public async getMaterialList(): Promise<PrintMaterialDto[]> {
        const materials: PrintMaterial[] = await this.printMaterialRepo.genericRepo.findAll();

        const materialTypeIds = materials.map((material) => new Types.ObjectId(material.materialType.id));

        const materialTypes = await this.printMaterialTypeModel
            .find({ _id: { $in: materialTypeIds } })
            .select('shortName')
            .exec();

        const materialTypeShortNameMap = new Map<string, string>();
        materialTypes.forEach((mt) => {
            materialTypeShortNameMap.set(mt._id.toString(), mt.shortName);
        });

        materials.forEach((material) => {
            const shortName = materialTypeShortNameMap.get(new Types.ObjectId(material.materialType.id).toString());
            material.materialTypeShortName = shortName || null;
        });

        return this.mapper.mapArray(materials, PrintMaterial, PrintMaterialDto);
    }
}
