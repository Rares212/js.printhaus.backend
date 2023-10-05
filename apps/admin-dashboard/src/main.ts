import { NestFactory } from '@nestjs/core';
import { AdminDashboardModule } from './admin-dashboard.module';
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AdminDashboardModule);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }))

    AdminJS.registerAdapter({
        Resource: AdminJSMongoose.Resource,
        Database: AdminJSMongoose.Database
    });

    await app.listen(3010);
}
bootstrap();
