import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ModelInfoRepo } from '@haus/db-common/model-info/repo/model-info.repo';
import { FileInfoRepo } from "@haus/db-common/file-info/repo/file-info.repo/file-info.repo";
import { AwsS3Service } from "@haus/api-common/file-storage/services/aws-s3/aws-s3.service";
import { Types } from 'mongoose';
import { ModelInfoRespDto } from "@printhaus/common";

@Injectable()
export class ModelInfoService {
    private logger = new Logger(ModelInfoService.name);

    constructor(private readonly modelInfoRepo: ModelInfoRepo,
                private readonly storageService: AwsS3Service) {}

    public async getModelSignedUrl(id: string | Types.ObjectId, expirationTime: number = 3600): Promise<ModelInfoRespDto> {
        const model = await this.modelInfoRepo.findById(id);

        if (!model) {
            throw new HttpException('Model not found', 404);
        }

        const url = await this.storageService.createSignedUrl(model.file.s3Key, model.file.bucket, expirationTime);
        return {
            signedUrl: url,
            compressed: model.compressed,
            fileExtension: model.fileExtension
        }
    }
}
