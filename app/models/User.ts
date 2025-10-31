import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import JWTUtil from '../utils/jwt.js';
import { ROLES } from '../constants/roles.js';

export enum Role {
    ADMIN = 'ADMIN',
    VISITOR = 'VISITOR'
}

interface RefreshToken {
    token: string
    expiresAt: Date;
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: Role;
    refreshTokens: RefreshToken[];
    lastLogin?: Date;
    validatePassword(password: string): Promise<boolean>;
    generateTokens(): { accessToken: string; refreshToken: string };
    revokeToken(token: string): boolean;
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(Role), default: Role.VISITOR },
    refreshTokens: [{ token: String, expiresAt: Date }],
    lastLogin: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateTokens = function(): { accessToken: string; refreshToken: string } {
    const accessToken = JWTUtil.generateAccessToken(this._id.toString(), this.role);
    const refreshToken = JWTUtil.generateRefreshToken(this._id.toString());
    
    this.refreshTokens.push({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    return { accessToken, refreshToken };
};

userSchema.methods.revokeToken = function(token: string): boolean {
    const initialLength = this.refreshTokens.length;
    this.refreshTokens = this.refreshTokens.filter((rt: RefreshToken) => rt.token !== token);
    return this.refreshTokens.length < initialLength;
};

export default mongoose.model<IUser>('User', userSchema);
