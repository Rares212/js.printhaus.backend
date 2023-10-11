import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as sharp from 'sharp';
import { WebpOptions } from 'sharp';
import { InjectModel } from 'nestjs-typegoose';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { ReturnModelType } from '@typegoose/typegoose';
import { AwsS3Service } from '@haus/api-common/file-storage/services/aws-s3/aws-s3.service';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { streamToBuffer } from '@haus/api-common/util/stream.util';
import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { Types } from 'mongoose';
import { IMAGE_CONSTANTS } from "@haus/api-common/image-info/util/image-info.util";

@Injectable()
export class ImageListenerService implements OnModuleInit, OnModuleDestroy {
    private changeStream: any;

    private readonly logger = new Logger(ImageListenerService.name);
    private readonly webpSettings: WebpOptions = {
        quality: 80,
        lossless: false,
        nearLossless: false,
        alphaQuality: 100,
        effort: 4
    };
    private readonly webpMimeType = 'image/webp';
    private readonly webpExtension = '.webp';

    constructor(
        @InjectModel(FileInfo) private fileInfoModel: ReturnModelType<typeof FileInfo>,
        @InjectModel(ImageInfo) private imageInfoModel: ReturnModelType<typeof ImageInfo>,
        private s3Service: AwsS3Service,
        private configService: ConfigService
    ) {}

    onModuleInit() {
        this.changeStream = this.fileInfoModel.watch();
        this.changeStream.on('change', this.handleChange.bind(this));
    }

    async handleChange(change: any) {
        if (
            (change.operationType === 'insert' ||
                change.operationType === 'update' ||
                change.operationType === 'replace') &&
            (change.fullDocument || change.documentKey)
        ) {
            let fileInfo: FileInfo = null;
            if (change?.fullDocument) {
                fileInfo = change.fullDocument;
            } else if (change?.documentKey) {
                fileInfo = await this.fileInfoModel.findById(change.documentKey._id).exec();
            } else {
                this.logger.warn(`File info document ${fileInfo.title} is missing fullDocument and documentKey`);
                return;
            }

            if (fileInfo.title && this.endsWithAnyPostfix(fileInfo.title)) {
                return;
            }

            // AdminJS first creates a document with only the title and then updates it with the rest of the fields
            if (!fileInfo.mime || !fileInfo.bucket || !fileInfo.s3Key) {
                return;
            }

            if (fileInfo.mime.startsWith('image/')) {
                const originalImage = await this.s3Service.getFile(fileInfo.s3Key, fileInfo.bucket);

                if (originalImage.Body instanceof Readable) {
                    const imageBuffer = await streamToBuffer(originalImage.Body);

                    // This will update the file info. The thumbnails will be generated in the next update event
                    if (fileInfo.mime !== this.webpMimeType) {
                        await this.convertImageToWebp(imageBuffer, fileInfo);
                        return;
                    }

                    let thumbnails: FileInfo[] = [];
                    for (const key in IMAGE_CONSTANTS) {
                        thumbnails.push(
                            await this.generateThumbnail(
                                imageBuffer,
                                fileInfo,
                                IMAGE_CONSTANTS[key].WIDTH,
                                IMAGE_CONSTANTS[key].POSTFIX
                            )
                        );
                    }

                    await this.createImageInfoRecord(fileInfo, thumbnails);
                }
            }
        }
    }

