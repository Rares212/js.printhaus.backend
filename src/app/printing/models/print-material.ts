import {prop, Ref} from "@typegoose/typegoose";
import {MaterialType} from "@printnuts/common";
import {Currency, DineroObject} from "dinero.js";
import {AutoMap} from "@automapper/classes";
import {Expose} from "class-transformer";
import { ObjectId, Schema } from "mongoose";

export class PrintMaterial {
    @prop({ required: true })
    @AutoMap()
    _id: Schema.Types.ObjectId;

    @prop({required: true})
    @AutoMap()
    name: string;

    @prop({type: String, required: true, enum: MaterialType})
    @AutoMap()
    materialType: MaterialType;

    @prop()
    @AutoMap()
    color: string;

    @prop({required: true})
    @AutoMap()
    gramsPerCubicCentimeter: number;

    @prop({required: true, default: 1.0})
    @AutoMap()
    printSpeedMultiplier: number;

    @prop({required: true})
    @AutoMap()
    costAmount: number;

    @prop({required: true})
    @AutoMap()
    costCurrency: string;
}