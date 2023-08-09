import { Module } from '@nestjs/common';
import {TypegooseModule} from "nestjs-typegoose";
import {PrintMaterial} from "../../printing/models/print-material";
import { PrintMaterialType } from "@src/app/printing/models/print-material-type";
import { FileInfo } from "@src/app/common/models/file-info";

@Module({
    imports: [
        TypegooseModule.forFeature([PrintMaterial, PrintMaterialType, FileInfo])
    ],
    exports: [
        TypegooseModule
    ]
})
export class SchemaModule {}
