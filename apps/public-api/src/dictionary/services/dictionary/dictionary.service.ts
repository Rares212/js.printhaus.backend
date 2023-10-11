import { Injectable, Logger } from '@nestjs/common';
import { DictionaryKey, DictionaryValueDto } from "@printhaus/common";
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { DictionaryValueRepo } from '@haus/db-common/dictionary-value/repo/dictionary-value.repo';
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';

@Injectable()
export class DictionaryService {
    private readonly logger = new Logger(DictionaryService.name);

    constructor(
        private readonly dictionaryValueRepo: DictionaryValueRepo,
        @InjectMapper() private readonly mapper: Mapper
    ) {}

    // @Cacheable({key: 'DICTIONARY_VALUE'})
    async findByKey(key: DictionaryKey): Promise<DictionaryValueDto> {
        return this.dictionaryValueRepo
            .findByKey(key)
            .then((dictionaryValue) => {
                return this.mapper.map(dictionaryValue, DictionaryValue, DictionaryValueDto);
            })
            .catch((err) => {
                this.logger.warn(err);
                return null;
            });
    }
}
