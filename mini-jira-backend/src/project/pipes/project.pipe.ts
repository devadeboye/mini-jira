import {
  ConflictException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { Project } from '../entities/project.entity';
import { AddMemberDto } from '../dtos/project.dto';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class CreateProjectPipe implements PipeTransform {
  constructor(private readonly projectService: ProjectService) {}

  async transform(value: Project) {
    const project = await this.projectService.findOneByKey(value.key);
    if (project) {
      throw new ConflictException('Project key already exists');
    }
    return value;
  }
}

@Injectable()
export class AddMemberPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(addMemberDto: AddMemberDto) {
    const user = await this.userService.findById(addMemberDto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return addMemberDto;
  }
}
