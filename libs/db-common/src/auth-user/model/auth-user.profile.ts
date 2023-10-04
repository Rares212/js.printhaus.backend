import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AuthUser } from '@haus/db-common/auth-user/model/auth-user';
import { AuthUserDto } from '@printhaus/common';

export class AuthUserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, AuthUser, AuthUserDto);
        };
    }
}
