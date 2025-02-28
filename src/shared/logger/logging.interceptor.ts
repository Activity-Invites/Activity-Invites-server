import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    // 记录请求信息
    this.logger.log(
      `Incoming Request: ${method} ${url}`,
      'LoggingInterceptor',
    );
    
    if (body && Object.keys(body).length > 0) {
      this.logger.debug(
        `Request Body: ${JSON.stringify(body)}`,
        'LoggingInterceptor',
      );
    }
    
    if (query && Object.keys(query).length > 0) {
      this.logger.debug(
        `Request Query: ${JSON.stringify(query)}`,
        'LoggingInterceptor',
      );
    }

    if (params && Object.keys(params).length > 0) {
      this.logger.debug(
        `Request Params: ${JSON.stringify(params)}`,
        'LoggingInterceptor',
      );
    }

    return next.handle().pipe(
      tap({
        next: (response) => {
          // 记录响应信息
          const responseTime = Date.now() - now;
          this.logger.log(
            `Response sent - ${method} ${url} - ${responseTime}ms`,
            'LoggingInterceptor',
          );
          this.logger.debug(
            `Response Body: ${JSON.stringify(response)}`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          // 记录错误信息
          const responseTime = Date.now() - now;
          this.logger.error(
            `Request Failed - ${method} ${url} - ${responseTime}ms`,
            error.stack,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }
}
