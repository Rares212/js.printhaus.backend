import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from '@src/app/common/schema/mongo-generic.repository';
import { DictionaryValue } from '@src/app/common/models/dictionary-value';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class DictionaryValueRepo {
    private _genericRepo: MongoGenericRepository<DictionaryValue>;

    get genericRepo(): MongoGenericRepository<DictionaryValue> {
        return this._genericRepo;
    }

    constructor(
        @InjectModel(DictionaryValue)
        private readonly printMaterialModel: ReturnModelType<typeof DictionaryValue>
    ) {
        this._genericRepo = new MongoGenericRepository<DictionaryValue>(
            printMaterialModel
        );
    }

    findByKey(key: string): Promise<DictionaryValue> {
        return this.printMaterialModel
            .findOne({ key: key })
            .exec() as Promise<DictionaryValue>;
    }
}
