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
import { TypegooseModule } from 'nestjs-typegoose';
import { TypegooseConfigService } from '@haus/db-common/common-schema/services/typegoose-config/typegoose-config.service';

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
        FileInfoDbModule,
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
