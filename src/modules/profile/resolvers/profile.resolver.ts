import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileService } from '../services/profile.service';
import { GqlAuthGuard } from '../../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Resolver(() => ProfileResponseDto)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileResponseDto, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async profile(
    @CurrentUser() user: any,
    @Args('locale', { type: () => String, nullable: true, defaultValue: 'en' }) locale: string,
  ): Promise<ProfileResponseDto | null> {
    const profile = await this.profileService.getProfile(user.userId, locale);
    if (!profile) return null;

    return this.getLocalizedContent(profile, locale);
  }

  @Mutation(() => ProfileResponseDto)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser() user: any,
    @Args('input') dto: UpdateProfileDto,
    @Args('locale', { type: () => String, nullable: true, defaultValue: 'en' }) locale: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.updateProfile(user.userId, dto);
    return this.getLocalizedContent(profile, locale);
  }

  private getLocalizedContent(profile: any, locale: string): ProfileResponseDto {
    const localizedContent = profile.getLocalizedContent(locale) || profile.getLocalizedContent('en');

    return {
      id: profile._id.toString(),
      userId: profile.userId.toString(),
      localizedContent,
      socialLinks: profile.socialLinks,
      avatar: profile.avatar,
      resumeUrl: profile.resumeUrl,
      updatedAt: profile.updatedAt,
    };
  }
}
