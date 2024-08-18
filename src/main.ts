import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  let httpsOptions = {};

  // Only use HTTPS options if in development mode
  // if (process.env.NODE_ENV === 'development') {
  //   httpsOptions = {
  //     key: fs.readFileSync('./src/cert/key.pem'),
  //     cert: fs.readFileSync('./src/cert/cert.pem'),
  //   };
  // }

  // Pass the HTTPS options only if they are set (development)
  const app = await NestFactory.create(AppModule, Object.keys(httpsOptions).length ? { httpsOptions } : undefined);
  app.enableCors();
  const logger = new Logger('Bootstrap');

  // app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT || 3000);

  logger.log(`App running on port ${process.env.PORT}`);
}

bootstrap();
