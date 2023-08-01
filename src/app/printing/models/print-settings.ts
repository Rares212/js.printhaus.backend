import { PrintQuality, PrintStrength } from "@printnuts/common";
import {prop} from "@typegoose/typegoose";
import {AutoMap} from "@automapper/classes";

export class PrintSettings {
    @prop({required: true, enum: PrintQuality})
    @AutoMap()
    quality: PrintQuality;

    @prop({required: true, enum: PrintStrength})
    @AutoMap()
    strength: PrintStrength;
}