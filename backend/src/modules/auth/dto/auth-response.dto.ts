import { ObjectType, Field } from '@nestjs/graphql';
import { UserResponseDto } from '../../user/dto/user-response.dto';

@ObjectType()
export class AuthResponseDto {
  @Field()
  accessToken: string;

  @Field(() => UserResponseDto)
  user: UserResponseDto;
}
