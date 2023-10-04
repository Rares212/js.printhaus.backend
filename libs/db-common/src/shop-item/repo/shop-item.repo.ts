import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { MongoGenericRepository } from '@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';

@Injectable()
export class ShopItemRepo extends MongoGenericRepository<ShopItem> {
    constructor(@InjectModel(ShopItem) private readonly shopItemTypeModel: ReturnModelType<typeof ShopItem>) {
        super(shopItemTypeModel);
    }
}
