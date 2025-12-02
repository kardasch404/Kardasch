import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { BotDetectionService } from './services/bot-detection.service';

@Module({
  imports: [CacheModule.register()],
  providers: [BotDetectionService],
  exports: [BotDetectionService],
})
export class SecurityModule {}
