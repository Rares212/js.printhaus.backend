import { AdminModule } from "@adminjs/nestjs";
import { PrintingModule } from "./app/printing/printing.module";
import { ShopModule } from "./app/shop/shop.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CommonModule } from "./app/common/common.module";
import { getEnvPath } from "./app/common/util/config.util";
import { getModelToken, TypegooseModule } from "nestjs-typegoose";
import { TypegooseConfigService } from "./app/common/services/typegoose-config/typegoose-config.service";
import { SchemaModule } from "./app/common/schema/schema.module";
import { PrintMaterial } from "./app/printing/models/print-material";
import { getModelForClass } from "@typegoose/typegoose";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { PrintMaterialType } from "@src/app/printing/models/print-material-type";
import { FileInfo } from "@src/app/common/models/file-info";
import { CONFIG_KEYS } from "@src/app/common/util/config-keys.enum";

const uploadFeature = require("@adminjs/upload");

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
        SchemaModule,
        CacheModule.register({
            isGlobal: true
        }),
        AdminModule.createAdminAsync({
            imports: [SchemaModule],
            inject: [
                ConfigService,
                getModelToken(PrintMaterial.name),
                getModelToken(PrintMaterialType.name),
                getModelToken(FileInfo.name)
            ],
            useFactory: (configService: ConfigService) => {
                return {
                    adminJsOptions: {
                        rootPath: "/admin",
                        resources: [
                            {
                                resource: getModelForClass(PrintMaterial)
                            },
                            {
                                resource: getModelForClass(PrintMaterialType)
                            },
                            {
                                resource: getModelForClass(FileInfo),
                                options: {
                                    properties: {
                                        comment: {
                                            type: "textarea",
                                            isSortable: false
                                        }
                                    }
                                },
                                features: [
                                    uploadFeature({
                                        provider: {
                                            aws: {
                                                region: configService.get(CONFIG_KEYS.AWS_S3.REGION),
                                                bucket: configService.get(CONFIG_KEYS.AWS_S3.IMAGE_BUCKET_NAME),
                                                accessKeyId: configService.get(CONFIG_KEYS.AWS_S3.ACCESS_KEY),
                                                secretAccessKey: configService.get(CONFIG_KEYS.AWS_S3.SECRET_ACCESS_KEY)
                                            }
                                        },
                                        properties: {
                                            key: "s3Key",
                                            mimeType: "mime",
                                            bucket: "bucket",
                                        },
                                        validation: {
                                            maxSize: configService.get(CONFIG_KEYS.IMAGE.MAX_IMAGE_SIZE_MB) * 1024 * 1024,
                                            mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"]
                                        }
                                    })
                                ]
                            }
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
                        cookiePassword: configService.get(CONFIG_KEYS.ADMIN.ADMIN_COOKIE_PASSWORD),
                    },
                    sessionOptions: {
                        resave: true,
                        saveUninitialized: true,
                        secret: configService.get(CONFIG_KEYS.ADMIN.ADMIN_SECRET),
                    },
                }
            }

        }),
        CacheModule.register({
            isGlobal: true,
            max: 100, // maximum number of items in cache
            ttl: 60 // seconds
        })
    ],
    providers: []
})
export class AppModule {
}
