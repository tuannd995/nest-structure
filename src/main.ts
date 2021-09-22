import * as env from 'dotenv';
env.config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseMiddleware } from './middlewares/DatabaseMiddleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(new DatabaseMiddleware().use);
  await app.listen(3003);
}
bootstrap();
