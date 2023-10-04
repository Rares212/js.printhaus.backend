import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AutoMap } from '@automapper/classes';
import { prop, Ref } from '@typegoose/typegoose';
import { AuthUser } from '@haus/db-common/auth-user/model/auth-user';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';

export class UserRating extends TimeStamps {
    @AutoMap()
    id: string;

    @prop({ required: true, ref: () => AuthUser })
    user: Ref<AuthUser>;

    @prop({ required: true, ref: () => ShopItem })
    shopItem: Ref<ShopItem>;

    @prop({
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Score must be an integer'
        }
    })
    score: number;
}
