import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3000;

  await app.listen(port);
  logger.log(`API is up and running on port ${port}`);
}
bootstrap();
