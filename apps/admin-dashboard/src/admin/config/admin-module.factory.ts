import { AdminModuleFactory } from '@adminjs/nestjs/src/interfaces/admin-module-factory.interface';
import { CustomLoader } from '@adminjs/nestjs/src/interfaces/custom-loader.interface';
import { DbCommonModule } from '@haus/db-common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from 'nestjs-typegoose';
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';
import { PrintMaterialType } from '@haus/db-common/print-material-type/model/print-material-type';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';
import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { ModelInfo } from '@haus/db-common/model-info/model/model-info';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';

import { AuthUser } from "@haus/db-common/auth-user/model/auth-user";

import { UserRating } from "@haus/db-common/user-rating/model/user-rating";

import { AdminModuleOptions } from "@adminjs/nestjs";
import { getPrintMaterialResource } from "../resources/print-material.resource";
import { getPrintMaterialTypeResource } from "../resources/print-material-type.resource";
import { getDictionaryValueResource } from "../resources/dictionary-value.resource";
import { getFileInfoResource } from "../resources/file-info.resource";
import { getModelInfoResource } from "../resources/model-info.resource";
import { getShopItemResource } from "../resources/shop-item.resource";
import { getUserRatingResource } from "../resources/user-rating.resource";
import { getAuthUserResource } from "../resources/auth-user.resource";
import { CONFIG_KEYS } from "@haus/api-common/config/util/config-keys.enum";

export const ADMIN_MODULE_FACTORY: AdminModuleFactory & CustomLoader = {
    imports: [DbCommonModule],
    inject: [
        ConfigService,
        getModelToken(PrintMaterial.name),
        getModelToken(PrintMaterialType.name),
        getModelToken(DictionaryValue.name),
        getModelToken(FileInfo.name),
        getModelToken(ImageInfo.name),
        getModelToken(ModelInfo.name),
        getModelToken(ShopItem.name),
        getModelToken(AuthUser.name),
        getModelToken(UserRating.name)
    ],
    useFactory: (configService: ConfigService,
                 printMaterialModel,
                 printMaterialTypeModel,
                 dictionaryValueModel,
                 fileInfoModel,
                 modelInfoModel,
                 shopItemModel,
                 authUserModel,
                 userRatingModel) => {
        const options: AdminModuleOptions = {
            adminJsOptions: {
                rootPath: '/admin',
                resources: [
                    getPrintMaterialResource(printMaterialModel),
                    getPrintMaterialTypeResource(printMaterialTypeModel),
                    getDictionaryValueResource(dictionaryValueModel),
                    getFileInfoResource(fileInfoModel, configService),
                    getModelInfoResource(modelInfoModel),
                    getShopItemResource(shopItemModel),
                    getAuthUserResource(authUserModel),
                    getUserRatingResource(userRatingModel)
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
        return options;
    }
};