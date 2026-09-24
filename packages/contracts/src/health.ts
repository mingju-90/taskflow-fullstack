import { z } from 'zod'
import { successResponseSchema } from './response.js'

/** 健康检查业务数据 schema，当前稳定状态只能是 ok。 */
export const healthDataSchema = z.object({
  status: z.literal('ok'),
})

/** 健康检查接口的统一成功响应 schema。 */
export const healthResponseSchema = successResponseSchema(healthDataSchema)

/** 健康检查接口返回的业务数据类型。 */
export type HealthData = z.infer<typeof healthDataSchema>

/** 健康检查接口返回的统一成功响应类型。 */
export type HealthResponse = z.infer<typeof healthResponseSchema>
