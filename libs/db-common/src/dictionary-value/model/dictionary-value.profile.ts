import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { DictionaryValueDto } from '@printhaus/common';
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';

export class DictionaryValueProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, DictionaryValue, DictionaryValueDto);
        };
    }
}
