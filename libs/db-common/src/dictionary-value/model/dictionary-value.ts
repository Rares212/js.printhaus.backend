import { prop } from '@typegoose/typegoose';
import { AutoMap } from '@automapper/classes';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class DictionaryValue extends TimeStamps {
    @AutoMap()
    @prop({ required: true, unique: true, index: true })
    key: string;

    @AutoMap()
    @prop({ required: true })
    value: string;
}
