import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { Project } from '../project/entities/project.entity';
import { WorkItem } from '../work-item/entities/work-item.entity';
import { User } from '../user/entities/user.entity';
import { SprintService } from './services/sprint.service';
import { SprintController } from './controllers/sprint.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, Project, WorkItem, User])],
  controllers: [SprintController],
  providers: [
    {
      provide: 'SprintService',
      useClass: SprintService,
    },
  ],
  exports: [TypeOrmModule, 'SprintService'],
})
export class SprintModule {}
