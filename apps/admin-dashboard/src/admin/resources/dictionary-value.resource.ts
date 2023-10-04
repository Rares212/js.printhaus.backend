import { getModelForClass } from '@typegoose/typegoose';
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';

export const DICTIONARY_VALUE_RESOURCE = {
    resource: getModelForClass(DictionaryValue),
    options: {
        properties: {
            createdAt: {
                isVisible: {
                    list: true,
                    filter: true,
                    show: true,
                    edit: false
                }
            },
            updatedAt: {
                isVisible: {
                    list: true,
                    filter: true,
                    show: true,
                    edit: false
                }
            }
        }
    }
};
