import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  identifier: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;
}
