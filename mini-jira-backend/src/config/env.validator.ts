import * as Joi from 'joi';
import { EnvironmentEnum } from './enums/config.enum';

export const environmentValidator = Joi.object().keys({
  [EnvironmentEnum.NODE_ENV]: Joi.string().trim().required(),

  [EnvironmentEnum.TYPEORM_SYNCHRONIZE]: Joi.string().trim().required(),

  [EnvironmentEnum.TYPEORM_HOST]: Joi.string().trim().required(),
  [EnvironmentEnum.TYPEORM_PORT]: Joi.string().trim().required(),
  [EnvironmentEnum.TYPEORM_USERNAME]: Joi.string().trim().required(),
  [EnvironmentEnum.TYPEORM_PASSWORD]: Joi.string().trim().allow(''),
  [EnvironmentEnum.TYPEORM_DATABASE]: Joi.string().trim().required(),
  [EnvironmentEnum.TYPEORM_SSL]: Joi.string().trim().required(),

  [EnvironmentEnum.JWT_SECRET]: Joi.string().trim().required(),
});
