import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import { AllExceptionsFilter } from './logging/exeption.filter';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggingService); // Получаем инстанс LoggingService через DI

  // Обработка неотловленных ошибок
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err.stack);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${String(reason)}`);
  });

  logger.log('Application started');

  // Глобальный фильтр исключений
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
