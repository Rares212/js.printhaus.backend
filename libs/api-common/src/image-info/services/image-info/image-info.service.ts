import { Injectable } from '@nestjs/common';
import { ImageInfoRepo } from '@haus/db-common/image-info/repo/image-info.repo/image-info-repo.service';
import { ImageInfoRespDto } from '@printhaus/common';
import { FileInfoService } from '../../../file-info/services/file-info/file-info.service';
import { Types } from 'mongoose';

@Injectable()
export class ImageInfoService {
    constructor(
        private readonly imageInfoRepo: ImageInfoRepo,
        private readonly fileInfoService: FileInfoService
    ) {}

    public async getImageInfo(id: string | Types.ObjectId): Promise<ImageInfoRespDto> {
        const model = await this.imageInfoRepo.findById(id);

        const originalImageUrl = await this.fileInfoService.getPublicUrl(new Types.ObjectId(model.originalImage.id));
        const largeImageUrl = await this.fileInfoService.getPublicUrl(new Types.ObjectId(model.imageLarge.id));
        const mediumImageUrl = await this.fileInfoService.getPublicUrl(new Types.ObjectId(model.imageMedium.id));
        const smallImageUrl = await this.fileInfoService.getPublicUrl(new Types.ObjectId(model.imageSmall.id));

        return new ImageInfoRespDto(
            originalImageUrl,
            largeImageUrl,
            mediumImageUrl,
            smallImageUrl,
            model.viewingPriority,
            model.caption
        );
    }
}
