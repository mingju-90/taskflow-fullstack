import { z } from 'zod'
import { apiErrorCodeSchema } from './error-codes.js'

/**
 * 创建统一成功响应 schema。
 *
 * @param dataSchema 接口业务数据的 Zod schema
 * @returns 包含 code、message、data 和 requestId 的响应 schema
 */
export function successResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    code: z.literal('OK'),
    message: z.string(),
    data: dataSchema,
    requestId: z.string().min(1),
  })
}

export const errorResponseSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string(),
  details: z.unknown().nullable(),
  requestId: z.string().min(1),
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>
