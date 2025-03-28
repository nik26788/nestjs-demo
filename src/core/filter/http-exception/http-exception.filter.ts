/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('====HttpExceptionFilter====');
    console.log(exception);
    const ctx = host.switchToHttp(); // 获取请求上下文
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    const exceptionResponse: any = exception.getResponse();
    let validMessage = '';

    if (typeof exceptionResponse === 'object') {
      validMessage =
        typeof exceptionResponse.message === 'string'
          ? exceptionResponse.message
          : exceptionResponse.message[0];
    }
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const errorResponse = {
      data: {},
      message: validMessage || message,
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);

    const request = ctx.getRequest(); // 获取请求上下文中的 request 对象

    // 获取请求的更多信息
    const { method, url, params, query, body, headers } = request;
    // 记录请求信息
    this.logger.log('Request Info:', {
      url,
      method,
      headers,
      body,
      query,
      params,
    });

    // 记录请求的响应时间和状态
    this.logger.log('Response Info:', {
      url,
      method,
      statusCode: status,
      msg: validMessage || message,
      ...errorResponse,
    });
  }
}
