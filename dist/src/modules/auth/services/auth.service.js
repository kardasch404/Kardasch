"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/services/user.service");
const password_service_1 = require("./password.service");
const token_service_1 = require("./token.service");
let AuthService = class AuthService {
    userService;
    passwordService;
    tokenService;
    constructor(userService, passwordService, tokenService) {
        this.userService = userService;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }
    async register(dto, deviceFingerprint) {
        const strength = this.passwordService.calculateStrength(dto.password);
        if (strength.score < 60) {
            throw new common_1.BadRequestException(`Weak password: ${strength.feedback.join(', ')}`);
        }
        const isCompromised = await this.passwordService.isCompromised(dto.password);
        if (isCompromised) {
            throw new common_1.BadRequestException('Password has been compromised in a data breach');
        }
        const hashedPassword = await this.passwordService.hash(dto.password);
        const user = await this.userService.create({
            ...dto,
            password: hashedPassword,
        });
        const { accessToken } = await this.tokenService.generateTokenPair(user.id, user.email, deviceFingerprint);
        return { accessToken, user };
    }
    async login(dto, deviceFingerprint, ip) {
        const user = await this.userService.findByEmail(dto.identifier) ||
            await this.userService.findByUsername(dto.identifier);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await this.passwordService.verify(user.password, dto.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive()) {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        await this.userService.updateLastLogin(user._id.toString(), ip);
        const { accessToken } = await this.tokenService.generateTokenPair(user._id.toString(), user.email, deviceFingerprint);
        const userResponse = await this.userService.findById(user._id.toString());
        return { accessToken, user: userResponse };
    }
    async logout(userId, accessToken) {
        await this.tokenService.blacklistAccessToken(accessToken);
        await this.tokenService.revokeAllUserTokens(userId);
        return true;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        password_service_1.PasswordService,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map