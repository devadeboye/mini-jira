import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { USER_SERVICE_TOKEN } from '../../common/constants/injection-tokens';
import { IUserService as UserService } from '../../user/interfaces/user-service.interface';
import { AddMemberDto } from '../dtos/project.dto';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../services/project.service';

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
  constructor(
    @Inject(USER_SERVICE_TOKEN)
    private readonly userService: UserService,
  ) {}

  async transform(addMemberDto: AddMemberDto) {
    const user = await this.userService.findById(addMemberDto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return addMemberDto;
  }
}
