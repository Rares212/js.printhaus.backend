import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';

export function getDictionaryValueResource(resource: ReturnModelType<typeof DictionaryValue>) {
    return {
        resource: resource,
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
}
