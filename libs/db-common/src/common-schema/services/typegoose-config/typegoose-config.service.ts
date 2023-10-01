import { Injectable } from '@nestjs/common';
import {
    TypegooseOptionsFactory,
    TypegooseModuleOptions
} from "nestjs-typegoose";
import {ConfigService} from "@nestjs/config";
import {CONFIG_KEYS} from "../../../../../../apps/public-api/src/common/util/config-keys.enum";

@Injectable()
export class TypegooseConfigService implements TypegooseOptionsFactory {
    constructor(private configService: ConfigService) {
    }

    createTypegooseOptions(): Promise<TypegooseModuleOptions> | TypegooseModuleOptions {
        return {
            uri: this.configService.get(CONFIG_KEYS.DB.MONGODB_URI)
        };
    }

}

