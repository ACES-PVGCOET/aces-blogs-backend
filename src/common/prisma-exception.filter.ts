import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { Prisma } from '../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    let errorType = 'InternalServerError';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const targetMeta = exception.meta?.target;
        const target = Array.isArray(targetMeta)
          ? targetMeta.join(', ')
          : typeof targetMeta === 'string'
            ? targetMeta
            : 'field';
        message = `Unique constraint violation on ${target}`;
        errorType = 'Conflict';
        break;
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = (exception.meta?.cause as string) || 'Record not found';
        errorType = 'NotFound';
        break;
      }
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        const fieldName = (exception.meta?.field_name as string) || 'foreign key';
        message = `Foreign key constraint failed on ${fieldName}`;
        errorType = 'BadRequest';
        break;
      }
      case 'P2014': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Relation violation: The change would violate a required relationship';
        errorType = 'BadRequest';
        break;
      }
      default:
        this.logger.error(
          `Unhandled Prisma Error [${exception.code}]: ${exception.message}`,
          exception.stack,
        );
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: errorType,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
