import { Injectable } from '@nestjs/common';
import { MongoGenericRepository } from "@src/common/schema/mongo-generic.repository";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { AuthUser } from "@haus/db-common/auth-user/model/auth-user";

@Injectable()
export class AuthUserRepo extends MongoGenericRepository<HausUser> {

    constructor(@InjectModel(AuthUser) private readonly authUser: ReturnModelType<typeof AuthUser>) {
        super(authUser)
    }
}
