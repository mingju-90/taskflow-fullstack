import { z } from 'zod'
import { apiErrorCodeSchema } from './error-codes.js'

/** 统一成功响应结构，供服务端序列化和调用方类型约束复用。 */
export type SuccessResponse<T> = {
  code: 'OK'
  message: string
  data: T
  requestId: string
}

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

/**
 * 统一错误响应 schema。
 *
 * 错误码只能使用稳定错误码集合，details 允许为 null 或字段级错误信息。
 */
export const errorResponseSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string(),
  details: z.unknown().nullable(),
  requestId: z.string().min(1),
})

/** 统一错误响应的 TypeScript 类型。 */
export type ErrorResponse = z.infer<typeof errorResponseSchema>
