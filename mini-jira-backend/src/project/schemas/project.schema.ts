import * as Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  key: Joi.string().required(),
  description: Joi.string().optional(),
  type: Joi.string().required(),
});
