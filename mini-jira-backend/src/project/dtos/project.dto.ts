import * as Joi from 'joi';
import { ProjectType } from '../entities/project.entity';

// Validation Schemas
export const createProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Project name is required',
    'string.min': 'Project name must be at least 1 character',
    'string.max': 'Project name must not exceed 100 characters',
  }),
  key: Joi.string()
    .pattern(/^[A-Z]{2,10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Project key must be 2-10 uppercase letters',
      'string.empty': 'Project key is required',
    }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  type: Joi.string().valid('scrum', 'kanban').required().messages({
    'any.only': 'Project type must be either "scrum" or "kanban"',
    'any.required': 'Project type is required',
  }),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    'string.empty': 'Project name cannot be empty',
    'string.min': 'Project name must be at least 1 character',
    'string.max': 'Project name must not exceed 100 characters',
  }),
  key: Joi.string()
    .pattern(/^[A-Z]{2,10}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Project key must be 2-10 uppercase letters',
    }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  type: Joi.string().valid('scrum', 'kanban').optional().messages({
    'any.only': 'Project type must be either "scrum" or "kanban"',
  }),
});

export const addMemberSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.guid': 'User ID must be a valid UUID',
    'any.required': 'User ID is required',
  }),
});

// DTO Interfaces
export interface CreateProjectDto {
  name: string;
  key: string;
  description?: string;
  type: ProjectType;
}

export interface UpdateProjectDto {
  name?: string;
  key?: string;
  description?: string;
  type?: ProjectType;
}

export interface AddMemberDto {
  userId: string;
}

export interface ProjectResponseDto {
  id: string;
  name: string;
  key: string;
  description?: string;
  avatar?: string;
  type: ProjectType;
  owner: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  members: Array<{
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Validation helper functions
export const validateCreateProject = (data: unknown): CreateProjectDto => {
  const result = createProjectSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as CreateProjectDto;
};

export const validateUpdateProject = (data: unknown): UpdateProjectDto => {
  const result = updateProjectSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as UpdateProjectDto;
};

export const validateAddMember = (data: unknown): AddMemberDto => {
  const result = addMemberSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (result.error) {
    throw new Error(
      `Validation failed: ${result.error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return result.value as AddMemberDto;
};
