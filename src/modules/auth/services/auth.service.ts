import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto, deviceFingerprint: string): Promise<AuthResponseDto> {
    const strength = this.passwordService.calculateStrength(dto.password);
    if (strength.score < 60) {
      throw new BadRequestException(`Weak password: ${strength.feedback.join(', ')}`);
    }

    const isCompromised = await this.passwordService.isCompromised(dto.password);
    if (isCompromised) {
      throw new BadRequestException('Password has been compromised in a data breach');
    }

    const hashedPassword = await this.passwordService.hash(dto.password);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    const { accessToken } = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      deviceFingerprint,
    );

    return { accessToken, user };
  }

  async login(dto: LoginDto, deviceFingerprint: string, ip: string): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(dto.identifier) ||
                 await this.userService.findByUsername(dto.identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordService.verify(user.password, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('Account is not active');
    }

    await this.userService.updateLastLogin(user._id.toString(), ip);

    const { accessToken } = await this.tokenService.generateTokenPair(
      user._id.toString(),
      user.email,
      deviceFingerprint,
    );

    const userResponse = await this.userService.findById(user._id.toString());

    return { accessToken, user: userResponse };
  }

  async logout(userId: string, accessToken: string): Promise<boolean> {
    await this.tokenService.blacklistAccessToken(accessToken);
    await this.tokenService.revokeAllUserTokens(userId);
    return true;
  }
}
