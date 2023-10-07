import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { MongoGenericRepository } from '@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository';
import { UserRating } from '@haus/db-common/user-rating/model/user-rating';
import { Types } from "mongoose";

@Injectable()
export class UserRatingRepo extends MongoGenericRepository<UserRating> {
    constructor(@InjectModel(UserRating) private readonly userRatingTypeModel: ReturnModelType<typeof UserRating>) {
        super(userRatingTypeModel);
    }

    public async getRatingForShopItem(shopItemId: string | Types.ObjectId): Promise<RatingResult> {
        const result = await this.userRatingTypeModel
            .aggregate([
                { $match: { shopItem: shopItemId } },
                {
                    $group: {
                        _id: null,
                        totalScore: { $sum: '$score' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        averageRating: { $divide: ['$totalScore', '$count'] },
                        count: 1
                    }
                }
            ])
            .exec();

        if (result.length > 0) {
            return {
                averageRating: result[0].averageRating,
                count: result[0].count
            };
        } else {
            return {
                averageRating: 0,
                count: 0
            };
        }
    }
}

export interface RatingResult {
    averageRating: number;
    count: number;
}
