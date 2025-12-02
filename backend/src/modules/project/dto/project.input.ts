import { Field, InputType, Int } from '@nestjs/graphql';
import { ProjectStatus } from '../entities/project.entity';

@InputType()
export class TranslationInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  language: string;
}

@InputType()
export class CreateProjectInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [TranslationInput], { nullable: true })
  translations?: TranslationInput[];

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;

  @Field({ nullable: true })
  featured?: boolean;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  demoUrl?: string;

  @Field({ nullable: true })
  repoUrl?: string;
}

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [TranslationInput], { nullable: true })
  translations?: TranslationInput[];

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;

  @Field({ nullable: true })
  featured?: boolean;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  demoUrl?: string;

  @Field({ nullable: true })
  repoUrl?: string;
}

@InputType()
export class SearchProjectInput {
  @Field({ nullable: true })
  query?: string;

  @Field(() => [ProjectStatus], { nullable: true })
  status?: ProjectStatus[];

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field({ nullable: true })
  featured?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit?: number;

  @Field({ nullable: true })
  cursor?: string;
}
