import { Injectable } from '@nestjs/common';
import { CONFIG_KEYS } from "@src/app/common/util/config-keys.enum";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from 'uuid';
import * as AWS from "aws-sdk";

@Injectable()
export class AwsS3Service {
    private s3: AWS.S3;

    constructor(private configService: ConfigService) {
        this.s3 = new AWS.S3({
            credentials: {
                accessKeyId: this.configService.get(CONFIG_KEYS.AWS_S3.ACCESS_KEY),
                secretAccessKey: this.configService.get(CONFIG_KEYS.AWS_S3.SECRET_ACCESS_KEY),
            },
            region: this.configService.get('AWS_REGION')
        });
    }

    // Bucket name defaults to S3_BUCKET_NAME if not provided
    async uploadFile(file: Express.Multer.File, bucketName?: string): Promise<AWS.S3.ManagedUpload.SendData> {
        bucketName = bucketName ? bucketName : this.configService.get('S3_BUCKET_NAME');
        return await this.s3
            .upload({
                Bucket: bucketName,
                Body: file.buffer,
                Key: uuidv4(),
            })
            .promise();
    }
}
