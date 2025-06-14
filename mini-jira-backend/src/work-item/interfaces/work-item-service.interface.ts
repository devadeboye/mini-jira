import { WorkItem } from '../entities/work-item.entity';

export interface WorkItemService {
  // Basic CRUD operations
  create(
    data: { projectId: string; createdById: string } & Record<string, any>,
  ): Promise<WorkItem>;
  findAll(): Promise<WorkItem[]>;
  findProjectWorkItems(projectId: string, userId: string): Promise<WorkItem[]>;
  findSprintWorkItems(sprintId: string, userId: string): Promise<WorkItem[]>;
  findUserWorkItems(userId: string): Promise<WorkItem[]>;
  findOne(id: string): Promise<WorkItem>;
  findUserWorkItem(id: string, userId: string): Promise<WorkItem>;
  update(id: string, data: Record<string, any>): Promise<WorkItem>;
  updateUserWorkItem(
    id: string,
    data: Record<string, any>,
    userId: string,
  ): Promise<WorkItem>;
  remove(id: string): Promise<void>;
  removeUserWorkItem(id: string, userId: string): Promise<void>;

  // Work item specific operations
  assignWorkItem(
    id: string,
    assigneeId: string,
    userId: string,
  ): Promise<WorkItem>;
  unassignWorkItem(id: string, userId: string): Promise<WorkItem>;
  moveToSprint(id: string, sprintId: string, userId: string): Promise<WorkItem>;
  removeFromSprint(id: string, userId: string): Promise<WorkItem>;
  updateStatus(id: string, status: string, userId: string): Promise<WorkItem>;
  updatePriority(
    id: string,
    priority: string,
    userId: string,
  ): Promise<WorkItem>;
  reorderWorkItems(
    projectId: string,
    workItemIds: string[],
    userId: string,
  ): Promise<WorkItem[]>;

  // Analytics and filtering
  getWorkItemStats(
    projectId: string,
    userId: string,
  ): Promise<Record<string, any>>;
  getUserWorkItemStats(userId: string): Promise<Record<string, any>>;
  searchWorkItems(
    query: string,
    projectId?: string,
    userId?: string,
  ): Promise<WorkItem[]>;
}
