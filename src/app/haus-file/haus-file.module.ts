import { Module } from '@nestjs/common';
import { FileInfoProfile } from '@src/app/haus-file/models/file-info.profile';
import { FileListenerService } from './services/file-listener/file-listener.service';
import { CommonModule } from "@src/app/common/common.module";
import { ConfigModule } from "@nestjs/config";
import { SchemaModule } from "@src/app/common/schema/schema.module";

@Module({
    imports: [
        CommonModule,
        ConfigModule,
        SchemaModule,
    ],
    providers: [
        FileInfoProfile,
        FileListenerService
    ]
})
export class HausFileModule {}
