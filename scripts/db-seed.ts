import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // Add seeding logic here
  await app.close();
}

seed();
