import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { CaptchaService } from './services/captcha.service';
import { BruteForceService } from './services/brute-force.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshToken, RefreshTokenSchema } from './entities/refresh-token.entity';
import { UserModule } from '../user/user.module';
import { CacheModule } from '../../core/cache/cache.module';
import { ObservabilityModule } from '../../core/observability/observability.module';

@Module({
  imports: [
    UserModule,
    CacheModule,
    ObservabilityModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    CaptchaService,
    BruteForceService,
    AuthResolver,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, PasswordService, TokenService, CaptchaService, BruteForceService],
})
export class AuthModule {}
