import { Injectable } from '@nestjs/common';
import { CONFIG_KEYS } from '@src/common/util/config-keys.enum';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { GetObjectCommand, GetObjectOutput, PutObjectCommand, PutObjectOutput, S3Client } from '@aws-sdk/client-s3';
import { Readable } from "stream";

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

    // Bucket name defaults to S3_BUCKET_NAME if not provided
    async uploadFile(file: Buffer, bucketName?: string, key?: string): Promise<UploadResult> {
        bucketName = bucketName ? bucketName : this.configService.get('S3_BUCKET_NAME');
        key = key ? key : uuidv4();

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
        }
    }

    async getFile(fileKey: string, bucketName?: string, expiryTime: number = 3600): Promise<GetObjectOutput> {
        bucketName = bucketName ? bucketName : this.configService.get('S3_BUCKET_NAME');

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        return this.s3.send(command);
    }

    async getPresignedUrl(fileKey: string, bucketName?: string): Promise<string> {
        bucketName = bucketName ? bucketName : this.configService.get(CONFIG_KEYS.AWS_S3.IMAGE_BUCKET_NAME);

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        return this.s3. getSignedUrl(command);
    }
}

export interface UploadResult {
    fileKey: string;
    bucketName: string;
    s3Output: PutObjectOutput;
}
