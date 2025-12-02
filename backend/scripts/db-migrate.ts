import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function migrate() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // Add migration logic here
  await app.close();
}

migrate();
