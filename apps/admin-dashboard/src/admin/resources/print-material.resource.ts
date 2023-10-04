import { getModelForClass } from '@typegoose/typegoose';
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';

export const PRINT_MATERIAL_RESOURCE = {
    resource: getModelForClass(PrintMaterial),
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
};
