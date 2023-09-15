import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { AutoMap } from "@automapper/classes";
import { prop, Ref } from "@typegoose/typegoose";
import { FileInfo } from "@src/app/common/models/file-info";
import { UserRating } from "@src/app/shop/models/user-rating";

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

    @AutoMap()
    @prop({ required: true })
    materialName: string;

    @AutoMap()
    @prop({ required: true })
    materialType: string;

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

    @prop({ required: true, ref: () => FileInfo })
    thumbnail: Ref<FileInfo>;

    @prop({ required: true, ref: () => FileInfo })
    photos: Ref<FileInfo>[];

    @AutoMap()
    @prop({ required: true, default: false })
    assemblyRequired: boolean;

    @AutoMap()
    @prop({ required: true })
    color: string;

    @AutoMap()
    @prop({ required: true })
    costAmount: number;

    @AutoMap()
    @prop({ required: true })
    reducedCostAmount: number;

    @AutoMap()
    @prop({ required: true })
    costCurrency: string;

    @AutoMap()
    @prop({ required: false, type: [String], default: [], lowercase: true })
    tags: string[];
}