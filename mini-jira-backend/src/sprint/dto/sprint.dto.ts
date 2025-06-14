import * as Joi from 'joi';
import { SprintStatus } from '../entities/sprint.entity';

// Validation Schemas
export const createSprintSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Sprint name is required',
    'string.min': 'Sprint name must be at least 1 character',
    'string.max': 'Sprint name must not exceed 100 characters',
  }),
  goal: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Sprint goal must not exceed 500 characters',
  }),
  startDate: Joi.date().optional().messages({
    'date.base': 'Start date must be a valid date',
  }),
  endDate: Joi.date().optional().greater(Joi.ref('startDate')).messages({
    'date.base': 'End date must be a valid date',
    'date.greater': 'End date must be after start date',
  }),
});

export const updateSprintSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    'string.empty': 'Sprint name cannot be empty',
    'string.min': 'Sprint name must be at least 1 character',
    'string.max': 'Sprint name must not exceed 100 characters',
  }),
  goal: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Sprint goal must not exceed 500 characters',
  }),
  startDate: Joi.date().optional().messages({
    'date.base': 'Start date must be a valid date',
  }),
  endDate: Joi.date().optional().messages({
    'date.base': 'End date must be a valid date',
  }),
  status: Joi.string()
    .valid('planned', 'active', 'completed')
    .optional()
    .messages({
      'any.only': 'Sprint status must be "planned", "active", or "completed"',
    }),
});

export const addWorkItemToSprintSchema = Joi.object({
  workItemId: Joi.string().uuid().required().messages({
    'string.guid': 'Work item ID must be a valid UUID',
    'any.required': 'Work item ID is required',
  }),
});

// DTO Interfaces
export interface CreateSprintDto {
  name: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateSprintDto {
  name?: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
  status?: SprintStatus;
}

export interface AddWorkItemToSprintDto {
  workItemId: string;
}

export interface SprintResponseDto {
  id: string;
  name: string;
  status: SprintStatus;
  startDate?: Date;
  endDate?: Date;
  goal?: string;
  project: {
    id: string;
    name: string;
    key: string;
  };
  workItems: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    estimate: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SprintStatsDto {
  totalWorkItems: number;
  completedWorkItems: number;
  inProgressWorkItems: number;
  todoWorkItems: number;
  totalEstimate: number;
  completedEstimate: number;
  completionPercentage: number;
  daysRemaining?: number;
  isOverdue: boolean;
}

// Validation helper functions
export const validateCreateSprint = (data: unknown): CreateSprintDto => {
  const result = createSprintSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as CreateSprintDto;
};

export const validateUpdateSprint = (data: unknown): UpdateSprintDto => {
  const result = updateSprintSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as UpdateSprintDto;
};

export const validateAddWorkItemToSprint = (
  data: unknown,
): AddWorkItemToSprintDto => {
  const result = addWorkItemToSprintSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as AddWorkItemToSprintDto;
};
