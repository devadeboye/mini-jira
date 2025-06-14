import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { ProjectModule } from '../project/project.module';
import { WorkItemModule } from '../work-item/work-item.module';
import { SprintService } from './services/sprint.service';
import { SprintController } from './controllers/sprint.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Sprint]), ProjectModule, WorkItemModule],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService],
})
export class SprintModule {}
