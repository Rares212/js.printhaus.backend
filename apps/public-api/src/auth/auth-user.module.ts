import { Module } from '@nestjs/common';
import { JwtStrategyService } from './services/jwt-strategy/jwt-strategy.service';
import { AuthUserDbModule } from '@haus/db-common/auth-user/auth-user-db.module';
import { UserService } from './services/user/user.service';
import { DbCommonModule } from '@haus/db-common';

@Module({
    imports: [DbCommonModule],
    providers: [UserService, JwtStrategyService]
})
export class AuthUserModule {}
