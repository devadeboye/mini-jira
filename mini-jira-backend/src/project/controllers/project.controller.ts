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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/user.enum';
import { Project } from '../entities/project.entity';
import type { ProjectService } from '../interfaces/project-service.interface';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { AuthenticatedRequest } from '../../auth/types/request.type';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER) // Both can create projects
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.create({
      ...createProjectDto,
      ownerId: req.user.id,
    } as { ownerId: string } & CreateProjectDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER) // Both can view projects
  async findAll(@Request() req: AuthenticatedRequest): Promise<Project[]> {
    // Admin sees all, users see their own and shared projects
    return req.user.role === UserRole.ADMIN
      ? this.projectService.findAll()
      : this.projectService.findUserProjects(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER) // Both can view projects
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Project> {
    // Admin can view any project, users only their own and shared
    return req.user.role === UserRole.ADMIN
      ? this.projectService.findOne(id)
      : this.projectService.findUserProject(id, req.user.id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.USER) // Both can update projects
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    // Admin can update any project, users only their own
    return req.user.role === UserRole.ADMIN
      ? this.projectService.update(id, updateProjectDto)
      : this.projectService.updateUserProject(
          id,
          updateProjectDto,
          req.user.id,
        );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER) // Both can delete projects
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    // Admin can delete any project, users only their own
    return req.user.role === UserRole.ADMIN
      ? this.projectService.remove(id)
      : this.projectService.removeUserProject(id, req.user.id);
  }

  // Admin-only routes
  @Post(':id/archive')
  @Roles(UserRole.ADMIN) // Only admin can archive projects
  async archiveProject(@Param('id') id: string): Promise<void> {
    return this.projectService.archiveProject(id);
  }

  @Get('system/stats')
  @Roles(UserRole.ADMIN) // Only admin can view system stats
  async getSystemStats(): Promise<any> {
    return this.projectService.getSystemStats();
  }
}
