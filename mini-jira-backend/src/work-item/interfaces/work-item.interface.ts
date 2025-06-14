import {
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType,
} from '../enums/work-item.enum';

export interface CreateWorkItemData {
  title: string;
  description?: string;
  type?: WorkItemType;
  priority?: WorkItemPriority;
  storyPoints?: number;
  projectId: string;
  assigneeId?: string;
  sprintId?: string;
}

export interface UpdateWorkItemData {
  title?: string;
  description?: string;
  type?: WorkItemType;
  status?: WorkItemStatus;
  priority?: WorkItemPriority;
  storyPoints?: number;
  assigneeId?: string;
  sprintId?: string;
}
