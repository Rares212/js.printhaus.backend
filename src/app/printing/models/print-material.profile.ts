import {AutomapperProfile, InjectMapper} from "@automapper/nestjs";
import { beforeMap, createMap, forMember, mapFrom, Mapper, MappingProfile, typeConverter } from "@automapper/core";
import {PrintMaterial} from "@src/app/printing/models/print-material";
import { PrintMaterialDto } from "@printnuts/common";

export class PrintMaterialProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, PrintMaterial, PrintMaterialDto, forMember(
                (dest) => dest.id,
              mapFrom((src) => src.id)
            ));
        }
    }
}