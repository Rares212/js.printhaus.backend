import { Module } from '@nestjs/common';
import { ImageInfoService } from './services/image-info/image-info.service';
import { ImageInfoDbModule } from "@haus/db-common/image-info/image-info-db.module";
import { FileInfoModule } from "@haus/api-common/file-info/file-info.module";

@Module({
  imports: [ImageInfoDbModule, FileInfoModule],
  providers: [ImageInfoService],
  exports: [ImageInfoService]
})
export class ImageInfoModule {}
