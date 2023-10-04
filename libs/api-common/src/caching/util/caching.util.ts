import { Inject, Logger } from '@nestjs/common';
import { catchError, filter, first, from, map, merge, of, tap } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export enum CacheTtlTime {
    ONE_MINUTE = 60,
    ONE_HOUR = 60 * 60,
    ONE_DAY = 60 * 60 * 24,
    ONE_WEEK = 7 * 24 * 60 * 60
}

export class NotCacheableException<T> extends Error {
    public constructor(message: string) {
        super(message);
    }
}

export function Cacheable({ key }: { key?: string }) {
    return function (target: Record<string, any>, _, descriptor: PropertyDescriptor) {
        Inject(CACHE_MANAGER)(target, 'cacheManager'); // Inject the cache manager

        const logger = new Logger('Cache');
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: Array<any>) {
            const entryKey = `${key}[${args.map((res) => JSON.stringify(res)).join(',')}]`;
            logger.log(`Cache Key: ${entryKey}`);

            const { cacheManager } = this;

            const cacheCall$ = from(cacheManager.get(entryKey)).pipe(
                map((cacheData: Array<string> | string | object) => cacheData ?? []),
                catchError((e) => {
                    logger.warn('Cache call errored', e);
                    return of(null);
                })
            );

            const originalResult = originalMethod.apply(this, args);
            const originCall$ =
                originalResult instanceof Promise
                    ? from(originalResult)
                    : originalResult.subscribe && typeof originalResult.subscribe === 'function'
                    ? originalResult
                    : of(originalResult);

            const originWithPipe$ = originCall$.pipe(
                tap((originValue) => cacheManager.set(entryKey, originValue)),
                catchError((e) => {
                    logger.warn('Origin call errored', e);
                    return of(null);
                })
            );

            return merge(cacheCall$, originWithPipe$).pipe(filter(Boolean), first()).toPromise();
        };
    };
}
