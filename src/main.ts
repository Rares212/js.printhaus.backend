import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestMiddleware, ValidationPipe} from "@nestjs/common";
import AdminJS from "adminjs";
import * as AdminJSMongoose from '@adminjs/mongoose'
import * as mongoose from "mongoose";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose']
  });
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  app.setGlobalPrefix('printnuts-api');

  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database
  });

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  mongoose.set('debug', true);
}

bootstrap();
