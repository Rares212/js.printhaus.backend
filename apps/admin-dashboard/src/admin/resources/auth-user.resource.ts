import { getModelForClass } from '@typegoose/typegoose';
import { AuthUser } from '@haus/db-common/auth-user/model/auth-user';

export const AUTH_USER_RESOURCE = {
    resource: getModelForClass(AuthUser),
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
