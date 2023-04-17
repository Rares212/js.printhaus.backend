import { PrintQuality } from "@printnuts/common";
import {prop} from "@typegoose/typegoose";

export class PrintSettings {
    @prop({required: true, enum: PrintQuality})
    quality: PrintQuality;
}