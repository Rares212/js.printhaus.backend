import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            max: 100, // maximum number of items in cache
            ttl: 60 // seconds
        })
    ]
})
export class CachingConfigModule {}
