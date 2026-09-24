import { z } from 'zod'

/**
 * TaskFlow API 支持的稳定错误码集合。
 *
 * 新增错误码时必须同步接口文档和契约测试，避免前后端错误处理语义漂移。
 */
export const apiErrorCodes = [
  'ASSIGNEE_NOT_PROJECT_MEMBER',
  'ATTACHMENT_DELETE_FORBIDDEN',
  'ATTACHMENT_LIMIT_REACHED',
  'ATTACHMENT_NOT_FOUND',
  'COMMENT_DELETE_FORBIDDEN',
  'COMMENT_NOT_FOUND',
  'EMAIL_ALREADY_EXISTS',
  'FILE_TOO_LARGE',
  'FILE_TYPE_NOT_ALLOWED',
  'FORBIDDEN',
  'INTERNAL_SERVER_ERROR',
  'INVALID_CREDENTIALS',
  'MEMBER_ALREADY_EXISTS',
  'OWNER_CANNOT_BE_REMOVED',
  'PROJECT_MEMBER_REQUIRED',
  'PROJECT_NOT_FOUND',
  'PROJECT_OWNER_REQUIRED',
  'RATE_LIMITED',
  'ROUTE_NOT_FOUND',
  'TASK_DELETE_FORBIDDEN',
  'TASK_NOT_FOUND',
  'TOKEN_EXPIRED',
  'UNAUTHORIZED',
  'USERNAME_ALREADY_EXISTS',
  'VALIDATION_ERROR',
] as const

/** 校验响应错误码是否属于稳定错误码集合。 */
export const apiErrorCodeSchema = z.enum(apiErrorCodes)

/** TaskFlow API 统一使用的稳定错误码联合类型。 */
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>
