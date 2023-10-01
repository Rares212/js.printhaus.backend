import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core";

import {  HausUserDto } from '@printhaus/common';
import { AuthUser } from "@haus/db-common/db-common/auth-user/model/auth-user";

export class AuthUserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, AuthUser, HausUserDto);
        }
    }
}