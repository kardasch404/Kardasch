import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

@Schema({ _id: false })
export class Translation {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  language: string;
}

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Translation], default: [] })
  translations: Translation[];

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop()
  imageUrl?: string;

  @Prop()
  demoUrl?: string;

  @Prop()
  repoUrl?: string;

  @Prop({ type: Date })
  completedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ title: 'text', description: 'text' });
ProjectSchema.index({ status: 1, featured: -1 });
ProjectSchema.index({ createdAt: -1 });
