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
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/user.enum';
import { Project } from '../entities/project.entity';
import { User } from '../../user/entities/user.entity';
import type { ProjectService } from '../interfaces/project-service.interface';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddMemberDto,
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from '../dtos/project.dto';
import { AuthenticatedRequest } from '../../auth/types/request.type';
import { ObjectValidationPipe } from 'src/common/pipes/joi-validation.pipe';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(
    @Inject('ProjectService')
    private readonly projectService: ProjectService,
  ) {}

  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ObjectValidationPipe(createProjectSchema))
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.create({
      ...createProjectDto,
      ownerId: req.user.id,
    });
  }

  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findAll(@Request() req: AuthenticatedRequest): Promise<Project[]> {
    return req.user.role === UserRole.ADMIN
      ? this.projectService.findAll()
      : this.projectService.findUserProjects(req.user.id);
  }

  @Get('get/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Project> {
    return req.user.role === UserRole.ADMIN
      ? this.projectService.findOne(id)
      : this.projectService.findUserProject(id, req.user.id);
  }

  @Put('update/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ObjectValidationPipe(updateProjectSchema))
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return req.user.role === UserRole.ADMIN
      ? this.projectService.update(id, updateProjectDto)
      : this.projectService.updateUserProject(
          id,
          updateProjectDto,
          req.user.id,
        );
  }

  @Delete('delete/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    return req.user.role === UserRole.ADMIN
      ? this.projectService.remove(id)
      : this.projectService.removeUserProject(id, req.user.id);
  }

  @Post('add-member/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ObjectValidationPipe(addMemberSchema))
  async addMember(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
  ): Promise<Project> {
    return this.projectService.addMember(id, addMemberDto.userId, req.user.id);
  }

  @Delete('remove-member/:id/:userId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async removeMember(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<Project> {
    return this.projectService.removeMember(id, userId, req.user.id);
  }

  @Get('get-members/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getMembers(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<User[]> {
    return this.projectService.getProjectMembers(id, req.user.id);
  }

  @Post('archive/:id')
  @Roles(UserRole.ADMIN)
  async archiveProject(@Param('id') id: string): Promise<void> {
    return this.projectService.archiveProject(id);
  }

  @Get('system/stats')
  @Roles(UserRole.ADMIN)
  async getSystemStats(): Promise<any> {
    return this.projectService.getSystemStats();
  }
}
