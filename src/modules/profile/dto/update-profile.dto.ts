import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class LocaleContentDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
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
  @IsUrl()
  github?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
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
  @IsUrl()
  avatar?: string;
}
