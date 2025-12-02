import { Injectable, NotFoundException } from '@nestjs/common';
import { IProfileService } from './profile.service.interface';
import { ProfileRepository } from '../repositories/profile.repository';
import { Profile } from '../entities/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(userId: string, locale?: string): Promise<Profile | null> {
    return this.profileRepository.findByUserId(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    let profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      profile = await this.createProfile(userId);
    }

    const updateData: Partial<Profile> = {};
    if (dto.translations) updateData.translations = dto.translations as any;
    if (dto.socialLinks) updateData.socialLinks = dto.socialLinks;
    if (dto.avatar) updateData.avatar = dto.avatar;

    const updated = await this.profileRepository.update(profile._id.toString(), updateData);
    if (!updated) throw new NotFoundException('Profile update failed');

    return updated;
  }

  async createProfile(userId: string): Promise<Profile> {
    return this.profileRepository.create({
      userId: userId as any,
      translations: {},
      socialLinks: {},
      contact: {},
    });
  }
}
