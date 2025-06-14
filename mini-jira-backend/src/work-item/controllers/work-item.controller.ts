import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
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

  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async create(
    @Body(new ObjectValidationPipe(createWorkItemSchema))
    createWorkItemDto: CreateWorkItemData,
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

  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll() {
    return this.workItemService.findAll();
  }

  @Get('find-by-id/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.workItemService.findOne(id);
  }

  @Get('find-by-project/:projectId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findByProject(@Param('projectId') projectId: string) {
    return this.workItemService.findByProject(projectId);
  }

  @Get('find-by-sprint/:sprintId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findBySprint(@Param('sprintId') sprintId: string) {
    return this.workItemService.findBySprint(sprintId);
  }

  @Patch('update/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async update(
    @Param('id') id: string,
    @Body(new ObjectValidationPipe(updateWorkItemSchema))
    updateWorkItemDto: UpdateWorkItemData,
  ) {
    const { assigneeId, sprintId, ...updateData } = updateWorkItemDto;
    const workItem = await this.workItemService.findOne(id);

    // Update assignee if provided
    if (assigneeId) {
      const assignee = await this.userService.findById(assigneeId);
      workItem.assignee = assignee;
    } else if (assigneeId === null || assigneeId === undefined) {
      // Remove assignee if explicitly set to null/undefined
      workItem.assignee = undefined;
    }

    // Update sprint if provided or remove if null
    if (sprintId) {
      const sprint = await this.sprintService.findOne(sprintId);
      workItem.sprint = sprint;
    } else if (sprintId === null || sprintId === undefined) {
      // Remove from sprint (move to backlog) if explicitly set to null/undefined
      workItem.sprint = undefined;
    }

    Object.assign(workItem, updateData);

    return this.workItemService.update(workItem);
  }

  @Delete('delete/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  remove(@Param('id') id: string) {
    return this.workItemService.remove(id);
  }

  @Get('backlogs/:projectId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findBacklogs(@Param('projectId') projectId: string) {
    return this.workItemService.findBacklogs(projectId);
  }
}
