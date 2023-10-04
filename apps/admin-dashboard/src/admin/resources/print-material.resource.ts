import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';

export function getPrintMaterialResource(resource: ReturnModelType<typeof PrintMaterial>){
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
