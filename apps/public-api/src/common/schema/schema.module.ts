import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PrintMaterial } from '@haus/db-common/db-common/print-material/model/print-material';
import { PrintMaterialType } from '@src/printing/models/print-material-type';
import { FileInfo } from '@src/haus-file/models/file-info';
import { DictionaryValue } from "@src/dictionary/models/dictionary-value";
import { HausUser } from "@src/auth/models/haus-user";
import { ShopItem } from "@src/shop/models/shop.item";
import { HausImage } from "@src/haus-image/models/haus-image";

@Module({
    imports: [
        TypegooseModule.forFeature([
            PrintMaterial,
            PrintMaterialType,
            FileInfo,
            DictionaryValue,
            HausUser,
            HausImage,
            ShopItem
        ])
    ],
    exports: [TypegooseModule]
})
export class SchemaModule {}
