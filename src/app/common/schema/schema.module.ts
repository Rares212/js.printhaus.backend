import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PrintMaterial } from '../../printing/models/print-material';
import { PrintMaterialType } from '@src/app/printing/models/print-material-type';
import { FileInfo } from '@src/app/common/models/file-info';
import { DictionaryValue } from "@src/app/common/models/dictionary-value";

@Module({
    imports: [
        TypegooseModule.forFeature([
            PrintMaterial,
            PrintMaterialType,
            FileInfo,
            DictionaryValue
        ])
    ],
    exports: [TypegooseModule]
})
export class SchemaModule {}
