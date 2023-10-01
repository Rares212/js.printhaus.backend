import { Inject, Injectable } from "@nestjs/common";
import { MongoGenericRepository } from "@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository";
import { ModelInfo } from "@haus/db-common/model-info/model/model-info";
import { ReturnModelType } from "@typegoose/typegoose";

@Injectable()
export class ModelInfoRepo extends MongoGenericRepository<ModelInfo> {
    constructor(@Inject(ModelInfo) private readonly modelInfo: ReturnModelType<typeof ModelInfo>) {
        super(modelInfo);
    }
}
