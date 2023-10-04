import { Module } from '@nestjs/common';
import { ImageInfoRepo } from './repo/image-info.repo/image-info-repo.service';
import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { ImageInfoProfile } from '@haus/db-common/image-info/model/image-info.profile';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
    imports: [TypegooseModule.forFeature([ImageInfo])],
    providers: [ImageInfoRepo, ImageInfoProfile],
    exports: [ImageInfoRepo]
})
export class ImageInfoDbModule {}
