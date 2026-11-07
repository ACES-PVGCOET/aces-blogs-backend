import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module.js';
import { PrismaExceptionFilter } from './common/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  const frontendOrigins = configService
    .get<string>('FRONTEND_ORIGIN', 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: frontendOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  // Setup OpenAPI / Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ACES Blog Backend API')
    .setDescription(
      'ACES Blog Platform API with role-based access control, revision history, and publication workflow.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('aces_session')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);

  console.log(`🚀 ACES Blog Backend is running on port ${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

await bootstrap();
