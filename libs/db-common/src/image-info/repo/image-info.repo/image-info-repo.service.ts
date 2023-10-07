import { Injectable } from '@nestjs/common';
import {
  MongoGenericRepository
} from "@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository";
import { ImageInfo } from "@haus/db-common/image-info/model/image-info";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";

@Injectable()
export class ImageInfoRepo extends MongoGenericRepository<ImageInfo> {
    constructor(@InjectModel(ImageInfo) private readonly imageInfoModel: ReturnModelType<typeof ImageInfo>) {
        super(imageInfoModel);
    }
}
