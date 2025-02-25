import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { LoggingInterceptor } from './shared/logger/logging.interceptor';
import { HttpExceptionFilter } from './shared/logger/http-exception.filter';
import { CustomLoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  const logger = app.get(CustomLoggerService);

  // 启用应用关闭钩子
  app.enableShutdownHooks();
  // 设置API全局前缀
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 全局使用日志拦截器
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResolvePromisesInterceptor(),
  );

  // 全局使用异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // 全局使用管道
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

void bootstrap();
