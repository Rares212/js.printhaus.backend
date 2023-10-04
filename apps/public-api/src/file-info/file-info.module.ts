import { Module } from '@nestjs/common';
import { FileListenerService } from './services/file-listener/file-listener.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileInfoService } from './services/file-info/file-info.service';
import { FileStorageModule } from '@haus/api-common/file-storage/file-storage.module';
import { DbCommonModule } from '@haus/db-common';
import { FileInfoDbModule } from '@haus/db-common/file-info/file-info-db.module';
import { getModelToken } from 'nestjs-typegoose';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { getModelForClass } from '@typegoose/typegoose';

@Module({
    imports: [ConfigModule, DbCommonModule, FileStorageModule],
    providers: [
        FileListenerService,
        FileInfoService,
        { provide: getModelToken(FileInfo.name), useValue: getModelForClass(FileInfo) }
    ],
    exports: [FileInfoService]
})
export class FileInfoModule {}
