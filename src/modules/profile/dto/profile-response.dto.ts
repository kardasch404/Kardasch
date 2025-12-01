import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LocaleContentType {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  features?: string[];
}

@ObjectType()
export class SocialLinksType {
  @Field({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  linkedin?: string;

  @Field({ nullable: true })
  twitter?: string;

  @Field({ nullable: true })
  website?: string;
}

@ObjectType()
export class ProfileResponseDto {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => LocaleContentType, { nullable: true })
  localizedContent?: LocaleContentType;

  @Field(() => SocialLinksType, { nullable: true })
  socialLinks?: SocialLinksType;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  resumeUrl?: string;

  @Field()
  updatedAt: Date;
}
