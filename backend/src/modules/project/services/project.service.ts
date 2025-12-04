import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectInput, UpdateProjectInput, SearchProjectInput } from '../dto/project.input';
import { Project } from '../entities/project.entity';
import { AuditLoggerService } from '../../../core/observability/audit-logger.service';
import { AuditAction } from '../../../modules/logging/entities/audit-log.entity';

@Injectable()
export class ProjectService {
  private readonly INDEX_NAME = 'projects';
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private projectRepository: ProjectRepository,
    private elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private auditLogger: AuditLoggerService,
  ) {}

  async create(input: CreateProjectInput, userId?: string, ip?: string): Promise<Project> {
    const project = await this.projectRepository.create(input);
    await this.indexProject(project);
    await this.invalidateCache();
    
    await this.auditLogger.logDataAccess(AuditAction.CREATE, 'Project', {
      userId,
      resourceId: project.id,
      ip: ip || 'unknown',
      metadata: { title: project.title },
    });
    
    return project;
  }

  async findById(id: string): Promise<Project> {
    const cacheKey = `project:${id}`;
    const cached = await this.cacheManager.get<Project>(cacheKey);
    if (cached) return cached;

    const project = await this.projectRepository.findById(id);
    if (!project) throw new NotFoundException('Project not found');

    await this.cacheManager.set(cacheKey, project, this.CACHE_TTL);
    return project;
  }

  async update(id: string, input: UpdateProjectInput, userId?: string, ip?: string): Promise<Project> {
    const project = await this.projectRepository.update(id, input);
    if (!project) throw new NotFoundException('Project not found');

    await this.indexProject(project);
    await this.invalidateCache();
    await this.cacheManager.del(`project:${id}`);
    
    await this.auditLogger.logDataAccess(AuditAction.UPDATE, 'Project', {
      userId,
      resourceId: id,
      ip: ip || 'unknown',
      metadata: { changes: Object.keys(input) },
    });
    
    return project;
  }

  async delete(id: string, userId?: string, ip?: string): Promise<boolean> {
    const deleted = await this.projectRepository.delete(id);
    if (!deleted) throw new NotFoundException('Project not found');

    await this.deleteFromIndex(id);
    await this.invalidateCache();
    await this.cacheManager.del(`project:${id}`);
    
    await this.auditLogger.logDataAccess(AuditAction.DELETE, 'Project', {
      userId,
      resourceId: id,
      ip: ip || 'unknown',
    });
    
    return true;
  }

  async search(input: SearchProjectInput) {
    const { query, status, skills, featured, limit = 20, cursor } = input;

    const must: any[] = [];
    const filter: any[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['title^2', 'description', 'translations.title^2', 'translations.description'],
          fuzziness: 'AUTO',
        },
      });
    }

    if (status?.length) filter.push({ terms: { status } });
    if (skills?.length) filter.push({ terms: { skills } });
    if (featured !== undefined) filter.push({ term: { featured } });

    const searchAfter = cursor ? JSON.parse(Buffer.from(cursor, 'base64').toString()) : undefined;

    const { hits } = await this.elasticsearchService.search({
      index: this.INDEX_NAME,
      body: {
        query: { bool: { must: must.length ? must : [{ match_all: {} }], filter } },
        sort: [{ createdAt: 'desc' }, { _id: 'asc' }],
        size: limit + 1,
        search_after: searchAfter,
      },
    });

    const items = hits.hits.slice(0, limit).map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));

    const hasMore = hits.hits.length > limit;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore && lastItem
      ? Buffer.from(JSON.stringify([lastItem.createdAt, lastItem.id])).toString('base64')
      : undefined;

    const total = typeof hits.total === 'number' ? hits.total : hits.total?.value || 0;
    return { items, total, cursor: nextCursor, hasMore };
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.projectRepository.incrementViewCount(id);
    await this.cacheManager.del(`project:${id}`);
  }

  private async indexProject(project: Project): Promise<void> {
    await this.elasticsearchService.index({
      index: this.INDEX_NAME,
      id: project.id,
      document: {
        title: project.title,
        description: project.description,
        translations: project.translations,
        skills: project.skills,
        status: project.status,
        featured: project.featured,
        createdAt: project.createdAt,
      },
    });
  }

  private async deleteFromIndex(id: string): Promise<void> {
    await this.elasticsearchService.delete({ index: this.INDEX_NAME, id }).catch(() => {});
  }

  private async invalidateCache(): Promise<void> {
    await this.cacheManager.del('projects:list');
  }
}
