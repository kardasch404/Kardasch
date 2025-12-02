import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { NormalizeEmail, Trim, StripHtml } from '../../../common/decorators/sanitize.decorator';

@InputType()
export class RegisterDto {
  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @NormalizeEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores, and hyphens' })
  @Trim()
  username: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  password: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Trim()
  @StripHtml()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Trim()
  @StripHtml()
  lastName?: string;
}
