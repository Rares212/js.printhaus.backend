import { Module } from '@nestjs/common';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { FileInfoProfile } from '@haus/db-common/file-info/model/file-info.profile';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import { FileInfoRepo } from '@haus/db-common/file-info/repo/file-info.repo/file-info.repo';

@Module({
    imports: [TypegooseModule.forFeature([FileInfo])],
    providers: [FileInfoProfile, FileInfoRepo],
    exports: [FileInfoRepo]
})
export class FileInfoDbModule {}
