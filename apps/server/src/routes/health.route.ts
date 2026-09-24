import { healthDataSchema } from '@taskflow/contracts'
import { Router } from 'express'
import { sendSuccess } from '../lib/response.js'

/**
 * 健康检查路由，用于确认服务进程和 HTTP 入口可用。
 */
export const healthRouter = Router()

healthRouter.get('/health', (_request, response) => {
  // 通过共享 schema 校验响应，防止健康检查契约在前后端之间漂移。
  const healthData = healthDataSchema.parse({ status: 'ok' })

  sendSuccess(response, healthData)
})
