import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { FileInfo } from '@src/app/haus-file/models/file-info';
import { FileInfoDto } from '@printnuts/common';

export class FileInfoProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                FileInfo,
                FileInfoDto
            );
        };
    }
}
