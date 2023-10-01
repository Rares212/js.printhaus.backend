import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import { PrintMaterialUseType } from '@printhaus/common';
import { MongoGenericRepository } from "@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository";
import { PrintMaterial } from "@haus/db-common/print-material/model/print-material";

@Injectable()
export class PrintMaterialRepo extends MongoGenericRepository<PrintMaterial> {
    constructor(@InjectModel(PrintMaterial) private readonly printMaterialModel: ReturnModelType<typeof PrintMaterial>) {
        super(printMaterialModel);
    }

    findAllByUseTypes(useTypeList: PrintMaterialUseType[]): Promise<PrintMaterial[]> {
        return this.printMaterialModel.find({ useType: { $in: useTypeList } }).exec();
    }
}
