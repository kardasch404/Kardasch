import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Trim, SanitizeHtml, SanitizeUrl } from '../../../common/decorators/sanitize.decorator';

@InputType()
export class LocaleContentDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Trim()
  @SanitizeHtml()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Trim()
  @SanitizeHtml()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  @Trim()
  @SanitizeHtml()
  content?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  features?: string[];
}

@InputType()
export class TranslationDto {
  @Field(() => LocaleContentDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocaleContentDto)
  ar?: LocaleContentDto;

  @Field(() => LocaleContentDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocaleContentDto)
  en?: LocaleContentDto;

  @Field(() => LocaleContentDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocaleContentDto)
  fr?: LocaleContentDto;

  @Field(() => LocaleContentDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocaleContentDto)
  de?: LocaleContentDto;

  @Field(() => LocaleContentDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocaleContentDto)
  ja?: LocaleContentDto;
}

@InputType()
export class SocialLinksDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid GitHub URL' })
  @SanitizeUrl()
  github?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid LinkedIn URL' })
  @SanitizeUrl()
  linkedin?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid Twitter URL' })
  @SanitizeUrl()
  twitter?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid website URL' })
  @SanitizeUrl()
  website?: string;
}

@InputType()
export class UpdateProfileDto {
  @Field(() => TranslationDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslationDto)
  translations?: TranslationDto;

  @Field(() => SocialLinksDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid avatar URL' })
  @SanitizeUrl()
  avatar?: string;
}
