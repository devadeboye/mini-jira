import { Sprint } from '../entities/sprint.entity';
import { WorkItem } from '../../work-item/entities/work-item.entity';

export interface SprintService {
  // Basic CRUD operations
  create(data: { projectId: string } & Record<string, any>): Promise<Sprint>;
  findAll(): Promise<Sprint[]>;
  findProjectSprints(projectId: string, userId: string): Promise<Sprint[]>;
  findOne(id: string): Promise<Sprint>;
  findUserSprint(id: string, userId: string): Promise<Sprint>;
  update(id: string, data: Record<string, any>): Promise<Sprint>;
  updateUserSprint(
    id: string,
    data: Record<string, any>,
    userId: string,
  ): Promise<Sprint>;
  remove(id: string): Promise<void>;
  removeUserSprint(id: string, userId: string): Promise<void>;

  // Sprint-specific operations
  startSprint(id: string, userId: string): Promise<Sprint>;
  completeSprint(id: string, userId: string): Promise<Sprint>;
  getSprintWorkItems(id: string, userId: string): Promise<WorkItem[]>;

  // Analytics
  getSprintStats(id: string, userId: string): Promise<Record<string, any>>;
  getProjectSprintStats(
    projectId: string,
    userId: string,
  ): Promise<Record<string, any>>;
}
