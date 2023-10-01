import { AutoMap } from '@automapper/classes';
import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { FileInfo } from "@haus/db-common/file-info/model/file-info";

export class ImageInfo extends TimeStamps {
    @AutoMap()
    id: string;

    @AutoMap()
    @prop({ required: true, unique: true, index: true })
    title: string;

    @AutoMap()
    @prop({ required: false })
    caption: string;

    @prop({ required: true, ref: () => FileInfo })
    originalImage: Ref<FileInfo>;

    @prop({ required: true, ref: () => FileInfo })
    imageSmall: Ref<FileInfo>;

    @prop({ required: true, ref: () => FileInfo })
    imageMedium: Ref<FileInfo>;

    @prop({ required: true, ref: () => FileInfo })
    imageLarge: Ref<FileInfo>;

    @AutoMap()
    @prop({ required: true, default: 0 })
    viewingPriority: number;
}
