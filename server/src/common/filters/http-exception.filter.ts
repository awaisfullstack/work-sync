import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from 'src/types/api-response.types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('Exception class:', exception?.constructor?.name);
    console.log('Exception:', exception);

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (this.isErrorResponse(res)) {
        message = res.message ?? message;
      }
    }
    this.logger.error(
      `${request.method} ${request.url} ${statusCode} - ${JSON.stringify(message)}`,
    );

    response.status(statusCode).json({
      success: false,
      statusCode,
      path: request.url,
      method: request.method,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private isErrorResponse(res: unknown): res is ErrorResponse {
    return typeof res === 'object' && res !== null;
  }
}
