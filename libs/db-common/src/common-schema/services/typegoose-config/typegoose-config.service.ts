import { Injectable } from '@nestjs/common';
import { TypegooseOptionsFactory, TypegooseModuleOptions } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '@haus/api-common/config/util/config-keys.enum';

@Injectable()
export class TypegooseConfigService implements TypegooseOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypegooseOptions(): Promise<TypegooseModuleOptions> | TypegooseModuleOptions {
        console.log(`Creating db connection to ${this.configService.get(CONFIG_KEYS.DB.MONGODB_URI)}`);
        return {
            uri: this.configService.get(CONFIG_KEYS.DB.MONGODB_URI)
        };
    }
}
