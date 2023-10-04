import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';

export function getShopItemResource(resource: ReturnModelType<typeof ShopItem>) {
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
