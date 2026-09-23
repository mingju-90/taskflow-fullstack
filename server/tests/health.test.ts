import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app'

describe('GET /api/v1/health', () => {
  it('返回服务健康状态', async () => {
    const response = await request(createApp()).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body.code).toBe('OK')
    expect(response.body.data).toEqual({ status: 'ok' })
  })
})
