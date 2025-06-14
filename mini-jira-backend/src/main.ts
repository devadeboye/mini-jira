import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Enable CORS
  app.enableCors();

  // Configure body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const port = process.env.PORT!;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start application:', error);
  process.exit(1);
});
