import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItemController } from './controllers/work-item.controller';
import { WorkItemService } from './services/work-item.service';
import { WorkItem } from './entities/work-item.entity';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([WorkItem]), UserModule, ProjectModule],
  controllers: [WorkItemController],
  providers: [WorkItemService],
  exports: [WorkItemService],
})
export class WorkItemModule {}
