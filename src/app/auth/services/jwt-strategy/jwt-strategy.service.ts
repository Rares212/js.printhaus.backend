import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';
import { ConfigService } from "@nestjs/config";
import { CONFIG_KEYS } from "@src/app/common/util/config-keys.enum";

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${configService.get(CONFIG_KEYS.AUTH.ISSUER)}.well-known/jwks.json`,
            }),

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: configService.get(CONFIG_KEYS.AUTH.AUDIENCE),
            issuer: configService.get(CONFIG_KEYS.AUTH.ISSUER),
            algorithms: [configService.get(CONFIG_KEYS.AUTH.ALGORITHM)],
        });
    }

    validate(payload: unknown): unknown {
        return payload;
    }
}
