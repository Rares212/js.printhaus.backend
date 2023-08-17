import { Inject, Injectable, Logger } from "@nestjs/common";
import { DictionaryValueDto } from '@printnuts/common';
import { DictionaryValueRepo } from '@src/app/common/repos/dictionary-value.repo/dictionary-value.repo';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { DictionaryValue } from '@src/app/common/models/dictionary-value';
import { Cacheable } from "@src/app/caching/util/caching.util";

@Injectable()
export class DictionaryService {
    private readonly logger = new Logger(DictionaryService.name);

    constructor(
        private readonly dictionaryValueRepo: DictionaryValueRepo,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    // @Cacheable({key: 'DICTIONARY_VALUE'})
    async findByKey(key: string): Promise<DictionaryValueDto> {
        return this.dictionaryValueRepo
            .findByKey(key)
            .then((dictionaryValue) => {
                return this.mapper.map(dictionaryValue, DictionaryValue, DictionaryValueDto);
            })
            .catch((err) => {
                this.logger.warn(err);
                return null;
            }
        );
    }
}
