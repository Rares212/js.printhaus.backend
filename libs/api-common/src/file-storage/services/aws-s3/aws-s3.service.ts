import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectOutput,
    PutObjectCommand,
    PutObjectOutput,
    S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CONFIG_KEYS } from '@haus/api-common/config/util/config-keys.enum';
import {
    StreamingBlobPayloadInputTypes
} from "@smithy/types/dist-types/streaming-payload/streaming-blob-payload-input-types";

@Injectable()
export class AwsS3Service {
    private s3: S3Client;

    constructor(private configService: ConfigService) {
        this.s3 = new S3Client({
            credentials: {
                accessKeyId: this.configService.get(CONFIG_KEYS.AWS_S3.ACCESS_KEY),
                secretAccessKey: this.configService.get(CONFIG_KEYS.AWS_S3.SECRET_ACCESS_KEY)
            },
            region: this.configService.get('AWS_REGION')
        });
    }

    async uploadFile(file: StreamingBlobPayloadInputTypes, bucketName: string, key: string = uuidv4()): Promise<UploadResult> {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Body: file,
            Key: key
        });

        const output = await this.s3.send(command);
        return {
            fileKey: key,
            bucketName: bucketName,
            s3Output: output
        };
    }

    async getFile(fileKey: string, bucketName: string): Promise<GetObjectOutput> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        return this.s3.send(command);
    }

    async deleteFile(fileKey: string, bucketName: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        await this.s3.send(command);
    }

    async createSignedUrl(fileKey: string, bucketName: string, expiration: number = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        // @ts-ignore
        return getSignedUrl(this.s3 as Client, command, { expiresIn: expiration });
    }

    async getPublicUrl(fileKey: string, bucketName: string): Promise<string> {
        return `https://${bucketName}.s3.${this.configService.get(CONFIG_KEYS.AWS_S3.REGION)}.amazonaws.com/${fileKey}`;
    }
}

export interface UploadResult {
    fileKey: string;
    bucketName: string;
    s3Output: PutObjectOutput;
}
