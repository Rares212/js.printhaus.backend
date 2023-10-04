import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { AutoMap } from '@automapper/classes';
import { UserRating } from '@haus/db-common/user-rating/model/user-rating';

export class AuthUser extends TimeStamps {
    @AutoMap()
    @prop({ required: true })
    authId: string;

    @AutoMap()
    @prop({ required: true })
    email: string;

    @prop({ ref: () => UserRating })
    public ratings?: Ref<UserRating>[];
}
