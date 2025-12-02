import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CacheModule } from '@nestjs/cache-manager';
import { Project, ProjectSchema } from './entities/project.entity';
import { ProjectService } from './services/project.service';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectResolver } from './resolvers/project.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
          password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
        },
      }),
    }),
    CacheModule.register(),
  ],
  providers: [ProjectService, ProjectRepository, ProjectResolver],
  exports: [ProjectService],
})
export class ProjectModule {}
