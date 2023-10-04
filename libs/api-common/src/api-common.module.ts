import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FileStorageModule } from './file-storage/file-storage.module';

@Module({
    imports: [AuthModule, FileStorageModule],
    exports: [AuthModule, FileStorageModule]
})
export class ApiCommonModule {}
