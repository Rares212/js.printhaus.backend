import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { ImageInfo } from '@haus/db-common/image-info/model/image-info';
import { UserRating } from "@haus/db-common/user-rating/model/user-rating";

export function getUserRatingResource(resource: ReturnModelType<typeof UserRating>) {
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