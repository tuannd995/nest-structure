import * as env from 'dotenv';
env.config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseMiddleware } from './middlewares/DatabaseMiddleware';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>('PORT'), 10) || 5000;

  app.enableCors();
  app.use(new DatabaseMiddleware().use);
  await app.listen(port);
}
bootstrap();
