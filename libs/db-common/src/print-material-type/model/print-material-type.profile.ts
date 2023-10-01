import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { PrintMaterialTypeDto } from '@printhaus/common';
import { PrintMaterialType } from "@haus/db-common/print-material-type/model/print-material-type";

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