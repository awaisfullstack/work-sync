import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../types/api-response.types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isProduction = true;

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    let errorName = 'UnknownException';
    let errorStack: string | undefined = undefined;
    let originalErrorMessage: string | undefined = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (this.isExceptionResponseObject(exceptionResponse)) {
        message = exceptionResponse.message ?? message;
      }

      if (exception instanceof Error) {
        errorName = exception.name;
        errorStack = exception.stack;
        originalErrorMessage = exception.message;
      }
    } else if (exception instanceof Error) {
      errorName = exception.name;
      errorStack = exception.stack;
      originalErrorMessage = exception.message;

      // Show exact unknown error only in development
      if (!isProduction) {
        message = exception.message || 'Internal server error';
      }
    } else {
      originalErrorMessage = JSON.stringify(exception);

      if (!isProduction) {
        message = originalErrorMessage;
      }
    }

    this.logger.error(
      `${request.method} ${request.originalUrl} ${statusCode} - ${JSON.stringify(message)}`,
      errorStack,
    );

    const errorResponse = {
      success: false,
      statusCode,
      path: request.originalUrl,
      method: request.method,
      message,
      timestamp: new Date().toISOString(),

      ...(isProduction
        ? {}
        : {
            debug: {
              errorName,
              originalErrorMessage,
              stack: errorStack,
            },
          }),
    };

    response.status(statusCode).json(errorResponse);
  }

  private isExceptionResponseObject(value: unknown): value is ErrorResponse {
    return typeof value === 'object' && value !== null;
  }
}
