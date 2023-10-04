import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass } from '@typegoose/typegoose';
import uploadFeature from '@adminjs/upload';
import { AdminModule } from '@adminjs/nestjs';
import { DbCommonModule } from '@haus/db-common';
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';
import { PrintMaterialType } from '@haus/db-common/print-material-type/model/print-material-type';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';
import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { ModelInfo } from '@haus/db-common/model-info/model/model-info';
import { PRINT_MATERIAL_RESOURCE } from './resources/print-material.resource';
import { PRINT_MATERIAL_TYPE_RESOURCE } from './resources/print-material-type.resource';
import { DICTIONARY_VALUE_RESOURCE } from './resources/dictionary-value.resource';
import { SHOP_ITEM_RESOURCE } from './resources/shop-item.resource';
import { AUTH_USER_RESOURCE } from './resources/auth-user.resource';
import { CONFIG_KEYS } from '@haus/api-common/config/util/config-keys.enum';

@Module({
    imports: [
        AdminModule.createAdminAsync({
            imports: [DbCommonModule],
            inject: [
                ConfigService,
                getModelToken(PrintMaterial.name),
                getModelToken(PrintMaterialType.name),
                getModelToken(FileInfo.name),
                getModelToken(DictionaryValue.name),
                getModelToken(ImageInfo.name),
                getModelToken(ModelInfo.name),
                getModelToken(ShopItem.name)
            ],
            useFactory: (configService: ConfigService) => {
                return {
                    adminJsOptions: {
                        rootPath: '/admin',
                        resources: [
                            PRINT_MATERIAL_RESOURCE,
                            PRINT_MATERIAL_TYPE_RESOURCE,
                            DICTIONARY_VALUE_RESOURCE,
                            SHOP_ITEM_RESOURCE,
                            AUTH_USER_RESOURCE
                        ]
                    },
                    auth: {
                        authenticate: async (email: string, password: string) => {
                            const admin = {
                                email: configService.get(CONFIG_KEYS.ADMIN.ADMIN_USERNAME),
                                password: configService.get(CONFIG_KEYS.ADMIN.ADMIN_PASSWORD)
                            };
                            if (email === admin.email && password === admin.password) {
                                return Promise.resolve(admin);
                            }
                            return null;
                        },
                        cookieName: configService.get(CONFIG_KEYS.ADMIN.ADMIN_COOKIE_NAME),
                        cookiePassword: configService.get(CONFIG_KEYS.ADMIN.ADMIN_COOKIE_PASSWORD)
                    },
                    sessionOptions: {
                        resave: true,
                        saveUninitialized: true,
                        secret: configService.get(CONFIG_KEYS.ADMIN.ADMIN_SECRET)
                    }
                };
            }
        })
    ]
})
export class AdminConfigModule {}
