import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";

export function getImageInfoResource(resource: ReturnModelType<typeof ImageInfo>) {
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