import { Module } from '@nestjs/common';
import { UserService } from "@src/auth/services/user/user.service";
import { UserRepo } from "@src/auth/repos/user/user.repo";
import { JwtStrategyService } from './services/jwt-strategy/jwt-strategy.service';
import { CommonModule } from "@src/common/common.module";
import { SchemaModule } from "@src/common/schema/schema.module";

@Module({
    imports: [CommonModule, SchemaModule],
    providers: [UserService, UserRepo, JwtStrategyService]
})
export class HausAuthModule {}
