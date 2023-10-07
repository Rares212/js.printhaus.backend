import { HttpException, Injectable } from "@nestjs/common";
import { AwsS3Service } from "@haus/api-common/file-storage/services/aws-s3/aws-s3.service";
import { FileInfoRepo } from "@haus/db-common/file-info/repo/file-info.repo/file-info.repo";
import { Types } from "mongoose";

@Injectable()
export class FileInfoService {
    constructor(private readonly fileInfoRepo: FileInfoRepo,
                private readonly storageService: AwsS3Service) {}

    public async getPublicUrl(id: string | Types.ObjectId): Promise<string> {
        const model = await this.fileInfoRepo.findById(id);
        if (!model) {
            throw new HttpException('File not found', 404);
        }

        return this.storageService.getPublicUrl(model.s3Key, model.bucket);
    }

    public async getSignedUrl(id: string, expiration: number = 3600): Promise<string> {
        const model = await this.fileInfoRepo.findById(id);
        if (!model) {
            throw new HttpException('File not found', 404);
        }

        return this.storageService.createSignedUrl(model.s3Key, model.bucket, expiration);
    }
}
