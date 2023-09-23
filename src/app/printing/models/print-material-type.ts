import { AutoMap } from "@automapper/classes";
import { prop, Ref } from "@typegoose/typegoose";
import { FileInfo } from "@src/app/haus-file/models/file-info";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class PrintMaterialType extends TimeStamps {
    @AutoMap()
    id: string;

    @prop({ required: true, ref: () => FileInfo })
    photos: Ref<FileInfo>[];

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