import { PrintingModule } from '@src/printing/printing.module';
import { ShopModule } from '@src/shop/shop.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@src/common/common.module';
import { getEnvPath } from '@src/common/util/config.util';
import { TypegooseModule } from 'nestjs-typegoose';
import { TypegooseConfigService } from '@src/common/services/typegoose-config/typegoose-config.service';
import { SchemaModule } from '@src/common/schema/schema.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AdminConfigModule } from '@src/admin/admin-config.module';
import { CachingConfigModule } from "@src/caching/caching-config-module";
import { HausAuthModule } from "@src/auth/haus-auth.module";
import { HausFileModule } from '@src/haus-file/haus-file.module';
import { HausImageModule } from '@src/haus-image/haus-image.module';
import { HausFileStorageModule } from '@src/haus-file-storage/haus-file-storage.module';
import { DictionaryModule } from '@src/dictionary/dictionary.module';

const envFilePath: string = getEnvPath(`${__dirname}/config`);

console.log(envFilePath);

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath
        }),
        PrintingModule,
        ShopModule,
        CommonModule,
        TypegooseModule.forRootAsync({
            useClass: TypegooseConfigService
        }),
        AdminConfigModule,
        SchemaModule,
        CacheModule.register({
            isGlobal: true
        }),
        AdminConfigModule,
        CachingConfigModule,
        HausAuthModule,
        HausFileModule,
        HausImageModule,
        HausFileStorageModule,
        DictionaryModule
    ],
    providers: []
})
export class AppModule {}
