import { ConfigService } from '@nestjs/config';
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import uploadFeature from '@adminjs/upload';
import { CONFIG_KEYS } from '@haus/api-common/config/util/config-keys.enum';
import { ResourceWithOptions } from "adminjs";
import { v4 as uuidv4 } from 'uuid';
import { FileUtil } from "@haus/api-common/util/file.util";

export function getFileInfoImageResource(resource: ReturnModelType<typeof FileInfo>, configService: ConfigService): ResourceWithOptions {
    return {
        resource: resource,
        options: {
            id: 'FileInfo',
            sort: {
                sortBy: 'updatedAt',
                direction: 'desc'
            },
            properties: {
                comment: {
                    type: 'textarea',
                    isSortable: false
                },
                createdAt: {
                    isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false
                    }
                },
                updatedAt: {
                    isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false
                    }
                },
                s3Key: {
                    isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false
                    }
                },
                mime: {
                    isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false
                    }
                },
                bucket: {
                    isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false
                    }
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
                // Set filename as uuidv4 + extension
                uploadPath: (record, filename) => FileUtil.generateFileKey(filename),
                properties: {
                    key: 's3Key',
                    mimeType: 'mime',
                    bucket: 'bucket'
                },
                validation: {
                    maxSize: configService.get(CONFIG_KEYS.IMAGE.MAX_IMAGE_SIZE_MB) * 1024 * 1024,
                    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
                }
            })
        ]
    };
}