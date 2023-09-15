import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from "@src/app/common/schema/mongo-generic.repository";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ShopItem } from "@src/app/shop/models/shop.item";

@Injectable()
export class ShopItemRepo {
    private _genericRepo: MongoGenericRepository<ShopItem>;

    get genericRepo(): MongoGenericRepository<ShopItem> {
        return this._genericRepo;
    }

    constructor(@InjectModel(ShopItem) private readonly printMaterialTypeModel: ReturnModelType<typeof ShopItem>) {
        this._genericRepo = new MongoGenericRepository<ShopItem>(printMaterialTypeModel);
    }
}
