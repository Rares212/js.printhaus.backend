import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from '@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository';
import { ModelInfo } from '@haus/db-common/model-info/model/model-info';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ModelInfoRepo extends MongoGenericRepository<ModelInfo> {
    constructor(@InjectModel(ModelInfo) private readonly modelInfo: ReturnModelType<typeof ModelInfo>) {
        super(modelInfo);
    }
}
