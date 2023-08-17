import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from "@src/app/common/schema/mongo-generic.repository";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { PrintMaterialType } from "@src/app/printing/models/print-material-type";

@Injectable()
export class PrintMaterialTypeRepo {
    private _genericRepo: MongoGenericRepository<PrintMaterialType>;

    get genericRepo(): MongoGenericRepository<PrintMaterialType> {
        return this._genericRepo;
    }

    constructor(@InjectModel(PrintMaterialType) private readonly printMaterialTypeModel: ReturnModelType<typeof PrintMaterialType>) {
        this._genericRepo = new MongoGenericRepository<PrintMaterialType>(printMaterialTypeModel);
    }
}
