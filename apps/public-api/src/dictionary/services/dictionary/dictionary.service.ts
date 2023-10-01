import { Inject, Injectable, Logger } from "@nestjs/common";
import { DictionaryValueDto } from '@printhaus/common';
import { DictionaryValueRepo } from '@src/dictionary/repos/dictionary-value/dictionary-value.repo';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { DictionaryValue } from '@src/dictionary/models/dictionary-value';

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
