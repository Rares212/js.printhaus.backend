import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { MongoGenericRepository } from '@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository';
import { PrintMaterialType } from '@haus/db-common/print-material-type/model/print-material-type';

@Injectable()
export class PrintMaterialTypeRepo extends MongoGenericRepository<PrintMaterialType> {
    constructor(
        @InjectModel(PrintMaterialType)
        private readonly printMaterialTypeModel: ReturnModelType<typeof PrintMaterialType>
    ) {
        super(printMaterialTypeModel);
    }

    public async findShortNamesByMaterialTypeIds(materialTypeIds: Types.ObjectId[]): Promise<PrintMaterialType[]> {
        return this.printMaterialTypeModel
            .find({ _id: { $in: materialTypeIds } })
            .select('shortName')
            .exec();
    }
}
