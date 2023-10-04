import { Injectable } from '@nestjs/common';
import { RatingResult, UserRatingRepo } from '@haus/db-common/user-rating/repo/user-rating.repo';

@Injectable()
export class UserRatingService {
    constructor(private userRatingRepo: UserRatingRepo) {}

    public async getRating(shopItemId: string): Promise<RatingResult> {
        return this.userRatingRepo.getRatingForShopItem(shopItemId);
    }

    public async addRating(shopItemId: string, userId: string): Promise<void> {
        // Get the current user based on the JWT token
    }
}
