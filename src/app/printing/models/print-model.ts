import {prop, Ref} from "@typegoose/typegoose";
import { PrintQuality } from "@printnuts/common";
import {PrintMaterial} from "./print-material";
import {PrintSettings} from "./print-settings";
import {AutoMap} from "@automapper/classes";

export class PrintModel {
    @prop({required: true})
    @AutoMap()
    geometryData: Buffer;

    @prop({required: true, ref: () => PrintMaterial})
    @AutoMap()
    material: Ref<PrintMaterial>;

    @prop({required: true, ref: () => PrintSettings})
    @AutoMap()
    settings: PrintSettings;
}