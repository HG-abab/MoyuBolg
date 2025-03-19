import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse<Response>(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    const exceptionResponse = exception.getResponse(); // 获取异常信息
    let validMessage = '';

    // for (const key in exception) {
    //   console.log(key, exception[key]);
    // }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as { message?: string | string[] };

      // 如果 message 是数组，返回所有错误信息
      if (Array.isArray(responseObj.message)) {
        validMessage = responseObj.message.join(','); // 将所有消息合并成一个字符串
      } else {
        validMessage = responseObj.message || ''; // 如果是单个消息，直接返回
      }
    }

    // 设置错误信息
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
  }
}
