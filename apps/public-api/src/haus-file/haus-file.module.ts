import { Module } from '@nestjs/common';
import { FileInfoProfile } from '@src/haus-file/models/file-info.profile';
import { FileListenerService } from './services/file-listener/file-listener.service';
import { CommonModule } from "@src/common/common.module";
import { ConfigModule } from "@nestjs/config";
import { SchemaModule } from "@src/common/schema/schema.module";
import { FileInfoService } from './services/file-info/file-info.service';

@Module({
    imports: [
        CommonModule,
        ConfigModule,
        SchemaModule,
    ],
    providers: [
        FileInfoProfile,
        FileListenerService,
        FileInfoService
    ]
})
export class HausFileModule {}
