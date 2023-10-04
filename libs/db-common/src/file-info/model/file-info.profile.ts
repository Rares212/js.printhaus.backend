import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { FileInfoDto } from '@printhaus/common';
import { FileInfo } from '@haus/db-common/file-info/model/file-info';

export class FileInfoProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, FileInfo, FileInfoDto);
        };
    }
}
