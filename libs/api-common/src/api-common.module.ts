import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { ModelInfoModule } from './model-info/model-info.module';
import { ImageInfoModule } from "@haus/api-common/image-info/image-info.module";
import { FileInfoModule } from "@haus/api-common/file-info/file-info.module";

@Module({
    imports: [AuthModule, FileStorageModule, ModelInfoModule, ImageInfoModule, FileInfoModule],
    exports: [AuthModule, FileStorageModule, ModelInfoModule, ImageInfoModule, FileInfoModule]
})
export class ApiCommonModule {}
