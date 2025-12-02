import { Profile } from '../entities/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export interface IProfileService {
  getProfile(userId: string, locale?: string): Promise<Profile | null>;
  updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile>;
  createProfile(userId: string): Promise<Profile>;
}
