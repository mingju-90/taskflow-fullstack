import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import { errorHandler } from './middlewares/error-handler'
import { notFoundHandler } from './middlewares/not-found'
import { requestContext } from './middlewares/request-context'
import { healthRouter } from './routes/health.route'

/**
 * 创建并配置 TaskFlow 后端 Express 应用。
 *
 * @returns 已完成中间件、API 路由和错误处理注册的 Express 应用
 */
export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.CLIENT_ORIGIN }))
  app.use(express.json({ limit: '1mb' }))

  app.use(requestContext)
  app.use('/api/v1', healthRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
