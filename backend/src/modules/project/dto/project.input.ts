import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsUrl, IsOptional, MaxLength, MinLength, IsEnum, IsBoolean, Min, Max, Matches } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';
import { Trim, SanitizeHtml, SanitizeUrl, SanitizeNoSQL } from '../../../common/decorators/sanitize.decorator';

@InputType()
export class TranslationInput {
  @Field()
  @IsString()
  @MaxLength(200)
  @Trim()
  @SanitizeHtml()
  title: string;

  @Field()
  @IsString()
  @MaxLength(2000)
  @Trim()
  @SanitizeHtml()
  description: string;

  @Field()
  @IsString()
  @Matches(/^[a-z]{2}$/, { message: 'Language must be a 2-letter ISO code' })
  language: string;
}

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @Trim()
  @SanitizeHtml()
  title: string;

  @Field()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Trim()
  @SanitizeHtml()
  description: string;

  @Field(() => [TranslationInput], { nullable: true })
  translations?: TranslationInput[];

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid image URL' })
  @SanitizeUrl()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid demo URL' })
  @SanitizeUrl()
  demoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid repository URL' })
  @SanitizeUrl()
  repoUrl?: string;
}

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @Trim()
  @SanitizeHtml()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Trim()
  @SanitizeHtml()
  description?: string;

  @Field(() => [TranslationInput], { nullable: true })
  translations?: TranslationInput[];

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid image URL' })
  @SanitizeUrl()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid demo URL' })
  @SanitizeUrl()
  demoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid repository URL' })
  @SanitizeUrl()
  repoUrl?: string;
}

@InputType()
export class SearchProjectInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Trim()
  @SanitizeNoSQL()
  query?: string;

  @Field(() => [ProjectStatus], { nullable: true })
  status?: ProjectStatus[];

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field({ nullable: true })
  featured?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cursor?: string;
}
