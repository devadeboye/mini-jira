import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ObjectSchema, ValidationResult } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(JoiValidationPipe.name);

  constructor(private schema: ObjectSchema) {}

  transform(value: unknown): unknown {
    this.logger.debug('Validating value:', JSON.stringify(value));

    if (value === undefined) {
      this.logger.error('Validation failed: Request body is undefined');
      throw new BadRequestException('Request body is required');
    }

    const result: ValidationResult = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      const errorMessages = result.error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      this.logger.error('Validation failed:', JSON.stringify(errorMessages));
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    this.logger.debug('Validation successful:', JSON.stringify(result.value));
    return result.value;
  }
}

@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}
  async transform<T>(data: unknown): Promise<T> {
    try {
      if (data === undefined) {
        throw new BadRequestException('Request body is required');
      }

      const value = (await this.schema
        .unknown(false)
        .validateAsync(data, { stripUnknown: true })) as T;
      return value;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
