import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ImageListenerService } from '../../../image-listener/services/image-listener/image-listener.service';
import { InjectModel } from 'nestjs-typegoose';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { ReturnModelType } from '@typegoose/typegoose';
import { AwsS3Service } from '@haus/api-common/file-storage/services/aws-s3/aws-s3.service';
import { ConfigService } from '@nestjs/config';
import { ModelInfo } from '@haus/db-common/model-info/model/model-info';
import { SupportedMeshFileTypes } from "@printhaus/common";
import { Readable } from "stream";
import { streamToBuffer } from "@haus/api-common/util/stream.util";
import { gzipSync } from "fflate";

@Injectable()
export class ModelListenerService implements OnModuleInit, OnModuleDestroy {
    private changeStream: any;

    private readonly logger = new Logger(ModelListenerService.name);

    private readonly gzipExtension = '.gz';
    private readonly gzipMimeType = 'application/gzip';

    constructor(
        @InjectModel(FileInfo) private fileInfoModel: ReturnModelType<typeof FileInfo>,
        @InjectModel(ModelInfo) private modelInfoModel: ReturnModelType<typeof ModelInfo>,
        private s3Service: AwsS3Service,
    ) {}

    onModuleInit() {
        this.changeStream = this.fileInfoModel.watch();
        this.changeStream.on('change', this.handleChange.bind(this));
    }

    onModuleDestroy() {
        if (this.changeStream) {
            this.changeStream.close();
        }
    }

    // This listener should only be used for model files (stl, obj etc)
    // It should listen for uploads from the admin dashboard,
    // gzip the files, change the file extension and upload the file to S3
    // Also, it should create a corresponding ModelInfo document
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

            // AdminJS first creates a document with only the title and then updates it with the rest of the fields
            if (!fileInfo.mime || !fileInfo.bucket || !fileInfo.s3Key) {
                return;
            }

            if (this.isModelFile(fileInfo.s3Key)) {
                const originalFile = await this.s3Service.getFile(fileInfo.s3Key, fileInfo.bucket);

                if (originalFile.Body instanceof Readable) {
                    const fileBuffer = await streamToBuffer(originalFile.Body);
                    const extension = this.getFileExtension(fileInfo.s3Key);

                    await this.convertFileToGzip(fileBuffer, fileInfo);
                    await this.createModelInfoRecord(fileInfo, extension as SupportedMeshFileTypes);
                }
            }
        }
    }

    private async convertFileToGzip(fileBuffer: Buffer, fileInfo: FileInfo): Promise<void> {
        const originalFilename = this.getFilenameFromKey(fileInfo.s3Key);
        const newFilename = this.replaceExtension(originalFilename, this.gzipExtension);
        const newKey = fileInfo.s3Key.replace(originalFilename, newFilename);

        const zippedFile = gzipSync(fileBuffer, { mtime: 0, filename: newFilename });

        await this.s3Service.uploadFile(zippedFile, fileInfo.bucket, newKey);
        await this.s3Service.deleteFile(fileInfo.s3Key, fileInfo.bucket);

        await this.fileInfoModel.findByIdAndUpdate(fileInfo.id, { mime: this.gzipMimeType, s3Key: newKey }).exec();

        this.logger.log(`Successfully converted ${fileInfo.title} to gzip`);
    }

    private async createModelInfoRecord(fileInfo: FileInfo, fileType: SupportedMeshFileTypes): Promise<void> {
        let modelInfo: ModelInfo = await this.modelInfoModel.findOne({ title: fileInfo.title }).exec();
        if (!modelInfo) {
            return;
        }

        modelInfo = new ModelInfo();
        modelInfo.file = fileInfo;
        modelInfo.title = fileInfo.title;
        modelInfo.compressed = true;
        modelInfo.fileExtension = fileType;

        await this.modelInfoModel.create(modelInfo);

        this.logger.log(`Created model info record for ${fileInfo.title}`);
    }

    private getFileExtension(filename: string): string {
        return filename.split('.').pop();
    }

    private isModelFile(filename: string): boolean {
        const extension = this.getFileExtension(filename);
        const values = Object.values(SupportedMeshFileTypes);

        for (let value of values) {
            if (extension === value) {
                return true;
            }
        }

        return false;
    }

    private replaceExtension(filename: string, extension: string): string {
        return filename.replace(/\.[^/.]+$/, extension);
    }

    private getFilenameFromKey(key: string): string {
        return key.split('/').pop();
    }
}
