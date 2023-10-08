import { Module } from '@nestjs/common';
import { ImageInfoService } from './services/image-info/image-info.service';
import { ImageInfoDbModule } from "@haus/db-common/image-info/image-info-db.module";
import { FileInfoModule } from "@haus/api-common/file-info/file-info.module";
import { FileInfoDbModule } from "@haus/db-common/file-info/file-info-db.module";
import { FileStorageModule } from "@haus/api-common/file-storage/file-storage.module";

@Module({
  imports: [ImageInfoDbModule, FileInfoModule],
  providers: [ImageInfoService],
  exports: [ImageInfoService]
})
export class ImageInfoModule {}
