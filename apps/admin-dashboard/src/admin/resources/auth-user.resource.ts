import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { AuthUser } from '@haus/db-common/auth-user/model/auth-user';

export function getAuthUserResource(resource: ReturnModelType<typeof AuthUser>) {
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
