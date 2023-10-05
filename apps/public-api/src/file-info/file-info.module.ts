import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileInfoService } from './services/file-info/file-info.service';
import { FileStorageModule } from '@haus/api-common/file-storage/file-storage.module';
import { DbCommonModule } from '@haus/db-common';

@Module({
    imports: [ConfigModule, DbCommonModule, FileStorageModule],
    providers: [
        FileInfoService,
    ],
    exports: [FileInfoService]
})
export class FileInfoModule {}
