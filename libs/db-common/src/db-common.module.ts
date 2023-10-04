import { Module } from '@nestjs/common';
import { DictionaryValueDbModule } from './dictionary-value/dictionary-value-db.module';
import { PrintMaterialDbModule } from './print-material/print-material-db.module';
import { PrintMaterialTypeDbModule } from './print-material-type/print-material-type-db.module';
import { ShopItemDbModule } from './shop-item/shop-item-db.module';
import { AuthUserDbModule } from './auth-user/auth-user-db.module';
import { UserRatingDbModule } from './user-rating/user-rating-db.module';
import { FileInfoDbModule } from './file-info/file-info-db.module';
import { ImageInfoDbModule } from './image-info/image-info-db.module';
import { CommonSchemaModule } from './common-schema/common-schema.module';
import { ModelInfoDbModule } from './model-info/model-info-db.module';
import { getModelToken, TypegooseModule } from "nestjs-typegoose";
import { TypegooseConfigService } from '@haus/db-common/common-schema/services/typegoose-config/typegoose-config.service';
import { getModelForClass } from "@typegoose/typegoose";
import { AuthUser } from "@haus/db-common/auth-user/model/auth-user";
import { DictionaryValue } from "@haus/db-common/dictionary-value/model/dictionary-value";
import { FileInfo } from "@haus/db-common/file-info/model/file-info";
import { ImageInfo } from "@haus/db-common/image-info/model/image-info";
import { ModelInfo } from "@haus/db-common/model-info/model/model-info";
import { PrintMaterial } from "@haus/db-common/print-material/model/print-material";
import { PrintMaterialType } from "@haus/db-common/print-material-type/model/print-material-type";
import { ShopItem } from "@haus/db-common/shop-item/model/shop.item";
import { UserRating } from "@haus/db-common/user-rating/model/user-rating";

@Module({
    imports: [
        DictionaryValueDbModule,
        FileInfoDbModule,
        ImageInfoDbModule,
        PrintMaterialDbModule,
        PrintMaterialTypeDbModule,
        ShopItemDbModule,
        AuthUserDbModule,
        UserRatingDbModule,
        CommonSchemaModule,
        ModelInfoDbModule,

        TypegooseModule.forRootAsync({
            useClass: TypegooseConfigService
        })
    ],
    exports: [
        DictionaryValueDbModule,
        FileInfoDbModule,
        ImageInfoDbModule,
        PrintMaterialDbModule,
        PrintMaterialTypeDbModule,
        ShopItemDbModule,
        AuthUserDbModule,
        UserRatingDbModule,
        FileInfoDbModule,
        CommonSchemaModule,
        ModelInfoDbModule,

        TypegooseModule
    ]
})
export class DbCommonModule {}
