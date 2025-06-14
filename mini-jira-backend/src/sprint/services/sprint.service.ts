import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from '../entities/sprint.entity';
import { Project } from '../../project/entities/project.entity';
import { WorkItem } from '../../work-item/entities/work-item.entity';
import { User } from '../../user/entities/user.entity';
import { SprintService as ISprintService } from '../interfaces/sprint-service.interface';
import { CreateSprintDto, UpdateSprintDto } from '../dto/sprint.dto';

@Injectable()
export class SprintService implements ISprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(WorkItem)
    private readonly workItemRepository: Repository<WorkItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new sprint
   */
  async create(data: { projectId: string } & CreateSprintDto): Promise<Sprint> {
    const { projectId, ...sprintData } = data;

    // Check if project exists and user has access
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Validate dates if provided
    if (sprintData.startDate && sprintData.endDate) {
      if (sprintData.startDate >= sprintData.endDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Check if there's already an active sprint in the project
    const activeSprint = await this.sprintRepository.findOne({
      where: { project: { id: projectId }, status: 'active' },
    });

    if (activeSprint) {
      throw new ConflictException('Project already has an active sprint');
    }

    // Create sprint
    const sprint = this.sprintRepository.create({
      ...sprintData,
      status: 'planned',
      project,
    });

    return await this.sprintRepository.save(sprint);
  }

  /**
   * Find all sprints (admin only)
   */
  async findAll(): Promise<Sprint[]> {
    return await this.sprintRepository.find({
      relations: ['project', 'workItems'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find sprints for a specific project
   */
  async findProjectSprints(
    projectId: string,
    userId: string,
  ): Promise<Sprint[]> {
    // Check if user has access to the project
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.members', 'members')
      .where('project.id = :projectId', { projectId })
      .andWhere('(project.owner.id = :userId OR members.id = :userId)', {
        userId,
      })
      .getOne();

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }

    return await this.sprintRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'workItems', 'workItems.assignee'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a single sprint by ID
   */
  async findOne(id: string): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({
      where: { id },
      relations: [
        'project',
        'workItems',
        'workItems.assignee',
        'workItems.createdBy',
      ],
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    return sprint;
  }

  /**
   * Find a sprint that user has access to
   */
  async findUserSprint(id: string, userId: string): Promise<Sprint> {
    const sprint = await this.sprintRepository
      .createQueryBuilder('sprint')
      .leftJoinAndSelect('sprint.project', 'project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('sprint.workItems', 'workItems')
      .leftJoinAndSelect('workItems.assignee', 'assignee')
      .leftJoinAndSelect('workItems.createdBy', 'createdBy')
      .where('sprint.id = :id', { id })
      .andWhere('(owner.id = :userId OR members.id = :userId)', { userId })
      .getOne();

    if (!sprint) {
      throw new NotFoundException('Sprint not found or access denied');
    }

    return sprint;
  }

  /**
   * Update a sprint (admin only)
   */
  async update(id: string, data: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.findOne(id);

    // Validate status transitions
    if (data.status && data.status !== sprint.status) {
      this.validateStatusTransition(sprint.status, data.status);
    }

    // Validate dates
    if (data.startDate || data.endDate) {
      const startDate = data.startDate || sprint.startDate;
      const endDate = data.endDate || sprint.endDate;

      if (startDate && endDate && startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    Object.assign(sprint, data);
    return await this.sprintRepository.save(sprint);
  }

  /**
   * Update a sprint that user has access to
   */
  async updateUserSprint(
    id: string,
    data: UpdateSprintDto,
    userId: string,
  ): Promise<Sprint> {
    const sprint = await this.findUserSprint(id, userId);

    // Check if user is project owner or member
    const isOwner = sprint.project.owner.id === userId;
    const isMember = sprint.project.members.some(
      (member) => member.id === userId,
    );

    if (!isOwner && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    // Validate status transitions
    if (data.status && data.status !== sprint.status) {
      this.validateStatusTransition(sprint.status, data.status);
    }

    // Validate dates
    if (data.startDate || data.endDate) {
      const startDate = data.startDate || sprint.startDate;
      const endDate = data.endDate || sprint.endDate;

      if (startDate && endDate && startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    Object.assign(sprint, data);
    return await this.sprintRepository.save(sprint);
  }

  /**
   * Remove a sprint (admin only)
   */
  async remove(id: string): Promise<void> {
    const sprint = await this.findOne(id);

    if (sprint.status === 'active') {
      throw new BadRequestException('Cannot delete an active sprint');
    }

    await this.sprintRepository.remove(sprint);
  }

  /**
   * Remove a sprint that user has access to
   */
  async removeUserSprint(id: string, userId: string): Promise<void> {
    const sprint = await this.findUserSprint(id, userId);

    // Only project owner can delete sprints
    if (sprint.project.owner.id !== userId) {
      throw new ForbiddenException('Only project owner can delete sprints');
    }

    if (sprint.status === 'active') {
      throw new BadRequestException('Cannot delete an active sprint');
    }

    await this.sprintRepository.remove(sprint);
  }

  /**
   * Start a sprint
   */
  async startSprint(id: string, userId: string): Promise<Sprint> {
    const sprint = await this.findUserSprint(id, userId);

    if (sprint.status !== 'planned') {
      throw new BadRequestException('Only planned sprints can be started');
    }

    // Check if there's already an active sprint in the project
    const activeSprint = await this.sprintRepository.findOne({
      where: { project: { id: sprint.project.id }, status: 'active' },
    });

    if (activeSprint && activeSprint.id !== id) {
      throw new ConflictException('Project already has an active sprint');
    }

    sprint.status = 'active';
    if (!sprint.startDate) {
      sprint.startDate = new Date();
    }

    return await this.sprintRepository.save(sprint);
  }

  /**
   * Complete a sprint
   */
  async completeSprint(id: string, userId: string): Promise<Sprint> {
    const sprint = await this.findUserSprint(id, userId);

    if (sprint.status !== 'active') {
      throw new BadRequestException('Only active sprints can be completed');
    }

    sprint.status = 'completed';
    if (!sprint.endDate) {
      sprint.endDate = new Date();
    }

    return await this.sprintRepository.save(sprint);
  }

  /**
   * Get sprint work items
   */
  async getSprintWorkItems(id: string, userId: string): Promise<WorkItem[]> {
    const sprint = await this.findUserSprint(id, userId);
    return sprint.workItems;
  }

  /**
   * Add work item to sprint
   */
  async addWorkItemToSprint(
    sprintId: string,
    workItemId: string,
    userId: string,
  ): Promise<Sprint> {
    const sprint = await this.findUserSprint(sprintId, userId);

    const workItem = await this.workItemRepository.findOne({
      where: { id: workItemId, project: { id: sprint.project.id } },
    });

    if (!workItem) {
      throw new NotFoundException('Work item not found in this project');
    }

    if (workItem.sprint?.id === sprintId) {
      throw new ConflictException('Work item is already in this sprint');
    }

    workItem.sprint = sprint;
    await this.workItemRepository.save(workItem);

    return await this.findUserSprint(sprintId, userId);
  }

  /**
   * Remove work item from sprint
   */
  async removeWorkItemFromSprint(
    sprintId: string,
    workItemId: string,
    userId: string,
  ): Promise<Sprint> {
    await this.findUserSprint(sprintId, userId);

    const workItem = await this.workItemRepository.findOne({
      where: { id: workItemId, sprint: { id: sprintId } },
    });

    if (!workItem) {
      throw new NotFoundException('Work item not found in this sprint');
    }

    workItem.sprint = undefined;
    await this.workItemRepository.save(workItem);

    return await this.findUserSprint(sprintId, userId);
  }

  /**
   * Get sprint statistics
   */
  async getSprintStats(
    id: string,
    userId: string,
  ): Promise<Record<string, any>> {
    const sprint = await this.findUserSprint(id, userId);

    const totalWorkItems = sprint.workItems.length;
    const completedWorkItems = sprint.workItems.filter(
      (item) => item.status === 'done',
    ).length;
    const inProgressWorkItems = sprint.workItems.filter(
      (item) => item.status === 'in-progress',
    ).length;
    const todoWorkItems = sprint.workItems.filter(
      (item) => item.status === 'todo',
    ).length;

    const totalEstimate = sprint.workItems.reduce(
      (sum, item) => sum + item.estimate,
      0,
    );
    const completedEstimate = sprint.workItems
      .filter((item) => item.status === 'done')
      .reduce((sum, item) => sum + item.estimate, 0);

    const completionPercentage =
      totalEstimate > 0 ? (completedEstimate / totalEstimate) * 100 : 0;

    let daysRemaining: number | undefined;
    let isOverdue = false;

    if (sprint.endDate) {
      const now = new Date();
      const timeDiff = sprint.endDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      isOverdue = daysRemaining < 0;
    }

    return {
      totalWorkItems,
      completedWorkItems,
      inProgressWorkItems,
      todoWorkItems,
      totalEstimate,
      completedEstimate,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
      daysRemaining,
      isOverdue,
    };
  }

  /**
   * Get project sprint statistics
   */
  async getProjectSprintStats(
    projectId: string,
    userId: string,
  ): Promise<Record<string, any>> {
    const sprints = await this.findProjectSprints(projectId, userId);

    const totalSprints = sprints.length;
    const plannedSprints = sprints.filter(
      (sprint) => sprint.status === 'planned',
    ).length;
    const activeSprints = sprints.filter(
      (sprint) => sprint.status === 'active',
    ).length;
    const completedSprints = sprints.filter(
      (sprint) => sprint.status === 'completed',
    ).length;

    const totalWorkItems = sprints.reduce(
      (sum, sprint) => sum + sprint.workItems.length,
      0,
    );
    const completedWorkItems = sprints.reduce(
      (sum, sprint) =>
        sum + sprint.workItems.filter((item) => item.status === 'done').length,
      0,
    );

    return {
      totalSprints,
      sprintsByStatus: {
        planned: plannedSprints,
        active: activeSprints,
        completed: completedSprints,
      },
      totalWorkItems,
      completedWorkItems,
      completionRate:
        totalWorkItems > 0 ? (completedWorkItems / totalWorkItems) * 100 : 0,
    };
  }

  /**
   * Validate sprint status transitions
   */
  private validateStatusTransition(
    currentStatus: string,
    newStatus: string,
  ): void {
    const validTransitions: Record<string, string[]> = {
      planned: ['active'],
      active: ['completed'],
      completed: [], // No transitions from completed
    };

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
