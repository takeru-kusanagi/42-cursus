import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GoogleCallbackExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isGoogleCallback =
      request.url?.includes('/auth/google/callback') ?? false;

    if (!isGoogleCallback) {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        exception instanceof HttpException
          ? (exception.getResponse() as { message?: string }).message ?? exception.message
          : 'Internal server error';
      response.status(status).json({ message });
      return;
    }

    const message =
      exception instanceof HttpException
        ? ((exception.getResponse() as { message?: string | string[] }).message ??
          exception.message)
        : 'Authentication failed';
    const msg = Array.isArray(message) ? message[0] : String(message);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/login?error=${encodeURIComponent(msg)}`;
    response.redirect(redirectUrl);
  }
}
