import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { createApp } from '../src/app'
import { AppError } from '../src/lib/app-error'
import { errorHandler } from '../src/middlewares/error-handler'
import { requestContext } from '../src/middlewares/request-context'
import { notFoundHandler } from '../src/middlewares/not-found'

// 用真实中间件构造测试应用，并插入生产代码中暂时不存在的错误路由。
const createErrorTestApp = () => {
  const app = express()

  app.use(requestContext)

  app.get('/app-error', () => {
    throw new AppError(409, 'MEMBER_ALREADY_EXISTS', '用户已在项目中', {
      userId: 'usr_1',
    })
  })

  app.get('/validation-error', () => {
    z.object({
      email: z.string().email('邮箱格式不正确'),
    }).parse({ email: 'invalid' })
  })

  app.get('/unknown-error', () => {
    throw new Error('内部数据库地址 /secret/database.db')
  })

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('统一错误处理', () => {
  it('将 AppError 转换为对应状态和业务码', async () => {
    const response = await request(createErrorTestApp()).get('/app-error')

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      code: 'MEMBER_ALREADY_EXISTS',
      message: '用户已在项目中',
      details: { userId: 'usr_1' },
      requestId: expect.any(String),
    })
  })

  it('将未匹配路由转换为 ROUTE_NOT_FOUND', async () => {
    const response = await request(createApp()).get('/api/v1/not-exists')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      code: 'ROUTE_NOT_FOUND',
      message: '接口不存在',
      details: null,
      requestId: expect.any(String),
    })
  })

  it('将 Zod 校验错误转换为字段级 details', async () => {
    const response = await request(createErrorTestApp()).get('/validation-error')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      code: 'VALIDATION_ERROR',
      message: '请求参数不合法',
      details: [{ path: ['email'], message: '邮箱格式不正确' }],
      requestId: expect.any(String),
    })
  })

  it('未知错误返回 INTERNAL_SERVER_ERROR 且不泄露堆栈', async () => {
    const response = await request(createErrorTestApp()).get('/unknown-error')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      code: 'INTERNAL_SERVER_ERROR',
      message: '服务器内部错误',
      details: null,
      requestId: expect.any(String),
    })
    expect(response.body).not.toHaveProperty('stack')
    expect(JSON.stringify(response.body)).not.toContain('内部数据库地址')
  })

  it('每次请求生成不同的 requestId', async () => {
    const app = createApp()
    const first = await request(app).get('/api/v1/health')
    const second = await request(app).get('/api/v1/health')

    expect(first.body.requestId).toEqual(expect.any(String))
    expect(first.body.requestId).not.toBe(second.body.requestId)
  })
})
