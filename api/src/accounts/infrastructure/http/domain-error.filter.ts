import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../domain/account-errors';

const STATUS: Record<string, number> = {
  INVALID_CODE: 400, INVALID_LENGTH: 400, NATURE_REQUIRED: 400, EMPTY_NAME: 400,
  PARENT_NOT_FOUND: 422, DUPLICATE_CODE: 409, HAS_CHILDREN: 409, ACCOUNT_NOT_FOUND: 404,
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    host.switchToHttp().getResponse<Response>()
      .status(STATUS[error.code] ?? 400)
      .json({ code: error.code, message: error.message, field: error.field ?? null });
  }
}