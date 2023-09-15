import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PrintMaterial } from '../../printing/models/print-material';
import { PrintMaterialType } from '@src/app/printing/models/print-material-type';
import { FileInfo } from '@src/app/common/models/file-info';
import { DictionaryValue } from "@src/app/common/models/dictionary-value";
import { HausUser } from "@src/app/auth/models/haus-user";
import { ShopItem } from "@src/app/shop/models/shop.item";

@Module({
    imports: [
        TypegooseModule.forFeature([
            PrintMaterial,
            PrintMaterialType,
            FileInfo,
            DictionaryValue,
            HausUser,
            ShopItem
        ])
    ],
    exports: [TypegooseModule]
})
export class SchemaModule {}
