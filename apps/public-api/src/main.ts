import { NestFactory } from '@nestjs/core';
import { PublicApiModule } from './public-api.module';
import { ValidationPipe } from '@nestjs/common';
import * as mongoose from "mongoose";

async function bootstrap() {
    const app = await NestFactory.create(PublicApiModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose']
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // mongoose.set('debug', true);
    app.setGlobalPrefix('printhaus-api');

    await app.listen(3000);
}
bootstrap();
