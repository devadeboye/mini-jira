import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { ProjectService as IProjectService } from '../interfaces/project-service.interface';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new project
   */
  async create(data: { ownerId: string } & CreateProjectDto): Promise<Project> {
    const { ownerId, ...projectData } = data;

    // Check if owner exists
    const owner = await this.userRepository.findOne({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    // Check if project key is unique
    const existingProject = await this.projectRepository.findOne({
      where: { key: projectData.key },
    });

    if (existingProject) {
      throw new ConflictException('Project key already exists');
    }

    // Validate project key format (should be uppercase, 2-10 characters)
    if (!/^[A-Z]{2,10}$/.test(projectData.key)) {
      throw new BadRequestException(
        'Project key must be 2-10 uppercase letters',
      );
    }

    // Create project
    const project = this.projectRepository.create({
      ...projectData,
      owner,
      members: [owner], // Owner is automatically a member
    });

    const savedProject = await this.projectRepository.save(project);

    // Mark user as having created a project
    if (!owner.hasCreatedProject) {
      await this.userRepository.update(ownerId, { hasCreatedProject: true });
    }

    return savedProject;
  }

  /**
   * Find all projects (admin only)
   */
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['owner', 'members', 'sprints', 'workItems'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find projects for a specific user (owned or member)
   */
  async findUserProjects(userId: string): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('project.sprints', 'sprints')
      .leftJoinAndSelect('project.workItems', 'workItems')
      .where('project.owner.id = :userId', { userId })
      .orWhere('members.id = :userId', { userId })
      .orderBy('project.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Find a single project by ID
   */
  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'sprints', 'workItems'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  /**
   * Find a project that user has access to (owned or member)
   */
  async findUserProject(id: string, userId: string): Promise<Project> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('project.sprints', 'sprints')
      .leftJoinAndSelect('project.workItems', 'workItems')
      .where('project.id = :id', { id })
      .andWhere('(project.owner.id = :userId OR members.id = :userId)', {
        userId,
      })
      .getOne();

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }

    return project;
  }

  /**
   * Update a project (admin only)
   */
  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    // Validate project key if being updated
    if (data.key && data.key !== project.key) {
      if (!/^[A-Z]{2,10}$/.test(data.key)) {
        throw new BadRequestException(
          'Project key must be 2-10 uppercase letters',
        );
      }

      const existingProject = await this.projectRepository.findOne({
        where: { key: data.key },
      });

      if (existingProject) {
        throw new ConflictException('Project key already exists');
      }
    }

    Object.assign(project, data);
    return await this.projectRepository.save(project);
  }

  /**
   * Update a project that user owns
   */
  async updateUserProject(
    id: string,
    data: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ['owner', 'members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }

    // Validate project key if being updated
    if (data.key && data.key !== project.key) {
      if (!/^[A-Z]{2,10}$/.test(data.key)) {
        throw new BadRequestException(
          'Project key must be 2-10 uppercase letters',
        );
      }

      const existingProject = await this.projectRepository.findOne({
        where: { key: data.key },
      });

      if (existingProject) {
        throw new ConflictException('Project key already exists');
      }
    }

    Object.assign(project, data);
    return await this.projectRepository.save(project);
  }

  /**
   * Remove a project (admin only)
   */
  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  /**
   * Remove a project that user owns
   */
  async removeUserProject(id: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }

    await this.projectRepository.remove(project);
  }

  /**
   * Archive a project (soft delete - admin only)
   */
  async archiveProject(id: string): Promise<void> {
    const project = await this.findOne(id);

    // Add archived status to project (you might want to add an 'archived' field to the entity)
    // For now, we'll add it to the description
    project.description = `[ARCHIVED] ${project.description || ''}`;
    await this.projectRepository.save(project);
  }

  /**
   * Get system statistics (admin only)
   */
  async getSystemStats(): Promise<Record<string, any>> {
    const totalProjects = await this.projectRepository.count();
    const scrumProjects = await this.projectRepository.count({
      where: { type: 'scrum' },
    });
    const kanbanProjects = await this.projectRepository.count({
      where: { type: 'kanban' },
    });

    // Get projects created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProjects = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    // Get most active projects (by work item count)
    const activeProjects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.workItems', 'workItems')
      .select('project.id', 'id')
      .addSelect('project.name', 'name')
      .addSelect('COUNT(workItems.id)', 'workItemCount')
      .groupBy('project.id')
      .addGroupBy('project.name')
      .orderBy('workItemCount', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      totalProjects,
      projectsByType: {
        scrum: scrumProjects,
        kanban: kanbanProjects,
      },
      recentProjects,
      mostActiveProjects: activeProjects,
      lastUpdated: new Date(),
    };
  }

  /**
   * Add a member to a project
   */
  async addMember(
    projectId: string,
    userId: string,
    requesterId: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if requester is the owner
    if (project.owner.id !== requesterId) {
      throw new ForbiddenException('Only project owner can add members');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const isAlreadyMember = project.members.some(
      (member) => member.id === userId,
    );
    if (isAlreadyMember) {
      throw new ConflictException('User is already a project member');
    }

    project.members.push(user);
    return await this.projectRepository.save(project);
  }

  /**
   * Remove a member from a project
   */
  async removeMember(
    projectId: string,
    userId: string,
    requesterId: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if requester is the owner
    if (project.owner.id !== requesterId) {
      throw new ForbiddenException('Only project owner can remove members');
    }

    // Cannot remove the owner
    if (project.owner.id === userId) {
      throw new BadRequestException('Cannot remove project owner');
    }

    project.members = project.members.filter((member) => member.id !== userId);
    return await this.projectRepository.save(project);
  }

  /**
   * Get project members
   */
  async getProjectMembers(projectId: string, userId: string): Promise<User[]> {
    const project = await this.findUserProject(projectId, userId);
    return project.members;
  }
}
