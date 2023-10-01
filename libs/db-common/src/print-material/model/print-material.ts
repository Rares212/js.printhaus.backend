import { prop, Ref } from '@typegoose/typegoose';
import { AutoMap } from '@automapper/classes';
import { PrintMaterialUseType } from '@printhaus/common';
import { PrintMaterialType } from "@haus/db-common/print-material-type/model/print-material-type";

export class PrintMaterial {
    @AutoMap()
    id: string;

    @prop({ required: true })
    @AutoMap()
    name: string;

    @prop({ required: true, ref: () => PrintMaterialType })
    materialType: Ref<PrintMaterialType>;

    @prop({ required: true })
    @AutoMap()
    color: string;

    @prop({ required: true })
    @AutoMap()
    gramsPerCubicCentimeter: number;

    @prop({ required: true, default: 1.0 })
    @AutoMap()
    printSpeedMultiplier: number;

    @prop({ required: true })
    @AutoMap()
    costAmount: number;

    @prop({ required: true })
    @AutoMap()
    costCurrency: string;

    @prop({ required: true, enum: PrintMaterialUseType })
    useType: PrintMaterialUseType;

    @prop({ required: true, default: 0 })
    @AutoMap()
    gramsInStock: number;

    @prop({ required: false })
    buyLink?: string;
}
