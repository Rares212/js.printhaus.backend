import { Module } from '@nestjs/common';
import { getEnvPath } from '@haus/api-common/config/util/config.util';
import { ConfigModule } from '@nestjs/config';
import { AuthUserModule } from './auth/auth-user.module';
import { DbCommonModule } from '@haus/db-common';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { FileInfoModule } from './file-info/file-info.module';
import { ImageInfoModule } from './image-info/image-info.module';
import { PrintingModule } from './printing/printing.module';
import { ShopModule } from './shop/shop.module';
import { CacheModule } from '@nestjs/cache-manager';
import { DictionaryModule } from './dictionary/dictionary.module';

const envFilePath: string = getEnvPath(`${__dirname}/src/env-config`);
console.log(`envFilePath: ${envFilePath}`);

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath
        }),
        AutomapperModule.forRoot({
            strategyInitializer: classes()
        }),
        CacheModule.register({
            isGlobal: true,
            max: 100, // maximum number of items in cache
            ttl: 60 // seconds
        }),

        DbCommonModule,
        PublicApiModule,

        FileInfoModule,
        DictionaryModule,
        ImageInfoModule,
        PrintingModule,
        ShopModule,

        AuthUserModule
    ]
})
export class PublicApiModule {}
