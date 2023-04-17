import {prop, Ref} from "@typegoose/typegoose";
import { PrintQuality } from "@printnuts/common";
import {PrintMaterial} from "./print-material";
import {PrintSettings} from "./print-settings";

export class PrintModel {
    @prop({required: true})
    geometryData: Object;

    @prop({required: true, ref: () => PrintMaterial})
    material: Ref<PrintMaterial>;

    @prop({required: true, ref: () => PrintSettings})
    settings: PrintSettings;
}