import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {PrintMaterial} from "../../models/print-material";
import {ReturnModelType} from "@typegoose/typegoose";
import {MongoGenericRepository} from "../../../common/schema/mongo-generic.repository";

@Injectable()
export class PrintMaterialRepo {
    private _genericRepo: MongoGenericRepository<PrintMaterial>;

    get genericRepo(): MongoGenericRepository<PrintMaterial> {
        return this._genericRepo;
    }

    constructor(@InjectModel(PrintMaterial) private readonly printMaterialModel: ReturnModelType<typeof PrintMaterial>) {
        this._genericRepo = new MongoGenericRepository<PrintMaterial>(printMaterialModel);
    }
}
