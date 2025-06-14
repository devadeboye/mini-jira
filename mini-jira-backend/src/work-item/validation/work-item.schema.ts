import * as Joi from 'joi';
import {
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType,
} from '../enums/work-item.enum';

export const createWorkItemSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  type: Joi.string()
    .valid(...Object.values(WorkItemType))
    .optional()
    .default(WorkItemType.TASK),
  priority: Joi.string()
    .valid(...Object.values(WorkItemPriority))
    .optional()
    .default(WorkItemPriority.MEDIUM),
  storyPoints: Joi.number().optional().default(0),
  projectId: Joi.string().uuid().required(),
  assigneeId: Joi.string().uuid().optional(),
  sprintId: Joi.string().uuid().optional(),
});

export const updateWorkItemSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  type: Joi.string()
    .valid(...Object.values(WorkItemType))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(WorkItemStatus))
    .optional(),
  priority: Joi.string()
    .valid(...Object.values(WorkItemPriority))
    .optional(),
  storyPoints: Joi.number().optional().default(0),
  assigneeId: Joi.string().uuid().optional().allow(null),
  sprintId: Joi.string().uuid().optional().allow(null),
});
