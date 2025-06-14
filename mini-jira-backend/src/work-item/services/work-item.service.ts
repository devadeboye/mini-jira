import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { WorkItem } from '../entities/work-item.entity';
import { CreateWorkItemData } from '../interfaces/work-item.interface';

@Injectable()
export class WorkItemService {
  constructor(
    @InjectRepository(WorkItem)
    private workItemRepository: Repository<WorkItem>,
  ) {}

  create(createWorkItemData: CreateWorkItemData): WorkItem {
    return this.workItemRepository.create(createWorkItemData);
  }

  async findAll() {
    return this.workItemRepository.find({
      relations: ['project', 'creator', 'assignee', 'sprint'],
    });
  }

  async findOne(id: string) {
    const workItem = await this.workItemRepository.findOne({
      where: { id },
      relations: ['project', 'creator', 'assignee', 'sprint'],
    });

    if (!workItem) {
      throw new NotFoundException(`Work item with ID "${id}" not found`);
    }

    return workItem;
  }

  async findByProject(projectId: string) {
    return this.workItemRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'creator', 'assignee', 'sprint'],
    });
  }

  async findBySprint(sprintId: string) {
    return this.workItemRepository.find({
      where: { sprint: { id: sprintId } },
      relations: ['project', 'creator', 'assignee', 'sprint'],
    });
  }

  async update(workItem: WorkItem) {
    return this.workItemRepository.save(workItem);
  }

  async remove(id: string) {
    const workItem = await this.findOne(id);
    return this.workItemRepository.remove(workItem);
  }

  async findBacklogs(projectId: string) {
    return this.workItemRepository.find({
      where: { project: { id: projectId }, sprint: { id: IsNull() } },
      relations: ['project', 'creator', 'assignee', 'sprint'],
    });
  }
}
