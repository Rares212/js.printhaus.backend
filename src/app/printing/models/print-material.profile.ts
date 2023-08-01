import {AutomapperProfile, InjectMapper} from "@automapper/nestjs";
import {createMap, Mapper, MappingProfile, typeConverter} from "@automapper/core";
import {PrintMaterial} from "@src/app/printing/models/print-material";
import { PrintMaterialDto } from "@printnuts/common";
import { Schema } from "mongoose";

export class PrintMaterialProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, PrintMaterial, PrintMaterialDto,
                      typeConverter(Schema.Types.ObjectId, String, (id) => id.toString()))
        }
    }
}