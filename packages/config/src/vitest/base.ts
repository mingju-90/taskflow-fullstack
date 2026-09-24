/**
 * 各 workspace 包共享的 Vitest 基础配置。
 *
 * 包环境只覆盖自身需要的 environment，不在这里绑定浏览器或 Node 环境。
 */
export const baseVitestConfig = {
  clearMocks: true,
  restoreMocks: true,
} as const
