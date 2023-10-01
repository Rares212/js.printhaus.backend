import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { AutoMap } from "@automapper/classes";
import { FileInfo } from "@haus/db-common/file-info/model/file-info";
import { prop } from "@typegoose/typegoose";

// To be extended
export class ModelInfo extends TimeStamps {
    @AutoMap()
    id: string;

    @prop({ required: true, ref: () => FileInfo })
    file: FileInfo
}