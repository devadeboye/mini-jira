import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from './entities/work-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkItem])],
  exports: [TypeOrmModule],
})
export class WorkItemModule {}
