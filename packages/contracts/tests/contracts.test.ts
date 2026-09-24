import { describe, expect, it } from 'vitest'
import { errorResponseSchema, healthResponseSchema } from '../src/index.js'

describe('TaskFlow API 契约', () => {
  it('接受健康检查成功响应', () => {
    const result = healthResponseSchema.safeParse({
      code: 'OK',
      message: 'success',
      data: { status: 'ok' },
      requestId: 'request-1',
    })

    expect(result.success).toBe(true)
  })

  it('拒绝未知健康状态', () => {
    const result = healthResponseSchema.safeParse({
      code: 'OK',
      message: 'success',
      data: { status: 'unknown' },
      requestId: 'request-1',
    })

    expect(result.success).toBe(false)
  })

  it('接受稳定错误码和空 details', () => {
    const result = errorResponseSchema.safeParse({
      code: 'ROUTE_NOT_FOUND',
      message: '接口不存在',
      details: null,
      requestId: 'request-1',
    })

    expect(result.success).toBe(true)
  })
})
