import { Module } from '@nestjs/common';
import { getEnvPath } from './common/util/config.util';
import { ConfigModule } from '@nestjs/config';

const envFilePath: string = getEnvPath(`${__dirname}/env-config`);

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath
        })
    ]
})
export class PublicApiModule {}
