import { HttpException, Injectable } from '@nestjs/common';
import { ModelInfoRepo } from '@haus/db-common/model-info/repo/model-info.repo';
import { FileInfoRepo } from "@haus/db-common/file-info/repo/file-info.repo/file-info.repo";
import { AwsS3Service } from "@haus/api-common/file-storage/services/aws-s3/aws-s3.service";
import { Types } from 'mongoose';

@Injectable()
export class ModelInfoService {
    constructor(private readonly modelInfoRepo: ModelInfoRepo,
                private readonly storageService: AwsS3Service) {}

    public async getModelSignedUrl(id: string | Types.ObjectId): Promise<string> {
        const model = await this.modelInfoRepo.findById(id);

        if (!model) {
            throw new HttpException('Model not found', 404);
        }

        return this.storageService.createSignedUrl(model.file.s3Key, model.file.bucket);
    }
}
