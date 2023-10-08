import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from '@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from "mongoose";

@Injectable()
export class FileInfoRepo extends MongoGenericRepository<FileInfo> {
    constructor(@InjectModel(FileInfo) private readonly fileInfo: ReturnModelType<typeof FileInfo>) {
        super(fileInfo);
    }

    public async findAllByIds(ids: string[] | Types.ObjectId[]): Promise<FileInfo[]> {
        return this.fileInfo.find({
            _id: {
                $in: ids
            }
        });
    }
}
