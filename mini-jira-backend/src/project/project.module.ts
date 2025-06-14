import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { User } from '../user/entities/user.entity';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ProjectController],
  providers: [
    {
      provide: 'ProjectService',
      useClass: ProjectService,
    },
  ],
  exports: [TypeOrmModule, 'ProjectService'],
})
export class ProjectModule {}
