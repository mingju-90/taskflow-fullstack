import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../lib/app-error.js'

/**
 * 处理未匹配的 API 路由，并交给统一错误中间件响应。
 *
 * @param _request 当前请求，保留参数以满足中间件签名
 * @param _response 当前响应，保留参数以满足中间件签名
 * @param next 继续执行错误中间件
 */
export function notFoundHandler(_request: Request, _response: Response, next: NextFunction) {
  next(new AppError(404, 'ROUTE_NOT_FOUND', '接口不存在'))
}
