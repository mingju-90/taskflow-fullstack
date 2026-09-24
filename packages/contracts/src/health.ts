import { z } from 'zod'
import { successResponseSchema } from './response.js'

export const healthDataSchema = z.object({
  status: z.literal('ok'),
})

export const healthResponseSchema = successResponseSchema(healthDataSchema)

export type HealthData = z.infer<typeof healthDataSchema>
export type HealthResponse = z.infer<typeof healthResponseSchema>
