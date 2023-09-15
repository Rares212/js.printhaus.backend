import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from "@src/app/common/schema/mongo-generic.repository";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { HausUser } from "@src/app/auth/models/haus-user";

@Injectable()
export class UserRepo {
    private _genericRepo: MongoGenericRepository<HausUser>;

    get genericRepo(): MongoGenericRepository<HausUser> {
        return this._genericRepo;
    }

    constructor(@InjectModel(HausUser) private readonly printMaterialTypeModel: ReturnModelType<typeof HausUser>) {
        this._genericRepo = new MongoGenericRepository<HausUser>(printMaterialTypeModel);
    }
}
