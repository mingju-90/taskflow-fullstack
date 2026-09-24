// 扩展 Express 响应本地上下文，统一暴露 requestContext 生成的请求标识。
declare global {
  namespace Express {
    interface Locals {
      requestId: string
    }
  }
}

export {}
