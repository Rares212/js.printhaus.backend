import { getModelForClass } from '@typegoose/typegoose';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';

export const SHOP_ITEM_RESOURCE = {
    resource: getModelForClass(ShopItem),
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
