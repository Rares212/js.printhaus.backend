import { Injectable } from '@nestjs/common';
import { UserRatingRepo } from '@src/shop/repos/user-rating/user-rating.repo';

@Injectable()
export class UserRatingService {
    constructor(private userRatingRepo: UserRatingRepo,
                ) {}

    public async getAverageRating(shopItemId: string): Promise<number> {
        const ratings = await this.userRatingRepo.findAllByShopItemId(shopItemId);
        if (!ratings || ratings.length === 0) {
            return 0;
        }

        const sum = ratings.reduce((accumulator, rating) => accumulator + rating.score, 0);
        return sum / ratings.length;
    }

    public async getRatingCount(shopItemId: string): Promise<number> {
        return this.userRatingRepo.getRatingCount(shopItemId);
    }

    public async addRating(shopItemId: string, userId: string): Promise<void> {
        // Get the current user based on the JWT token
    }
}
