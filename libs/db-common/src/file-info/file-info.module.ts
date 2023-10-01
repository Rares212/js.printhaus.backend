import { Module } from '@nestjs/common';
import { FileInfoRepo } from './repo/file-info.repo/file-info.repo';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';
import { FileInfoProfile } from '@haus/db-common/file-info/model/file-info.profile';
import { TypegooseModule } from "nestjs-typegoose";

@Module({
    imports: [TypegooseModule.forFeature([FileInfo])],
    providers: [FileInfoProfile, FileInfoRepo]
})
export class FileInfoModule {}
