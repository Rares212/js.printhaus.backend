import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, MappingProfile } from '@automapper/core';
import { HausImage } from '@src/app/common/models/haus-image';
import { HausImageDto } from '@printnuts/common';
import { Types } from 'mongoose';

export class HausImageProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                HausImage,
                HausImageDto,
                forMember(
                    (dest) => dest.id,
                    mapFrom((src) => src.id)
                ),
                forMember(
                    (dest) => dest.thumbnailId,
                    mapFrom((src) => new Types.ObjectId(src.thumbnail.id).toString())
                ),
                forMember(
                    (dest) => dest.imageId,
                    mapFrom((src) => new Types.ObjectId(src.image.id).toString())
                )
            );
        };
    }
}
