import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AuthUser } from '@haus/db-common/auth-user/model/auth-user';
import { MongoGenericRepository } from '@haus/db-common/common-schema/services/generic-repository/mongo-generic.repository';

@Injectable()
export class AuthUserRepo extends MongoGenericRepository<AuthUser> {
    constructor(@InjectModel(AuthUser) private readonly authUser: ReturnModelType<typeof AuthUser>) {
        super(authUser);
    }
}
