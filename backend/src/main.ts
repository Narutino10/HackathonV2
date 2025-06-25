import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser toutes les origines (développement uniquement)
  app.enableCors({
    origin: 'http://localhost:3000', // autorise React en local
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
