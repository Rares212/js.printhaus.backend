import { Inject, Injectable } from "@nestjs/common";
import { MongoGenericRepository } from "@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository";
import { FileInfo } from "@haus/db-common/file-info/model/file-info";
import { ReturnModelType } from "@typegoose/typegoose";

@Injectable()
export class FileInfoRepo extends MongoGenericRepository<FileInfo> {
    constructor(@Inject(FileInfo) private readonly fileInfo: ReturnModelType<typeof FileInfo>) {
        super(fileInfo);
    }
}
