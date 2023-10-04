import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TypegooseConfigService } from '@haus/db-common/common-schema/services/typegoose-config/typegoose-config.service';
import { DbCommonModule } from '@haus/db-common';
import { getEnvPath } from '@haus/api-common/config/util/config.util';
import { ConfigModule } from '@nestjs/config';

const envFilePath: string = getEnvPath(`${__dirname}/env-config`);

@Module({
    imports: [
        TypegooseModule.forRootAsync({
            useClass: TypegooseConfigService
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath
        }),
        DbCommonModule
    ],
    controllers: [],
    providers: []
})
export class AdminDashboardModule {}
