import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AutoMap } from '@automapper/classes';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { prop } from '@typegoose/typegoose';
import { SupportedMeshFileTypes } from "@printhaus/common";

// To be extended
export class ModelInfo extends TimeStamps {
    @AutoMap()
    id: string;

    @AutoMap()
    @prop({ required: true, unique: true, index: true })
    title: string;

    @prop({ required: true, ref: () => FileInfo })
    file: FileInfo;

    @prop({ required: true, enum: SupportedMeshFileTypes, type: String })
    fileExtension: SupportedMeshFileTypes;

    @prop({ required: true })
    compressed: boolean;
}
