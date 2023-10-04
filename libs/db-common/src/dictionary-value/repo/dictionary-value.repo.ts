import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { MongoGenericRepository } from '@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository';
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';

@Injectable()
export class DictionaryValueRepo extends MongoGenericRepository<DictionaryValue> {
    constructor(
        @InjectModel(DictionaryValue) private readonly dictionaryValue: ReturnModelType<typeof DictionaryValue>
    ) {
        super(dictionaryValue);
    }

    findByKey(key: string): Promise<DictionaryValue> {
        return this.dictionaryValue.findOne({ key: key }).exec() as Promise<DictionaryValue>;
    }
}
