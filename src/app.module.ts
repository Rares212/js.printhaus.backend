import {AdminModule, AdminModuleFactory} from "@adminjs/nestjs";
import {PrintingModule} from "./app/printing/printing.module";
import {ShopModule} from "./app/shop/shop.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { CommonModule } from './app/common/common.module';
import {getEnvPath} from "./app/common/util/config.util";
import {CONFIG_KEYS} from "./app/common/util/config-keys.enum";
import {AdminConfigService} from "./app/common/services/admin-config/admin-config.service";
import {getModelToken, TypegooseModule} from "nestjs-typegoose";
import {TypegooseConfigService} from "./app/common/services/typegoose-config/typegoose-config.service";
import {SchemaModule} from "./app/common/schema/schema.module";
import {PrintMaterial} from "./app/printing/models/print-material";
import {getModelForClass} from "@typegoose/typegoose";
import {buildFeature} from "adminjs";
import {CacheModule} from "@nestjs/cache-manager";
import {Module} from "@nestjs/common";

const envFilePath: string = getEnvPath(`${__dirname}/config`)

console.log(envFilePath);

@Module({
    imports: [
        PrintingModule,
        ShopModule,
        CommonModule,
        TypegooseModule.forRootAsync({
            useClass: TypegooseConfigService
        }),
        SchemaModule,
        CacheModule.register({
            isGlobal: true
        }),
        AdminModule.createAdminAsync({
            imports: [SchemaModule],
            inject: [getModelToken(PrintMaterial.name)],
            useFactory: () => ({
                adminJsOptions: {
                    rootPath: '/admin',
                    resources: [
                        {
                            resource: getModelForClass(PrintMaterial),
                        },
                    ],
                }
            })
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath,
        }),
    ],
    providers: [
        AdminConfigService
    ]
})
export class AppModule {
}
