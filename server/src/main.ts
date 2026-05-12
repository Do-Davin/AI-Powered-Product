import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const CLIENT_URL = 'http://localhost:5173';
const SERVER_PORT = process.env.PORT ?? 3000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  });
  await app.listen(SERVER_PORT);
}
void bootstrap();
