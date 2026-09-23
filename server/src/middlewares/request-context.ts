import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

/**
 * 为每个请求生成唯一 requestId，并写入响应本地上下文。
 *
 * @param _request 当前请求，保留参数以满足中间件签名
 * @param response 当前响应上下文
 * @param next 继续执行后续中间件
 */
export function requestContext(_request: Request, response: Response, next: NextFunction) {
  response.locals.requestId = randomUUID()
  next()
}
