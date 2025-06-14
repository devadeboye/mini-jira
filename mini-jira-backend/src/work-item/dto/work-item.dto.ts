import {
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType,
} from '../enums/work-item.enum';

// DTO Interfaces
export interface CreateWorkItemDto {
  title: string;
  type: WorkItemType;
  priority: WorkItemPriority;
  description?: string;
  estimate: number;
  assigneeId?: string;
  sprintId?: string;
}

export interface UpdateWorkItemDto {
  title?: string;
  type?: WorkItemType;
  status?: WorkItemStatus;
  priority?: WorkItemPriority;
  description?: string;
  estimate?: number;
  assigneeId?: string | null;
  sprintId?: string | null;
}

export interface AssignWorkItemDto {
  assigneeId: string;
}

export interface MoveToSprintDto {
  sprintId: string;
}

export interface UpdateStatusDto {
  status: WorkItemStatus;
}

export interface UpdatePriorityDto {
  priority: WorkItemPriority;
}

export interface ReorderWorkItemsDto {
  workItemIds: string[];
}

export interface WorkItemResponseDto {
  id: string;
  title: string;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  description?: string;
  estimate: number;
  order: number;
  assignee?: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  createdBy: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  project: {
    id: string;
    name: string;
    key: string;
  };
  sprint?: {
    id: string;
    name: string;
    status: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkItemStatsDto {
  totalWorkItems: number;
  workItemsByType: Record<WorkItemType, number>;
  workItemsByStatus: Record<WorkItemStatus, number>;
  workItemsByPriority: Record<WorkItemPriority, number>;
  totalEstimate: number;
  completedEstimate: number;
  averageEstimate: number;
  completionRate: number;
}
