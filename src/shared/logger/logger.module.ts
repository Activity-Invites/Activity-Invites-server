import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { CustomLoggerService } from './logger.service';
import { winstonConfig } from '../../config/winston.config';
import { LoggingInterceptor } from './logging.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [CustomLoggerService, LoggingInterceptor, HttpExceptionFilter],
  exports: [CustomLoggerService, LoggingInterceptor, HttpExceptionFilter],
})
export class LoggerModule {}
