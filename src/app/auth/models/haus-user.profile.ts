import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { HausUser } from "@src/app/auth/models/haus-user";
import {  HausUserDto } from '@printnuts/common';

export class HausUserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, HausUser, HausUserDto);
        }
    }
}