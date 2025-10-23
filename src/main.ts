import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors();
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
}

// For Vercel serverless
export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors();
  app.setGlobalPrefix('api');
  
  await app.init();
  return app.getHttpAdapter().getInstance()(req, res);
}

// Only bootstrap for local development
if (!process.env.VERCEL) {
  bootstrap();
}