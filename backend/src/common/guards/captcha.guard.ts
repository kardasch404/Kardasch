import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { CaptchaService } from '../../modules/auth/services/captcha.service';
import { BotDetectionService } from '../../modules/security/services/bot-detection.service';

export const SKIP_CAPTCHA_KEY = 'skipCaptcha';
export const CAPTCHA_ACTION_KEY = 'captchaAction';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private captchaService: CaptchaService,
    private botDetectionService: BotDetectionService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if CAPTCHA should be skipped
    const skipCaptcha = this.reflector.getAllAndOverride<boolean>(SKIP_CAPTCHA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipCaptcha) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const request = ctx.req;

    // Get CAPTCHA token from headers or body
    const captchaToken = request.headers['x-captcha-token'] || request.body?.captchaToken;

    // Get expected action
    const expectedAction = this.reflector.get<string>(CAPTCHA_ACTION_KEY, context.getHandler());

    // Run bot detection
    const botDetection = await this.botDetectionService.detect(request);

    // If high bot score, require CAPTCHA
    if (botDetection.isBot) {
      if (!captchaToken) {
        await this.botDetectionService.recordBotActivity(
          this.getClientIp(request),
          `Bot detected: ${botDetection.reasons.join(', ')}`,
        );
        throw new ForbiddenException('Bot detected. CAPTCHA required.');
      }
    }

    // Verify CAPTCHA if token provided
    if (captchaToken) {
      const remoteIp = this.getClientIp(request);
      const isValid = await this.captchaService.verifyWithScore(
        captchaToken,
        remoteIp,
        expectedAction,
      );

      if (!isValid) {
        throw new BadRequestException('CAPTCHA verification failed');
      }
    }

    // If bot detected but CAPTCHA passed, allow
    if (botDetection.isBot && captchaToken) {
      return true;
    }

    // If not a bot and no CAPTCHA required, allow
    if (!botDetection.isBot) {
      return true;
    }

    // Default: require CAPTCHA for suspicious activity
    throw new ForbiddenException('CAPTCHA verification required');
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }
}
