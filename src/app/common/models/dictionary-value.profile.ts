import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { DictionaryValueDto } from '@printnuts/common';
import { DictionaryValue } from "@src/app/common/models/dictionary-value";

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
