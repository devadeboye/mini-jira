import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Inject,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/user.enum';
import { Sprint } from '../entities/sprint.entity';
import { WorkItem } from '../../work-item/entities/work-item.entity';
import type { SprintService } from '../interfaces/sprint-service.interface';
import {
  validateCreateSprint,
  validateUpdateSprint,
  validateAddWorkItemToSprint,
} from '../dto/sprint.dto';
import { AuthenticatedRequest } from '../../auth/types/request.type';

@Controller('sprints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SprintController {
  constructor(
    @Inject('SprintService')
    private readonly sprintService: SprintService,
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
    } catch (error) {
      throw new BadRequestException(error.message);
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
    } catch (error) {
      throw new BadRequestException(error.message);
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
  async addWorkItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<Sprint> {
    try {
      const addWorkItemDto = validateAddWorkItemToSprint(body);
      return this.sprintService.addWorkItemToSprint(
        id,
        addWorkItemDto.workItemId,
        req.user.id,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id/work-items/:workItemId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async removeWorkItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('workItemId') workItemId: string,
  ): Promise<Sprint> {
    return this.sprintService.removeWorkItemFromSprint(
      id,
      workItemId,
      req.user.id,
    );
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
