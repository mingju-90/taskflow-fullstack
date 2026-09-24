import { Router } from 'express'
import { sendSuccess } from '../lib/response'

/**
 * 健康检查路由，用于确认服务进程和 HTTP 入口可用。
 */
export const healthRouter = Router()

healthRouter.get('/health', (_request, response) => {
  sendSuccess(response, { status: 'ok' })
})
