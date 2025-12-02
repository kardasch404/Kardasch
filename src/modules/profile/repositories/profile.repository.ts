import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../entities/profile.entity';
import { IProfileRepository } from './profile.repository.interface';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(@InjectModel(Profile.name) private readonly profileModel: Model<Profile>) {}

  async findById(id: string): Promise<Profile | null> {
    return this.profileModel.findById(id).exec();
  }

  async findOne(filter: any): Promise<Profile | null> {
    return this.profileModel.findOne(filter).exec();
  }

  async findAll(filter: any = {}): Promise<Profile[]> {
    return this.profileModel.find(filter).exec();
  }

  async create(data: Partial<Profile>): Promise<Profile> {
    const profile = new this.profileModel(data);
    return profile.save();
  }

  async update(id: string, data: Partial<Profile>): Promise<Profile | null> {
    return this.profileModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.profileModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async count(filter: any = {}): Promise<number> {
    return this.profileModel.countDocuments(filter).exec();
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ userId }).exec();
  }
}
