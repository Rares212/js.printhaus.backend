import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Types } from 'mongoose';
import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { ImageInfoDto } from '@printhaus/common';

export class ImageInfoProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                ImageInfo,
                ImageInfoDto,
                forMember(
                    (dest) => dest.id,
                    mapFrom((src) => src.id)
                )
            );
        };
    }
}
