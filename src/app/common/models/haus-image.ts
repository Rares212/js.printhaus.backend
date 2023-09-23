import { AutoMap } from '@automapper/classes';
import { FileInfo } from '@src/app/haus-file/models/file-info';
import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class HausImage extends TimeStamps {
    @AutoMap()
    id: string;

    @AutoMap()
    @prop({ required: true })
    title: string

    @prop({ required: true, ref: () => FileInfo })
    thumbnail: Ref<FileInfo>;

    @prop({ required: true, ref: () => FileInfo })
    image: Ref<FileInfo>;

    @AutoMap()
    @prop({ required: true, default: 0 })
    viewingPriority: number;
}
