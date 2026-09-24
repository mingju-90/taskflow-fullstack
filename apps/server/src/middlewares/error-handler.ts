import type { ApiErrorCode, ErrorResponse } from '@taskflow/contracts'
import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../lib/app-error.js'

function sendError(
  response: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  details: unknown,
) {
  const body: ErrorResponse = {
    code,
    message,
    details,
    requestId: response.locals.requestId,
  }

  response.status(status).json(body)
}

/**
 * 将业务错误、校验错误和未知异常转换为统一 API 响应。
 *
 * @param error Express 捕获到的异常
 * @param _request 当前请求，保留参数以满足错误中间件签名
 * @param response 当前响应
 * @param next 响应头已发送时交还给 Express 默认错误处理
 */
export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (response.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    sendError(response, error.status, error.code, error.message, error.details)
    return
  }

  if (error instanceof ZodError) {
    sendError(
      response,
      400,
      'VALIDATION_ERROR',
      '请求参数不合法',
      error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    )
    return
  }

  // 未知异常只记录服务端堆栈，响应体不暴露内部实现细节。
  console.error(`[${response.locals.requestId}] 未处理异常`, error)

  sendError(response, 500, 'INTERNAL_SERVER_ERROR', '服务器内部错误', null)
}
