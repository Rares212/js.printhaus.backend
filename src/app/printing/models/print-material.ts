import { prop, Ref } from "@typegoose/typegoose";
import { AutoMap } from '@automapper/classes';

export class PrintMaterial {
  @AutoMap()
  id: string;

  @prop({ required: true })
  @AutoMap()
  name: string;

  @prop({ required: true, ref: () => PrintMaterial })
  @AutoMap()
  materialType: Ref<PrintMaterial>;

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
}
