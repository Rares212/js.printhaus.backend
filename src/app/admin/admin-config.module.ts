import { Module } from '@nestjs/common';
import { SchemaModule } from '@src/app/common/schema/schema.module';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from 'nestjs-typegoose';
import { PrintMaterial } from '@src/app/printing/models/print-material';
import { PrintMaterialType } from '@src/app/printing/models/print-material-type';
import { FileInfo } from '@src/app/common/models/file-info';
import { getModelForClass } from '@typegoose/typegoose';
import uploadFeature from '@adminjs/upload';
import { CONFIG_KEYS } from '@src/app/common/util/config-keys.enum';
import { AdminModule } from "@adminjs/nestjs";
import { DictionaryValue } from "@src/app/common/models/dictionary-value";
import { DictionaryService } from "@src/app/common/services/dictionary/dictionary.service";

@Module({
    imports: [
        AdminModule.createAdminAsync({
            imports: [SchemaModule],
            inject: [
                ConfigService,
                getModelToken(PrintMaterial.name),
                getModelToken(PrintMaterialType.name),
                getModelToken(FileInfo.name),
                getModelToken(DictionaryValue.name)
            ],
            useFactory: (configService: ConfigService) => {
                return {
                    adminJsOptions: {
                        rootPath: '/admin',
                        resources: [
                            {
                                resource: getModelForClass(PrintMaterial)
                            },
                            {
                                resource: getModelForClass(PrintMaterialType)
                            },
                            {
                                resource: getModelForClass(DictionaryValue),
                            },
                            {
                                resource: getModelForClass(FileInfo),
                                options: {
                                    properties: {
                                        comment: {
                                            type: 'textarea',
                                            isSortable: false
                                        }
                                    }
                                },
                                features: [
                                    uploadFeature({
                                        provider: {
                                            aws: {
                                                region: configService.get(
                                                    CONFIG_KEYS.AWS_S3.REGION
                                                ),
                                                bucket: configService.get(
                                                    CONFIG_KEYS.AWS_S3
                                                        .IMAGE_BUCKET_NAME
                                                ),
                                                accessKeyId: configService.get(
                                                    CONFIG_KEYS.AWS_S3
                                                        .ACCESS_KEY
                                                ),
                                                secretAccessKey:
                                                    configService.get(
                                                        CONFIG_KEYS.AWS_S3
                                                            .SECRET_ACCESS_KEY
                                                    )
                                            }
                                        },
                                        properties: {
                                            key: 's3Key',
                                            mimeType: 'mime',
                                            bucket: 'bucket'
                                        },
                                        validation: {
                                            maxSize:
                                                configService.get(CONFIG_KEYS.IMAGE.MAX_IMAGE_SIZE_MB) *
                                                1024 *
                                                1024,
                                            mimeTypes: [
                                                'image/jpeg',
                                                'image/png',
                                                'image/gif',
                                                'image/webp'
                                            ]
                                        }
                                    })
                                ]
                            }
                        ]
                    },
                    auth: {
                        authenticate: async (
                            email: string,
                            password: string
                        ) => {
                            const admin = {
                                email: configService.get(
                                    CONFIG_KEYS.ADMIN.ADMIN_USERNAME
                                ),
                                password: configService.get(
                                    CONFIG_KEYS.ADMIN.ADMIN_PASSWORD
                                )
                            };
                            if (
                                email === admin.email &&
                                password === admin.password
                            ) {
                                return Promise.resolve(admin);
                            }
                            return null;
                        },
                        cookieName: configService.get(
                            CONFIG_KEYS.ADMIN.ADMIN_COOKIE_NAME
                        ),
                        cookiePassword: configService.get(
                            CONFIG_KEYS.ADMIN.ADMIN_COOKIE_PASSWORD
                        )
                    },
                    sessionOptions: {
                        resave: true,
                        saveUninitialized: true,
                        secret: configService.get(
                            CONFIG_KEYS.ADMIN.ADMIN_SECRET
                        )
                    }
                };
            }
        })
    ]
})
export class AdminConfigModule {}