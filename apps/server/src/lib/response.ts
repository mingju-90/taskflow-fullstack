import type { SuccessResponse } from '@taskflow/contracts'
import type { Response } from 'express'

/**
 * 返回统一成功响应。
 *
 * @typeParam T 业务数据类型
 * @param response Express 响应对象
 * @param data 接口业务数据
 * @param message 面向用户的成功提示
 * @returns 已发送的 JSON 响应
 */
export function sendSuccess<T>(response: Response, data: T, message = 'success') {
  const body: SuccessResponse<T> = {
    code: 'OK',
    message,
    data,
    requestId: response.locals.requestId,
  }

  return response.status(200).json(body)
}
