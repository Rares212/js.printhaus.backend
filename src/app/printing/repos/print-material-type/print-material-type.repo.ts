import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from "@src/app/common/schema/mongo-generic.repository";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { PrintMaterialType } from "@src/app/printing/models/print-material-type";
import { Types } from "mongoose";

@Injectable()
export class PrintMaterialTypeRepo {
    private _genericRepo: MongoGenericRepository<PrintMaterialType>;

    get genericRepo(): MongoGenericRepository<PrintMaterialType> {
        return this._genericRepo;
    }

    findShortNamesByMaterialTypeIds(materialTypeIds: Types.ObjectId[]) {
        return this.printMaterialTypeModel
            .find({ _id: { $in: materialTypeIds } })
            .select('shortName')
            .exec();
    }

    constructor(@InjectModel(PrintMaterialType) private readonly printMaterialTypeModel: ReturnModelType<typeof PrintMaterialType>) {
        this._genericRepo = new MongoGenericRepository<PrintMaterialType>(printMaterialTypeModel);
    }
}
