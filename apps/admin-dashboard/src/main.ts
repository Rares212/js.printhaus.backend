import { NestFactory } from '@nestjs/core';
import { AdminDashboardModule } from './admin-dashboard.module';
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';

async function bootstrap() {
    const app = await NestFactory.create(AdminDashboardModule);

    AdminJS.registerAdapter({
        Resource: AdminJSMongoose.Resource,
        Database: AdminJSMongoose.Database
    });

    await app.listen(3010);
}
bootstrap();
