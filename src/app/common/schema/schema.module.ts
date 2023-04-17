import { Module } from '@nestjs/common';
import {TypegooseModule} from "nestjs-typegoose";
import {PrintMaterial} from "../../printing/models/print-material";

@Module({
    imports: [
        TypegooseModule.forFeature([PrintMaterial])
    ],
    exports: [
        TypegooseModule
    ]
})
export class SchemaModule {}
