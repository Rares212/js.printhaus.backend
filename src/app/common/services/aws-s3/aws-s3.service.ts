import { Injectable } from '@nestjs/common';
import { CONFIG_KEYS } from '@src/app/common/util/config-keys.enum';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import {
    GetObjectCommand,
    GetObjectOutput,
    PutObjectCommand,
    PutObjectOutput,
    S3Client
} from "@aws-sdk/client-s3";

@Injectable()
export class AwsS3Service {
    private s3: S3Client;

    constructor(private configService: ConfigService) {
        this.s3 = new S3Client({
            credentials: {
                accessKeyId: this.configService.get(
                    CONFIG_KEYS.AWS_S3.ACCESS_KEY
                ),
                secretAccessKey: this.configService.get(
                    CONFIG_KEYS.AWS_S3.SECRET_ACCESS_KEY
                )
            },
            region: this.configService.get('AWS_REGION')
        });
    }

    // Bucket name defaults to S3_BUCKET_NAME if not provided
    async uploadFile(
        file: Express.Multer.File,
        bucketName?: string
    ): Promise<PutObjectOutput> {
        bucketName = bucketName
            ? bucketName
            : this.configService.get('S3_BUCKET_NAME');

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Body: file.buffer,
            Key: uuidv4()
        });

        return this.s3.send(command);
    }

    async getFile(
        fileKey: string,
        bucketName?: string
    ): Promise<GetObjectOutput> {
        bucketName = bucketName
            ? bucketName
            : this.configService.get('S3_BUCKET_NAME');

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        return this.s3.send(command);
    }
}
