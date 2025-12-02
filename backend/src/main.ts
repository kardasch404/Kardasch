import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Cookie parser
  app.use(cookieParser());

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: configService.get('security.helmet.contentSecurityPolicy'),
    crossOriginEmbedderPolicy: false,
  }));

  // CORS
  app.enableCors({
    origin: configService.get('security.cors.origin'),
    credentials: configService.get('security.cors.credentials'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // MongoDB query sanitization
  app.use(mongoSanitize.default());

  // HTTP Parameter Pollution protection
  app.use(hpp());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get('app.port', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
}
bootstrap();
