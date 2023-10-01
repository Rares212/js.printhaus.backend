import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { AutoMap } from "@automapper/classes";
import { prop, Ref } from "@typegoose/typegoose";
import { PrintMaterial } from "@haus/db-common/print-material/model/print-material";
import { UserRating } from "@haus/db-common/user-rating/model/user-rating";
import { ImageInfo } from "@haus/db-common/image-info/model/image-info";
import { ModelInfo } from "@haus/db-common/model-info/model/model-info";

export class ShopItem extends TimeStamps {
    @AutoMap()
    id: string;

    @AutoMap()
    @prop({ required: true })
    name: string; 

    @AutoMap()
    @prop({ required: true, maxlength: 300 })
    description: string;

    @AutoMap()
    @prop({ required: true })
    creator: string;

    @prop({ required: true, ref: () => PrintMaterial })
    material: Ref<PrintMaterial>

    @AutoMap()
    @prop({ required: true, min: 0 })
    grams: number;

    @AutoMap()
    @prop({ required: true })
    width: number;

    @AutoMap()
    @prop({ required: true })
    height: number;

    @AutoMap()
    @prop({ required: true })
    depth: number;

    @prop({ ref: () => UserRating, default: [] })
    ratings: Ref<UserRating>[];

    @prop({ required: true, ref: () => ImageInfo })
    mainPhoto: Ref<ImageInfo>;

    @prop({ required: true, ref: () => ImageInfo })
    galleryPhotos: Ref<ImageInfo>[];

    @prop({ required: true, ref: () => ModelInfo })
    modelFile: Ref<ModelInfo>

    @AutoMap()
    @prop({ required: true, default: false })
    assemblyRequired: boolean;

    @AutoMap()
    @prop({ required: true, min: 0 })
    costAmount: number;

    @AutoMap()
    @prop({ required: true, min: 0 })
    reducedCostAmount: number;

    @AutoMap()
    @prop({ required: true })
    costCurrency: string;

    @AutoMap()
    @prop({ required: false, type: [String], default: [], lowercase: true })
    tags: string[];
}