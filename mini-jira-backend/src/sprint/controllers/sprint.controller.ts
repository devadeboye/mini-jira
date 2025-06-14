import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  BadRequestException,
  Query,
  ConflictException,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/user.enum';
import { Sprint } from '../entities/sprint.entity';
import { WorkItem } from '../../work-item/entities/work-item.entity';
import {
  validateCreateSprint,
  validateUpdateSprint,
  addWorkItemToSprintSchema,
  AddWorkItemToSprintDto,
} from '../dto/sprint.dto';
import { AuthenticatedRequest } from '../../auth/types/request.type';
import { WorkItemService } from '../../work-item/services/work-item.service';
import { ObjectValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { SprintService } from '../services/sprint.service';

@Controller('sprints')
export class SprintController {
  constructor(
    private readonly sprintService: SprintService,
    private readonly workItemService: WorkItemService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: unknown,
    @Query('projectId') projectId: string,
  ): Promise<Sprint> {
    try {
      const createSprintDto = validateCreateSprint(body);
      return this.sprintService.create({
        ...createSprintDto,
        projectId,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Invalid request');
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('projectId') projectId?: string,
  ): Promise<Sprint[]> {
    if (projectId) {
      return this.sprintService.findProjectSprints(projectId, req.user.id);
    }

    // Admin sees all, users see their accessible sprints
    return req.user.role === UserRole.ADMIN ? this.sprintService.findAll() : []; // Users must specify a project
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Sprint> {
    return req.user.role === UserRole.ADMIN
      ? this.sprintService.findOne(id)
      : this.sprintService.findUserSprint(id, req.user.id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<Sprint> {
    try {
      const updateSprintDto = validateUpdateSprint(body);
      return req.user.role === UserRole.ADMIN
        ? this.sprintService.update(id, updateSprintDto)
        : this.sprintService.updateUserSprint(id, updateSprintDto, req.user.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Invalid request');
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    return req.user.role === UserRole.ADMIN
      ? this.sprintService.remove(id)
      : this.sprintService.removeUserSprint(id, req.user.id);
  }

  // Sprint lifecycle management
  @Post(':id/start')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async startSprint(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Sprint> {
    return this.sprintService.startSprint(id, req.user.id);
  }

  @Post(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async completeSprint(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Sprint> {
    return this.sprintService.completeSprint(id, req.user.id);
  }

  // Work item management
  @Get(':id/work-items')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getWorkItems(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<WorkItem[]> {
    return this.sprintService.getSprintWorkItems(id, req.user.id);
  }

  @Post(':id/work-items')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ObjectValidationPipe(addWorkItemToSprintSchema))
  async addWorkItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') sprintId: string,
    @Body() addWorkItemDto: AddWorkItemToSprintDto,
  ): Promise<Sprint> {
    // Get sprint and verify user access
    const sprint = await this.sprintService.findUserSprint(
      sprintId,
      req.user.id,
    );

    // Get work item and verify it exists
    const workItem = await this.workItemService.findOne(
      addWorkItemDto.workItemId,
    );

    // Verify work item belongs to the same project
    if (workItem.project.id !== sprint.project.id) {
      throw new BadRequestException(
        'Work item does not belong to this project',
      );
    }

    // Check if work item is already in this sprint
    if (workItem.sprint?.id === sprintId) {
      throw new ConflictException('Work item is already in this sprint');
    }

    // Update work item's sprint reference
    await this.workItemService.update({ ...workItem, sprint: sprint });

    // Return updated sprint
    return this.sprintService.findUserSprint(sprintId, req.user.id);
  }

  @Delete(':id/work-items/:workItemId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async removeWorkItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') sprintId: string,
    @Param('workItemId') workItemId: string,
  ): Promise<Sprint> {
    // Get sprint and verify user access
    await this.sprintService.findUserSprint(sprintId, req.user.id);

    // Get work item and verify it exists
    const workItem = await this.workItemService.findOne(workItemId);

    // Verify work item is in this sprint
    if (workItem.sprint?.id !== sprintId) {
      throw new NotFoundException('Work item not found in this sprint');
    }

    // Remove work item's sprint reference
    await this.workItemService.update({ ...workItem, sprint: undefined });

    // Return updated sprint
    return this.sprintService.findUserSprint(sprintId, req.user.id);
  }

  // Analytics
  @Get(':id/stats')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getSprintStats(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<any> {
    return this.sprintService.getSprintStats(id, req.user.id);
  }

  @Get('projects/:projectId/stats')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getProjectSprintStats(
    @Request() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ): Promise<any> {
    return this.sprintService.getProjectSprintStats(projectId, req.user.id);
  }
}
