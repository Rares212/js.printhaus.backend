import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthUser } from '@haus/db-common/auth-user/model/auth-user';
import { AuthUserProfile } from '@haus/db-common/auth-user/model/auth-user.profile';
import { AuthUserRepo } from '@haus/db-common/auth-user/repo/auth-user.repo';

@Module({
    imports: [TypegooseModule.forFeature([AuthUser])],
    providers: [AuthUserProfile, AuthUserRepo]
})
export class AuthUserModule {}
