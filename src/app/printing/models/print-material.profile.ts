import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { PrintMaterial } from '@src/app/printing/models/print-material';
import { PrintMaterialDto } from '@printnuts/common';
import { Types } from 'mongoose';

export class PrintMaterialProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                PrintMaterial,
                PrintMaterialDto,
                forMember(
                    (dest) => dest.id,
                    mapFrom((src) => src.id)
                ),
                forMember(
                    (dest) => dest.materialTypeId,
                    mapFrom((src) => new Types.ObjectId(src.materialType.id).toString())
                )
            );
        };
    }
}
