import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}
  async transform<T>(data: unknown): Promise<T> {
    try {
      Logger.debug(data);

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
      throw new BadRequestException('Bad request!');
    }
  }
}
