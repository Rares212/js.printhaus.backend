import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ExchangeRateService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: any) {}
}
