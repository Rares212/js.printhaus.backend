import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from '@src/app/common/schema/mongo-generic.repository';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserRating } from "@src/app/shop/models/user-rating";

@Injectable()
export class UserRatingRepo {
    private _genericRepo: MongoGenericRepository<UserRating>;

    get genericRepo(): MongoGenericRepository<UserRating> {
        return this._genericRepo;
    }

    constructor(@InjectModel(UserRating) private readonly userRatingTypeModel: ReturnModelType<typeof UserRating>) {
        this._genericRepo = new MongoGenericRepository<UserRating>(userRatingTypeModel);
    }

    async findAllByShopItemId(shopItemId: string): Promise<UserRating[]> {
        return this.userRatingTypeModel.find({ shopItem: shopItemId }).exec();
    }

    async getRatingCount(shopItemId: string): Promise<number> {
        return this.userRatingTypeModel.countDocuments({ shopItem: shopItemId }).exec();
    }
}
