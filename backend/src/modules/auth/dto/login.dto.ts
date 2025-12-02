import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { Trim, SanitizeNoSQL } from '../../../common/decorators/sanitize.decorator';

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  @MaxLength(255, { message: 'Identifier must not exceed 255 characters' })
  @Trim()
  @SanitizeNoSQL()
  identifier: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  password: string;
}
