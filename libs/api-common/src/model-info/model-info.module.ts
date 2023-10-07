import { Module } from '@nestjs/common';
import { ModelInfoService } from './services/model-info/model-info.service';
import { ModelInfoDbModule } from "@haus/db-common/model-info/model-info-db.module";
import { FileStorageModule } from "@haus/api-common/file-storage/file-storage.module";

@Module({
  imports: [ModelInfoDbModule, FileStorageModule],
  providers: [ModelInfoService],
  exports: [ModelInfoService]
})
export class ModelInfoModule {}
