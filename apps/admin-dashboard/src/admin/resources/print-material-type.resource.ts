import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { PrintMaterialType } from '@haus/db-common/print-material-type/model/print-material-type';

export function getPrintMaterialTypeResource(resource: ReturnModelType<typeof PrintMaterialType>) {
    return {
        resource: resource,
        options: {
            properties: {
                shortName: {
                    isTitle: true
                },
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