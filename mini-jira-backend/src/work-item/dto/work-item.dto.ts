import * as Joi from 'joi';
import {
  WorkItemType,
  WorkItemStatus,
  WorkItemPriority,
} from '../entities/work-item.entity';

// Validation Schemas
export const createWorkItemSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Work item title is required',
    'string.min': 'Work item title must be at least 1 character',
    'string.max': 'Work item title must not exceed 200 characters',
  }),
  type: Joi.string().valid('story', 'task', 'bug', 'epic').required().messages({
    'any.only': 'Work item type must be "story", "task", "bug", or "epic"',
    'any.required': 'Work item type is required',
  }),
  priority: Joi.string()
    .valid('highest', 'high', 'medium', 'low', 'lowest')
    .required()
    .messages({
      'any.only':
        'Priority must be "highest", "high", "medium", "low", or "lowest"',
      'any.required': 'Priority is required',
    }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  estimate: Joi.number().integer().min(0).max(100).required().messages({
    'number.base': 'Estimate must be a number',
    'number.integer': 'Estimate must be an integer',
    'number.min': 'Estimate must be at least 0',
    'number.max': 'Estimate must not exceed 100',
    'any.required': 'Estimate is required',
  }),
  assigneeId: Joi.string().uuid().optional().messages({
    'string.guid': 'Assignee ID must be a valid UUID',
  }),
  sprintId: Joi.string().uuid().optional().messages({
    'string.guid': 'Sprint ID must be a valid UUID',
  }),
});

export const updateWorkItemSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    'string.empty': 'Work item title cannot be empty',
    'string.min': 'Work item title must be at least 1 character',
    'string.max': 'Work item title must not exceed 200 characters',
  }),
  type: Joi.string().valid('story', 'task', 'bug', 'epic').optional().messages({
    'any.only': 'Work item type must be "story", "task", "bug", or "epic"',
  }),
  status: Joi.string()
    .valid('todo', 'in-progress', 'done')
    .optional()
    .messages({
      'any.only': 'Status must be "todo", "in-progress", or "done"',
    }),
  priority: Joi.string()
    .valid('highest', 'high', 'medium', 'low', 'lowest')
    .optional()
    .messages({
      'any.only':
        'Priority must be "highest", "high", "medium", "low", or "lowest"',
    }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  estimate: Joi.number().integer().min(0).max(100).optional().messages({
    'number.base': 'Estimate must be a number',
    'number.integer': 'Estimate must be an integer',
    'number.min': 'Estimate must be at least 0',
    'number.max': 'Estimate must not exceed 100',
  }),
  assigneeId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Assignee ID must be a valid UUID',
  }),
  sprintId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Sprint ID must be a valid UUID',
  }),
});

export const assignWorkItemSchema = Joi.object({
  assigneeId: Joi.string().uuid().required().messages({
    'string.guid': 'Assignee ID must be a valid UUID',
    'any.required': 'Assignee ID is required',
  }),
});

export const moveToSprintSchema = Joi.object({
  sprintId: Joi.string().uuid().required().messages({
    'string.guid': 'Sprint ID must be a valid UUID',
    'any.required': 'Sprint ID is required',
  }),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('todo', 'in-progress', 'done')
    .required()
    .messages({
      'any.only': 'Status must be "todo", "in-progress", or "done"',
      'any.required': 'Status is required',
    }),
});

export const updatePrioritySchema = Joi.object({
  priority: Joi.string()
    .valid('highest', 'high', 'medium', 'low', 'lowest')
    .required()
    .messages({
      'any.only':
        'Priority must be "highest", "high", "medium", "low", or "lowest"',
      'any.required': 'Priority is required',
    }),
});

export const reorderWorkItemsSchema = Joi.object({
  workItemIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .required()
    .messages({
      'array.base': 'Work item IDs must be an array',
      'array.min': 'At least one work item ID is required',
      'string.guid': 'Each work item ID must be a valid UUID',
      'any.required': 'Work item IDs are required',
    }),
});

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

// Validation helper functions
export const validateCreateWorkItem = (data: unknown): CreateWorkItemDto => {
  const result = createWorkItemSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as CreateWorkItemDto;
};

export const validateUpdateWorkItem = (data: unknown): UpdateWorkItemDto => {
  const result = updateWorkItemSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as UpdateWorkItemDto;
};

export const validateAssignWorkItem = (data: unknown): AssignWorkItemDto => {
  const result = assignWorkItemSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as AssignWorkItemDto;
};

export const validateMoveToSprint = (data: unknown): MoveToSprintDto => {
  const result = moveToSprintSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as MoveToSprintDto;
};

export const validateUpdateStatus = (data: unknown): UpdateStatusDto => {
  const result = updateStatusSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as UpdateStatusDto;
};

export const validateUpdatePriority = (data: unknown): UpdatePriorityDto => {
  const result = updatePrioritySchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as UpdatePriorityDto;
};

export const validateReorderWorkItems = (
  data: unknown,
): ReorderWorkItemsDto => {
  const result = reorderWorkItemsSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as ReorderWorkItemsDto;
};
