import { AutoMap } from "@automapper/classes";
import { prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class FileInfo extends TimeStamps {
    @prop({required: false})
    s3Key: string;

    @prop({required: false})
    bucket: string;

    @prop({required: false})
    mime: string;

    @prop({required: false})
    comment: string;
}