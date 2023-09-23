import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { AutoMap } from "@automapper/classes";
import { prop, Ref } from "@typegoose/typegoose";
import { FileInfo } from "@src/app/haus-file/models/file-info";
import { UserRating } from "@src/app/shop/models/user-rating";
import { PrintMaterial } from "@src/app/printing/models/print-material";
import { HausImage } from "@src/app/common/models/haus-image";

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

    @prop({ required: true, ref: () => HausImage })
    mainPhoto: Ref<HausImage>;

    @prop({ required: true, ref: () => FileInfo })
    galleryPhotos: Ref<FileInfo>[];

    @prop({ required: true, ref: () => FileInfo })
    modelFile: Ref<FileInfo>

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