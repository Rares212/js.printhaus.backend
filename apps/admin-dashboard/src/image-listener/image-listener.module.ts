import { Module } from '@nestjs/common';
import { ImageListenerService } from './services/image-listener/image-listener.service';
import { FileInfoDbModule } from "@haus/db-common/file-info/file-info-db.module";
import { FileStorageModule } from "@haus/api-common/file-storage/file-storage.module";
import { ImageInfoDbModule } from "@haus/db-common/image-info/image-info-db.module";

@Module({
  imports: [FileInfoDbModule, ImageInfoDbModule, FileStorageModule],
  providers: [ImageListenerService]
})
export class ImageListenerModule {}
