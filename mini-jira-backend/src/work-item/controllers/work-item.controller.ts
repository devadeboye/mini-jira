import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UsePipes,
} from '@nestjs/common';
import { WorkItemService } from '../services/work-item.service';
import { ObjectValidationPipe } from '../../common/pipes/joi-validation.pipe';
import {
  createWorkItemSchema,
  updateWorkItemSchema,
} from '../validation/work-item.schema';
import {
  CreateWorkItemData,
  UpdateWorkItemData,
} from '../interfaces/work-item.interface';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/user.enum';
import { AuthenticatedRequest } from 'src/auth/types/request.type';

import { UserService } from 'src/user/services/user.service';
import { ProjectService } from 'src/project/services/project.service';
import { SprintService } from 'src/sprint/services/sprint.service';

@Controller('work-items')
export class WorkItemController {
  constructor(
    private readonly workItemService: WorkItemService,
    private projectService: ProjectService,
    private userService: UserService,
    private sprintService: SprintService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ObjectValidationPipe(createWorkItemSchema))
  async create(
    @Body() createWorkItemDto: CreateWorkItemData,
    @Req() req: AuthenticatedRequest,
  ) {
    const workItem = this.workItemService.create(createWorkItemDto);
    const project = await this.projectService.findOne(
      createWorkItemDto.projectId,
    );
    workItem.project = project;

    // Set creator
    const creator = await this.userService.findById(req.user.id);
    workItem.creator = creator;

    return this.workItemService.update(workItem);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll() {
    return this.workItemService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.workItemService.findOne(id);
  }

  @Get('project/:projectId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findByProject(@Param('projectId') projectId: string) {
    return this.workItemService.findByProject(projectId);
  }

  @Get('sprint/:sprintId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findBySprint(@Param('sprintId') sprintId: string) {
    return this.workItemService.findBySprint(sprintId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ObjectValidationPipe(updateWorkItemSchema))
  async update(
    @Param('id') id: string,
    @Body() updateWorkItemDto: UpdateWorkItemData,
  ) {
    const { assigneeId, sprintId, ...updateData } = updateWorkItemDto;
    const workItem = await this.workItemService.findOne(id);
    // Update assignee if provided
    if (assigneeId) {
      const assignee = await this.userService.findById(assigneeId);
      workItem.assignee = assignee;
    }

    // Update sprint if provided
    if (sprintId) {
      const sprint = await this.sprintService.findOne(sprintId);
      workItem.sprint = sprint;
    }
    Object.assign(workItem, updateData);

    return this.workItemService.update(workItem);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  remove(@Param('id') id: string) {
    return this.workItemService.remove(id);
  }
}
