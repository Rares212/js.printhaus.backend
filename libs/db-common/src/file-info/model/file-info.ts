import { AutoMap } from "@automapper/classes";
import { prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class FileInfo extends TimeStamps {
    @AutoMap()
    id: string;

    @AutoMap()
    @prop({required: true, unique: true, index: true})
    title: string;

    @prop({required: false, unique: true, index: true})
    s3Key: string;

    @prop({required: false, unique: true})
    bucket: string;

    @AutoMap()
    @prop({required: false})
    mime: string;

    @AutoMap()
    @prop({required: false})
    comment: string;
}