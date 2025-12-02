import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectRepository {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async create(data: Partial<Project>): Promise<Project> {
    return this.projectModel.create(data);
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  async findAll(filter: any = {}, limit = 20, skip = 0): Promise<Project[]> {
    return this.projectModel.find(filter).limit(limit).skip(skip).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    return this.projectModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async count(filter: any = {}): Promise<number> {
    return this.projectModel.countDocuments(filter).exec();
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.projectModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }
}
