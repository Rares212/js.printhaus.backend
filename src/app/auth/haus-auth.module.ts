import { Module } from '@nestjs/common';
import { UserService } from "@src/app/auth/services/user/user.service";
import { UserRepo } from "@src/app/auth/repos/user/user.repo";
import { JwtStrategyService } from './services/jwt-strategy/jwt-strategy.service';
import { CommonModule } from "@src/app/common/common.module";
import { SchemaModule } from "@src/app/common/schema/schema.module";

@Module({
    imports: [CommonModule, SchemaModule],
    providers: [UserService, UserRepo, JwtStrategyService]
})
export class HausAuthModule {}
