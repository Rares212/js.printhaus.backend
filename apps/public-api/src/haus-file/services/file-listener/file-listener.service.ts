import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { FileInfo } from '@src/haus-file/models/file-info';
import { ReturnModelType } from '@typegoose/typegoose';
import { DictionaryValue } from '@src/dictionary/models/dictionary-value';
import { AwsS3Service } from '@src/haus-file-storage/services/aws-s3/aws-s3.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '@src/common/util/config-keys.enum';
import { Readable } from 'stream';
import { streamToBuffer } from '@src/common/util/stream.util';
import { GetObjectOutput } from '@aws-sdk/client-s3';
import * as sharp from "sharp";
import { WebpOptions } from "sharp";
import { IMAGE_THUMBNAIL_POSTFIX } from "@src/haus-file/util/file.constants";

@Injectable()
export class FileListenerService implements OnModuleInit, OnModuleDestroy {
    private changeStream: any;

    private readonly logger = new Logger(FileListenerService.name);
    private readonly webpSettings: WebpOptions = {
      quality: 80,
      lossless: false,
      nearLossless: false,
      alphaQuality: 100,
      effort: 4
    };
    private readonly webpMimeType = 'image/webp';

    constructor(
        @InjectModel(FileInfo) private fileInfoModel: ReturnModelType<typeof FileInfo>,
        private s3Service: AwsS3Service,
        private configService: ConfigService
    ) {}

    onModuleInit() {
        this.changeStream = this.fileInfoModel.watch();
        this.changeStream.on('change', this.handleChange.bind(this));
    }

    async handleChange(change) {
        if ((change.operationType === 'insert' ||
             change.operationType === 'update' ||
             change.operationType === 'replace') &&
            (change.fullDocument || change.documentKey)) {

            let fileInfo: FileInfo = null;
            if (change.fullDocument) {
                fileInfo = change.fullDocument;
            } else if (change.documentKey) {
                fileInfo = await this.fileInfoModel.findById(change.documentKey._id).exec();
            } else {
                this.logger.warn(`File info document ${fileInfo.title} is missing fullDocument and documentKey`);
                return;
            }

            if (fileInfo.title && fileInfo.title.endsWith(IMAGE_THUMBNAIL_POSTFIX)) {
                return;
            }

            if (!fileInfo.mime || !fileInfo.bucket || !fileInfo.s3Key) {
                this.logger.warn(`File info document ${fileInfo.title} is missing mime, bucket, or s3Key`);
                return;
            }

            if (fileInfo.mime.startsWith('image/')) {
                // Download the original image from S3
                const originalImage = await this.s3Service.getFile(fileInfo.s3Key, fileInfo.bucket);

                if (originalImage.Body instanceof Readable) {
                    const imageBuffer = await streamToBuffer(originalImage.Body);
                    await this.generateThumbnail(imageBuffer, fileInfo);
                    if (fileInfo.mime !== this.webpMimeType) {
                        await this.convertImageToWebp(imageBuffer, fileInfo);
                    }
                }
            }
        }
    }

    private async generateThumbnail(image: Buffer, fileInfo: FileInfo) {
        // Resize the image to create a thumbnail
        const thumbnailBuffer = await sharp(image)
            .resize(Number(this.configService.get(CONFIG_KEYS.IMAGE.THUMBNAIL_SIZE_PX)))
            .webp(this.webpSettings)
            .toBuffer();

        // Check if thumbnail already exists and update it
        const existingThumbnailFileInfo: FileInfo = await this.fileInfoModel.findOne({ title: `${fileInfo.title}-thumbnail` }).exec();
        if (existingThumbnailFileInfo) {
            await this.s3Service.uploadFile(thumbnailBuffer, existingThumbnailFileInfo.bucket, existingThumbnailFileInfo.s3Key);
            return;
        }

        // Upload the thumbnail to S3
        const thumbnailUploadResult = await this.s3Service.uploadFile(thumbnailBuffer, fileInfo.bucket);

        // Insert a new FileInfo document with the thumbnail details
        let thumbnailFileInfo = new FileInfo();
        thumbnailFileInfo.title = `${fileInfo.title}${IMAGE_THUMBNAIL_POSTFIX}`;
        thumbnailFileInfo.s3Key = thumbnailUploadResult.fileKey;
        thumbnailFileInfo.bucket = thumbnailUploadResult.bucketName;
        thumbnailFileInfo.mime = this.webpMimeType;
        thumbnailFileInfo.comment = 'Thumbnail for ' + fileInfo.title;

        await this.fileInfoModel.create(thumbnailFileInfo);
    }

    private async convertImageToWebp(image: Buffer, fileInfo: FileInfo) {
        const webpBuffer = await sharp(image)
            .webp(this.webpSettings)
            .toBuffer();

        await this.s3Service.uploadFile(webpBuffer, fileInfo.bucket, fileInfo.s3Key);

        await this.fileInfoModel.findByIdAndUpdate(fileInfo.id, { mime: this.webpMimeType }).exec();
    }

    onModuleDestroy() {
        if (this.changeStream) {
            this.changeStream.close();
        }
    }
}