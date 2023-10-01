import { Module } from '@nestjs/common';
import { ApiCommonService } from './api-common.service';
import { AuthModule } from './auth/auth.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { CachingModule } from './caching/caching.module';

@Module({
  providers: [ApiCommonService],
  exports: [ApiCommonService],
  imports: [AuthModule, FileStorageModule, CachingModule],
})
export class ApiCommonModule {}
