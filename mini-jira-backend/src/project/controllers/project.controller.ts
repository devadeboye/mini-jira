import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  UsePipes,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums/user.enum';
import { Project } from '../entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { ProjectService } from '../services/project.service';
import {
  CreateProjectDto,
  AddMemberDto,
  createProjectSchema,
  addMemberSchema,
} from '../dtos/project.dto';
import { AuthenticatedRequest } from '../../auth/types/request.type';
import { ObjectValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { UserService } from 'src/user/services/user.service';
import { AddMemberPipe, CreateProjectPipe } from '../pipes/project.pipe';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ObjectValidationPipe(createProjectSchema), CreateProjectPipe)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const owner = await this.userService.findById(req.user.id);
    return this.projectService.create({
      ...createProjectDto,
      owner,
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
  @UsePipes(new ObjectValidationPipe(addMemberSchema), AddMemberPipe)
  async addMember(
    @Request() req: AuthenticatedRequest,
    @Param('id') projectId: string,
    @Body() addMemberDto: AddMemberDto,
  ): Promise<Project> {
    const project = await this.projectService.findOne(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const isProjectOwner = project.owner.id !== req.user.id;
    if (isProjectOwner) {
      throw new ForbiddenException('Only project owner can add members');
    }

    const user = await this.userService.findById(addMemberDto.userId);
    const isAlreadyMember = project.members.some(
      (member) => member.id === addMemberDto.userId,
    );
    if (isAlreadyMember) {
      throw new ConflictException('User is already a project member');
    }

    project.members.push(user);
    return this.projectService.update(project);
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
