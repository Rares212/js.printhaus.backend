import {prop, Ref} from "@typegoose/typegoose";
import {MaterialType} from "@printnuts/common";
import {Dinero} from "dinero.js";

export class PrintMaterial {
    @prop({required: true})
    name: string;

    @prop({required: true, enum: MaterialType})
    materialType: MaterialType;

    @prop()
    color: string;

    @prop({required: true})
    gramsPerCubicCentimeter: number;

    @prop({required: true, default: 1.0})
    printSpeedMultiplier: number;

    @prop({required: true})
    costPerGram: Dinero;
}