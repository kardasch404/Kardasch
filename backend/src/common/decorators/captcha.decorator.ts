import { SetMetadata } from '@nestjs/common';
import { SKIP_CAPTCHA_KEY, CAPTCHA_ACTION_KEY } from '../guards/captcha.guard';

export const SkipCaptcha = () => SetMetadata(SKIP_CAPTCHA_KEY, true);
export const CaptchaAction = (action: string) => SetMetadata(CAPTCHA_ACTION_KEY, action);
