import { PrintingModule } from './app/printing/printing.module';
import { ShopModule } from './app/shop/shop.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './app/common/common.module';
import { getEnvPath } from './app/common/util/config.util';
import { TypegooseModule } from 'nestjs-typegoose';
import { TypegooseConfigService } from './app/common/services/typegoose-config/typegoose-config.service';
import { SchemaModule } from './app/common/schema/schema.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AdminConfigModule } from './app/admin/admin-config.module';
import { CachingConfigModule } from "@src/app/caching/caching-config-module";
import { HausAuthModule } from "@src/app/auth/haus-auth.module";

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
        HausAuthModule
    ],
    providers: []
})
export class AppModule {}
