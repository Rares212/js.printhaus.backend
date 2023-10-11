import { Module } from '@nestjs/common';
import { getModelToken, TypegooseModule } from "nestjs-typegoose";
import { TypegooseConfigService } from '@haus/db-common/common-schema/services/typegoose-config/typegoose-config.service';
import { DbCommonModule } from '@haus/db-common';
import { getEnvPath } from '@haus/api-common/config/util/config.util';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { AdminModule } from "@adminjs/nestjs";
import { ADMIN_MODULE_FACTORY } from "./admin/config/admin-module.factory";
import { ImageListenerModule } from './image-listener/image-listener.module';
import { ModelListenerModule } from './model-listener/model-listener.module';


const envFilePath: string = getEnvPath(`${__dirname}/src/env-config`);

@Module({
    imports: [
        AutomapperModule.forRoot({
            strategyInitializer: classes()
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath
        }),
        DbCommonModule,
        AdminModule.createAdminAsync(ADMIN_MODULE_FACTORY),
        ImageListenerModule,
        ModelListenerModule
    ],
    controllers: [],
    providers: []
})
export class AdminDashboardModule {}
