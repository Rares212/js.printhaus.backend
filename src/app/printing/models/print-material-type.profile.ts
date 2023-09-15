import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { PrintMaterial } from "@src/app/printing/models/print-material";
import { PrintMaterialType } from "@src/app/printing/models/print-material-type";
import { PrintMaterialTypeDto } from '@printnuts/common';

export class PrintMaterialTypeProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, PrintMaterialType, PrintMaterialTypeDto, forMember(
                (dest) => dest.id,
                mapFrom((src) => src.id)
            ));
        }
    }
}