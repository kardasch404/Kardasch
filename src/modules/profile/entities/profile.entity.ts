import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface LocaleContent {
  title?: string;
  description?: string;
  content?: string;
  features?: string[];
}

export interface TranslationMap {
  ar?: LocaleContent;
  en?: LocaleContent;
  fr?: LocaleContent;
  de?: LocaleContent;
  ja?: LocaleContent;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
}

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: Object })
  translations: TranslationMap;

  @Prop({ type: Object })
  socialLinks: SocialLinks;

  @Prop()
  avatar?: string;

  @Prop()
  resumeUrl?: string;

  @Prop({ type: Object })
  contact: ContactInfo;

  updatedAt: Date;

  getLocalizedContent(locale: string): LocaleContent | null {
    return this.translations?.[locale] || this.translations?.en || null;
  }

  updateTranslation(locale: string, data: LocaleContent): void {
    if (!this.translations) this.translations = {};
    this.translations[locale] = data;
  }
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.methods.getLocalizedContent = function (locale: string) {
  return this.translations?.[locale] || this.translations?.en || null;
};

ProfileSchema.methods.updateTranslation = function (locale: string, data: LocaleContent) {
  if (!this.translations) this.translations = {};
  this.translations[locale] = data;
};

ProfileSchema.index({ userId: 1 });
