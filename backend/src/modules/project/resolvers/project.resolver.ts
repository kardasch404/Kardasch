import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { ProjectType, ProjectConnection } from '../types/project.types';
import { CreateProjectInput, UpdateProjectInput, SearchProjectInput } from '../dto/project.input';

@Resolver(() => ProjectType)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Mutation(() => ProjectType)
  async createProject(@Args('input') input: CreateProjectInput): Promise<ProjectType> {
    return this.projectService.create(input);
  }

  @Query(() => ProjectType)
  async project(@Args('id') id: string): Promise<ProjectType> {
    const project = await this.projectService.findById(id);
    await this.projectService.incrementViewCount(id);
    return project;
  }

  @Mutation(() => ProjectType)
  async updateProject(
    @Args('id') id: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<ProjectType> {
    return this.projectService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProject(@Args('id') id: string): Promise<boolean> {
    return this.projectService.delete(id);
  }

  @Query(() => ProjectConnection)
  async searchProjects(@Args('input') input: SearchProjectInput): Promise<ProjectConnection> {
    return this.projectService.search(input);
  }
}
