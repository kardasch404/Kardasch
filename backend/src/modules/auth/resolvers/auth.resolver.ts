import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CaptchaAction } from '../../../common/decorators/captcha.decorator';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TokenService } from '../services/token.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Mutation(() => AuthResponseDto)
  @CaptchaAction('register')
  async register(
    @Args('input') input: RegisterDto,
    @Context() context: any,
  ): Promise<AuthResponseDto> {
    const req = context.req;
    const deviceFingerprint = this.tokenService.generateDeviceFingerprint(
      req.headers['user-agent'] || '',
      req.ip || req.connection.remoteAddress,
    );

    const result = await this.authService.register(input, deviceFingerprint);

    // Set refresh token in HttpOnly cookie
    const { refreshToken } = await this.tokenService.generateTokenPair(
      result.user.id,
      result.user.email,
      deviceFingerprint,
    );

    context.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Mutation(() => AuthResponseDto)
  @CaptchaAction('login')
  async login(
    @Args('input') input: LoginDto,
    @Context() context: any,
  ): Promise<AuthResponseDto> {
    const req = context.req;
    const deviceFingerprint = this.tokenService.generateDeviceFingerprint(
      req.headers['user-agent'] || '',
      req.ip || req.connection.remoteAddress,
    );

    const result = await this.authService.login(
      input,
      deviceFingerprint,
      req.ip || req.connection.remoteAddress,
    );

    // Set refresh token in HttpOnly cookie
    const { refreshToken } = await this.tokenService.generateTokenPair(
      result.user.id,
      result.user.email,
      deviceFingerprint,
    );

    context.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: any): Promise<boolean> {
    const userId = context.req.user.userId;
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    const ip = context.req.ip || context.req.connection.remoteAddress;

    await this.authService.logout(userId, token, ip);

    context.res.clearCookie('refreshToken');

    return true;
  }
}
