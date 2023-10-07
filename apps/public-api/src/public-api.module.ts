import { Module } from '@nestjs/common';
import { getEnvPath } from '@haus/api-common/config/util/config.util';
import { ConfigModule } from '@nestjs/config';
import { AuthUserModule } from './auth/auth-user.module';
import { DbCommonModule } from '@haus/db-common';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

import { PrintingModule } from './printing/printing.module';
import { ShopModule } from './shop/shop.module';
import { CacheModule } from '@nestjs/cache-manager';
import { DictionaryModule } from './dictionary/dictionary.module';

const envFilePath: string = getEnvPath(`${__dirname}/src/env-config`);

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

        DictionaryModule,
        PrintingModule,
        ShopModule,

        AuthUserModule
    ]
})
export class PublicApiModule {}
