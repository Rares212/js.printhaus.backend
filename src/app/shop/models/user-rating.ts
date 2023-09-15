import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { AutoMap } from "@automapper/classes";
import { HausUser } from "@src/app/auth/models/haus-user";
import { prop, Ref } from "@typegoose/typegoose";
import { ShopItem } from "@src/app/shop/models/shop.item";

export class UserRating extends TimeStamps {
    @AutoMap()
    id: string;

    @prop({ required: true, ref: () => HausUser })
    user: Ref<HausUser>

    @prop({ required: true, ref: () => ShopItem })
    shopItem: Ref<ShopItem>

    @prop({
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Score must be an integer'
        }
    })
    public score: number;
}