import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as env from 'dotenv';
import * as express from 'express';
import { AppModule } from './app.module';
import { DatabaseMiddleware } from './middlewares/DatabaseMiddleware';

env.config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>('PORT'), 10) || 5000;

  app.use('/uploads', express.static('uploads'));

  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(new DatabaseMiddleware().use);

  await app.listen(port);
}
bootstrap();