    private async generateThumbnail(
        image: Buffer,
        fileInfo: FileInfo,
        width: number,
        postfix: string
    ): Promise<FileInfo> {
        const thumbnailBuffer = await sharp(image).resize(width).webp(this.webpSettings).toBuffer();

        const existingThumbnailFileInfo: FileInfo = await this.fileInfoModel
            .findOne({ title: `${fileInfo.title}${postfix}` })
            .exec();
        if (existingThumbnailFileInfo) {
            await this.s3Service.uploadFile(
                thumbnailBuffer,
                existingThumbnailFileInfo.bucket,
                existingThumbnailFileInfo.s3Key
            );
            this.logger.log(`Updated thumbnail ${existingThumbnailFileInfo.title}`);
            return existingThumbnailFileInfo;
        }

        // Generate s3 key with the postfix
        const thumbnailFileKey = fileInfo.s3Key.replace(/\.[^/.]+$/, `${postfix}${this.webpExtension}`);

        // Upload the thumbnail to S3
        const thumbnailUploadResult = await this.s3Service.uploadFile(thumbnailBuffer, fileInfo.bucket, thumbnailFileKey);

        // Insert a new FileInfo document with the thumbnail details
        const thumbnailFileInfo = new FileInfo();
        thumbnailFileInfo.title = `${fileInfo.title}${postfix}`;
        thumbnailFileInfo.s3Key = thumbnailUploadResult.fileKey;
        thumbnailFileInfo.bucket = thumbnailUploadResult.bucketName;
        thumbnailFileInfo.mime = this.webpMimeType;
        thumbnailFileInfo.comment = `Thumbnail (${width}px) for ${fileInfo.title}`;

        const createdFile: FileInfo = await this.fileInfoModel.create(thumbnailFileInfo);
        this.logger.log(`Created thumbnail ${thumbnailFileInfo.title}`);
        return createdFile;
    }

    private async createImageInfoRecord(fileInfo: FileInfo, thumbnailFileInfos: FileInfo[]) {
        // Find imageInfo by title or create a new one
        let imageInfo: ImageInfo = await this.imageInfoModel.findOne({ title: fileInfo.title }).exec();
        if (imageInfo) {
            return;
        }

        imageInfo = new ImageInfo();
        imageInfo.title = fileInfo.title;
        imageInfo.originalImage = new Types.ObjectId(fileInfo.id);
        imageInfo.imageSmall = new Types.ObjectId(
            thumbnailFileInfos.find((thumbnailFileInfo) =>
                thumbnailFileInfo.title.endsWith(IMAGE_CONSTANTS['SMALL_IMAGE'].POSTFIX)
            ).id
        );
        imageInfo.imageMedium = new Types.ObjectId(
            thumbnailFileInfos.find((thumbnailFileInfo) =>
                thumbnailFileInfo.title.endsWith(IMAGE_CONSTANTS['MEDIUM_IMAGE'].POSTFIX)
            ).id
        );
        imageInfo.imageLarge = new Types.ObjectId(
            thumbnailFileInfos.find((thumbnailFileInfo) =>
                thumbnailFileInfo.title.endsWith(IMAGE_CONSTANTS['LARGE_IMAGE'].POSTFIX)
            ).id
        );

        await this.imageInfoModel.create(imageInfo);

        this.logger.log(`Created image info record for ${fileInfo.title}`);
    }

    private async convertImageToWebp(image: Buffer, fileInfo: FileInfo): Promise<void> {
        const webpBuffer = await sharp(image).webp(this.webpSettings).toBuffer();

        const webpFileKey = fileInfo.s3Key.replace(/\.[^/.]+$/, this.webpExtension);
        await this.s3Service.uploadFile(webpBuffer, fileInfo.bucket, webpFileKey);

        await this.s3Service.deleteFile(fileInfo.s3Key, fileInfo.bucket);

        await this.fileInfoModel.findByIdAndUpdate(fileInfo.id, { mime: this.webpMimeType, s3Key: webpFileKey }).exec();

        this.logger.log(`Converted ${fileInfo.title} to webp`);
    }

    private endsWithAnyPostfix(title: string): boolean {
        for (const key in IMAGE_CONSTANTS) {
            if (title.endsWith(IMAGE_CONSTANTS[key].POSTFIX)) {
                return true;
            }
        }
        return false;
    }

    onModuleDestroy() {
        if (this.changeStream) {
            this.changeStream.close();
        }
    }
}
