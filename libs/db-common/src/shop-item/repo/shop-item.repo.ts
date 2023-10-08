import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import {
    MongoGenericRepository
} from "@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository";
import { ShopItem } from "@haus/db-common/shop-item/model/shop.item";
import { Types } from "mongoose";

@Injectable()
export class ShopItemRepo extends MongoGenericRepository<ShopItem> {
  constructor(@InjectModel(ShopItem) private readonly shopItemTypeModel: ReturnModelType<typeof ShopItem>) {
    super(shopItemTypeModel);
  }

  public async getModelInfoId(shopItemId: string | Types.ObjectId): Promise<Types.ObjectId> {
    return new Types.ObjectId((await this.shopItemTypeModel.findOne({ _id: shopItemId })
      .select("modelFile")
      .exec())
      .modelFile
      .id);
  }
}
