import { getModelForClass } from '@typegoose/typegoose';
import { PrintMaterialType } from '@haus/db-common/print-material-type/model/print-material-type';

export const PRINT_MATERIAL_TYPE_RESOURCE = {
    resource: getModelForClass(PrintMaterialType),
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
