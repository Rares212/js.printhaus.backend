import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop, Ref } from "@typegoose/typegoose";
import { AutoMap } from "@automapper/classes";
import { UserRating } from "@src/app/shop/models/user-rating";

export class HausUser extends TimeStamps {

    @AutoMap()
    @prop({ required: true })
    authId: string;

    @AutoMap()
    @prop({ required: true })
    email: string;

    @prop({ ref: () => UserRating })
    public ratings?: Ref<UserRating>[];
}