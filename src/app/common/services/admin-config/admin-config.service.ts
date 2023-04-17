import {DynamicModule, ForwardReference, Injectable, Type} from '@nestjs/common';
import {AdminModuleFactory, AdminModuleOptions} from "@adminjs/nestjs";
import {ConfigService} from "@nestjs/config";
import {CONFIG_KEYS} from "../../util/config-keys.enum";

@Injectable()
export class AdminConfigService implements AdminModuleFactory {

    constructor(private configService: ConfigService) {
    }

    imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;

    public useFactory(args: any): Promise<AdminModuleOptions> | AdminModuleOptions {
        const authenticate = async (email: string, password: string) => {
            const admin = {
                email: this.configService.get(CONFIG_KEYS.ADMIN.ADMIN_USERNAME),
                password: this.configService.get(CONFIG_KEYS.ADMIN.ADMIN_PASSWORD)
            };
            if (email === admin.email && password === admin.password) {
                return Promise.resolve(admin);
            }
            return null;
        }

        return {
            adminJsOptions: {
                rootPath: '/admin',
                resources: [],
            },
            auth: {
                authenticate: authenticate,
                cookieName: this.configService.get(CONFIG_KEYS.ADMIN.ADMIN_COOKIE_NAME),
                cookiePassword: this.configService.get(CONFIG_KEYS.ADMIN.ADMIN_COOKIE_PASSWORD),
            },
            sessionOptions: {
                resave: true,
                saveUninitialized: true,
                secret: this.configService.get(CONFIG_KEYS.ADMIN.ADMIN_SECRET),
            },
        }
    }

}
