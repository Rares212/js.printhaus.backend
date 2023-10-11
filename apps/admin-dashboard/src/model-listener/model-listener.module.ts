import { Module } from '@nestjs/common';
import { ModelListenerService } from './services/model-listener/model-listener.service';
import { FileInfoDbModule } from '@haus/db-common/file-info/file-info-db.module';
import { ModelInfoDbModule } from '@haus/db-common/model-info/model-info-db.module';
import { FileStorageModule } from '@haus/api-common/file-storage/file-storage.module';

@Module({
    imports: [FileInfoDbModule, ModelInfoDbModule, FileStorageModule],
    providers: [ModelListenerService]
})
export class ModelListenerModule {}
