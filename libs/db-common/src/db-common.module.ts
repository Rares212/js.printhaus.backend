import { Module } from '@nestjs/common';
import { DictionaryValueModule } from './dictionary-value/dictionary-value.module';
import { PrintMaterialModule } from './print-material/print-material.module';
import { PrintMaterialTypeModule } from './print-material-type/print-material-type.module';
import { ShopItemModule } from './shop-item/shop-item.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { UserRatingModule } from './user-rating/user-rating.module';
import { FileInfoModule } from './file-info/file-info.module';
import { ImageInfoModule } from './image-info/image-info.module';
import { CommonSchemaModule } from './common-schema/common-schema.module';
import { ModelInfoModule } from './model-info/model-info.module';

@Module({
    imports: [
        DictionaryValueModule,
        FileInfoModule,
        ImageInfoModule,
        PrintMaterialModule,
        PrintMaterialTypeModule,
        ShopItemModule,
        AuthUserModule,
        UserRatingModule,
        FileInfoModule,
        CommonSchemaModule,
        ModelInfoModule
    ],
    exports: [
        DictionaryValueModule,
        FileInfoModule,
        ImageInfoModule,
        PrintMaterialModule,
        PrintMaterialTypeModule,
        ShopItemModule,
        AuthUserModule,
        UserRatingModule,
        FileInfoModule,
        CommonSchemaModule,
        ModelInfoModule
    ]
})
export class DbCommonModule {}
