import { UserService } from '../../user/services/user.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
export declare class AuthService {
    private readonly userService;
    private readonly passwordService;
    private readonly tokenService;
    constructor(userService: UserService, passwordService: PasswordService, tokenService: TokenService);
    register(dto: RegisterDto, deviceFingerprint: string): Promise<AuthResponseDto>;
    login(dto: LoginDto, deviceFingerprint: string, ip: string): Promise<AuthResponseDto>;
    logout(userId: string, accessToken: string): Promise<boolean>;
}
