import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { ModelInfo } from "@haus/db-common/model-info/model/model-info";

export function getModelInfoResource(resource: ReturnModelType<typeof ModelInfo>) {
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