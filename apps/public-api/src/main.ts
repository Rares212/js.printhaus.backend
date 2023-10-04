import { NestFactory } from '@nestjs/core';
import { PublicApiModule } from './public-api.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(PublicApiModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose']
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.setGlobalPrefix('printhaus-api');

    await app.listen(3000);
}
bootstrap();
