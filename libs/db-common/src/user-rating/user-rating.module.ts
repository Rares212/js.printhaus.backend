import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { UserRating } from "@haus/db-common/user-rating/model/user-rating";
import { UserRatingRepo } from "@haus/db-common/user-rating/repo/user-rating.repo";

@Module({
    imports: [TypegooseModule.forFeature([UserRating])],
    providers: [UserRatingRepo]
})
export class UserRatingModule {}
