/**
 * 表示可安全返回给客户端的业务错误。
 */
export class AppError extends Error {
  /**
   * @param status HTTP 状态码
   * @param code 稳定的业务错误码
   * @param message 面向用户的中文提示
   * @param details 可选的字段级错误信息
   */
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown = null,
  ) {
    super(message)
    this.name = 'AppError'
  }
}
