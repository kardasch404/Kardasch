import { Field, ObjectType, registerEnumType, Int } from '@nestjs/graphql';
import { ProjectStatus } from '../entities/project.entity';

registerEnumType(ProjectStatus, { name: 'ProjectStatus' });

@ObjectType()
export class TranslationType {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  language: string;
}

@ObjectType()
export class ProjectType {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [TranslationType])
  translations: TranslationType[];

  @Field(() => [String])
  skills: string[];

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field()
  featured: boolean;

  @Field(() => Int)
  viewCount: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  demoUrl?: string;

  @Field({ nullable: true })
  repoUrl?: string;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProjectConnection {
  @Field(() => [ProjectType])
  items: ProjectType[];

  @Field()
  total: number;

  @Field({ nullable: true })
  cursor?: string;

  @Field()
  hasMore: boolean;
}
