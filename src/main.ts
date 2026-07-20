import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Security
    app.use(helmet());
    app.enableCors({
      origin: [
        process.env.FRONTEND_URL, 
        'http://localhost:3000', 
        'http://localhost:5173',
        'https://roymall-frontend.vercel.app'
      ].filter(Boolean) as string[],
      credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api');

    // Validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Interceptors & Filters
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new PrismaExceptionFilter());

    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Roymall Scents API')
      .setDescription('Premium Perfume Ecommerce Platform API')
      .setVersion('1.0')
      .addServer('https://roymall-backend-production.up.railway.app', 'Production Server')
      .addServer(`http://localhost:${process.env.PORT || 4000}`, 'Local Development Server')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = parseInt(process.env.PORT || '4000', 10);
    await app.listen(port);
    console.log(`🚀 Roymall Scents API running on port ${port}`);
    console.log(`📄 Swagger docs at http://localhost:${port}/api/docs`);
  } catch (err) {
    console.error('❌ Error during application bootstrap:', err);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception thrown:', err);
});

bootstrap();
