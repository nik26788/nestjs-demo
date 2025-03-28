import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as servetatic from 'serve-static';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);

  app.useGlobalFilters(new HttpExceptionFilter(loggerService));
  app.useGlobalInterceptors(new TransformInterceptor(loggerService));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 设置静态资源访问
  app.use('/static', servetatic(join(__dirname, '..', 'public')));

  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Admin API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
