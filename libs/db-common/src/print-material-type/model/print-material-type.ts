import { AutoMap } from '@automapper/classes';
import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { ImageInfo } from "@haus/db-common/image-info/model/image-info";

export class PrintMaterialType extends TimeStamps {
    @AutoMap()
    id: string;

    @prop({ required: true, ref: () => ImageInfo })
    photos: Ref<ImageInfo>[];

    @AutoMap()
    @prop({ required: true, unique: true, index: true })
    shortName: string;

    @AutoMap()
    @prop({ required: true, unique: true, index: true })
    fullName: string;

    @AutoMap()
    @prop({ required: true })
    description: string;

    @AutoMap()
    @prop({ required: false, type: [String], default: [] })
    proList: string[];

    @AutoMap()
    @prop({ required: false, type: [String], default: [] })
    conList: string[];
}
