# TaskFlow Monorepo 工程升级实施计划

> **给执行者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务逐步实施。所有步骤使用复选框跟踪。

**目标：** 将 TaskFlow 迁移为 pnpm workspace 与 Turborepo 单仓库，在不改变现有业务行为的前提下补齐共享配置、接口契约、统一命令和最小 CI。

**架构：** 前端和后端移动到 `apps/*`，共享工具配置与 Zod 契约放入 `packages/*`。Turborepo 负责构建、测试、类型检查、lint 和开发任务，根目录维护唯一锁文件。

**技术栈：** Node.js 22、pnpm 10.17.0、Turborepo、Vue 3、Vite、Express 5、TypeScript、Prisma、SQLite、Zod、ESLint、Vitest、Supertest、Prettier、GitHub Actions。

**规格：** `docs/superpowers/specs/2026-09-24-monorepo-engineering-upgrade-design.md`

## 全局约束

- 所有说明、代码注释、测试描述、文档和提交信息使用中文。
- Node.js 固定为 22.x，pnpm 固定为 `10.17.0`。
- 依赖安装和更新只使用 pnpm，不运行 npm 或 Yarn 安装命令。
- 根目录只保留一份 `pnpm-lock.yaml`。
- 不修改 Prisma schema、SQLite 数据库、API 路径、响应字段和状态码。
- 不迁移 Express、Prisma 和 SQLite。
- 不安装 Playwright。
- 新增导出函数、公共类型和复杂业务逻辑必须补中文 JSDoc 或业务注释。
- 提交前执行 `npm run format`、`npm run commit:check`，并阅读完整暂存差异。
- 每个提交只处理一个清晰目标，提交摘要使用英文类型前缀加中文说明。

## 文件结构

```text
apps/client/
  src/                         Vue 页面和入口
  tests/                       前端组件测试
  eslint.config.mjs            前端 ESLint 入口
  package.json                 @taskflow/client
  vite.config.ts               Vite 与 Vitest 配置

apps/server/
  src/                         Express API
  tests/                       API 集成测试
  eslint.config.mjs            后端 ESLint 入口
  package.json                 @taskflow/server
  tsconfig.json                后端类型检查配置

packages/config/
  src/eslint/                  共享 ESLint 规则
  src/vitest/base.ts           共享 Vitest 配置
  tsconfig/base.json           共享 TypeScript 配置
  package.json                 @taskflow/config

packages/contracts/
  src/error-codes.ts           稳定错误码
  src/response.ts              统一响应 schema
  src/health.ts                健康检查 schema
  src/index.ts                 契约公共出口
  tests/contracts.test.ts      契约测试
  package.json                 @taskflow/contracts

scripts/
  clean.mjs                    清理构建与缓存
  dev.mjs                      开发前检查和 Turborepo 启动
  validate-staged.mjs          暂存区检查

.github/workflows/ci.yml       CI 质量门禁
pnpm-workspace.yaml            workspace 定义
turbo.json                     任务图和缓存规则
```

---

### 任务 1：迁移应用目录并建立 workspace

**文件：**

- 移动：`client/` -> `apps/client/`
- 移动：`server/` -> `apps/server/`
- 创建：`pnpm-workspace.yaml`
- 创建：`.nvmrc`
- 创建：`.npmrc`
- 修改：`package.json`
- 修改：`scripts/dev.mjs`
- 修改：`.gitignore`
- 修改：`.prettierignore`
- 删除：`package-lock.json`
- 删除：`apps/client/package-lock.json`
- 删除：`apps/client/pnpm-lock.yaml`
- 删除：`apps/server/pnpm-lock.yaml`

**接口：**

- 产出：workspace 包 `@taskflow/client`、`@taskflow/server`
- 产出：根目录唯一 `pnpm-lock.yaml`
- 后续任务依赖：统一包名、`apps/*` 路径和 Node.js 22 基线

- [ ] **步骤 1：创建应用目录并移动现有项目**

运行：

```bash
mkdir -p apps
git mv client apps/client
git mv server apps/server
```

预期：Git 识别为文件重命名，工作区中不存在根级 `client` 和 `server` 目录。

- [ ] **步骤 2：创建 workspace、Node 和 pnpm 约束文件**

创建 `pnpm-workspace.yaml`：

```yaml
packages:
  - apps/*
  - packages/*
```

创建 `.nvmrc`：

```text
22.22.3
```

创建 `.npmrc`：

```ini
engine-strict=true
link-workspace-packages=true
prefer-workspace-packages=true
```

- [ ] **步骤 3：更新根 `package.json`**

将根 `package.json` 调整为：

```json
{
  "name": "taskflow-fullstack",
  "version": "0.0.0",
  "private": true,
  "description": "TaskFlow full-stack learning project",
  "engines": {
    "node": ">=22.0.0 <23.0.0",
    "pnpm": "10.17.0"
  },
  "packageManager": "pnpm@10.17.0",
  "scripts": {
    "prepare": "node scripts/setup-git-hooks.mjs",
    "dev": "node scripts/dev.mjs",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "commit:check": "node scripts/validate-staged.mjs",
    "commit:message": "node scripts/validate-commit-message.mjs"
  },
  "devDependencies": {
    "cspell": "^8.19.4",
    "prettier": "^3.9.9"
  }
}
```

- [ ] **步骤 4：更新包名和目录引用**

将 `apps/client/package.json` 的 `name` 改为：

```json
"name": "@taskflow/client"
```

将 `apps/server/package.json` 的 `name` 改为：

```json
"name": "@taskflow/server"
```

修改 `scripts/dev.mjs` 中的路径：

```js
const serverEnvPath = path.join(rootDir, 'apps', 'server', '.env')
```

将两个子进程的工作目录分别改为：

```js
cwd: path.join(rootDir, 'apps', 'client')
```

```js
cwd: path.join(rootDir, 'apps', 'server')
```

将 `.gitignore` 和 `.prettierignore` 中的 `server/uploads/` 改为：

```text
apps/server/uploads/
```

将两个文件中的 `server/prisma/*.db` 改为：

```text
apps/server/prisma/*.db
```

在 `.gitignore` 和 `.prettierignore` 中增加：

```text
.turbo/
```

保留已有的通用 `node_modules/`、`dist/`、`coverage/`、`.env` 和 `*.db` 规则。

- [ ] **步骤 5：移除旧锁文件**

运行：

```bash
git rm package-lock.json apps/client/package-lock.json apps/client/pnpm-lock.yaml apps/server/pnpm-lock.yaml
```

预期：仓库只剩根目录待生成的 `pnpm-lock.yaml`。

- [ ] **步骤 6：使用 Node.js 22 和 pnpm 10.17.0 重新安装依赖**

运行：

```bash
corepack enable --install-directory "$HOME/.nvm/versions/node/v22.22.3/bin"
corepack install --global pnpm@10.17.0
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm -v
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm install
```

预期：

- `pnpm -v` 输出 `10.17.0`。
- 安装成功。
- 根目录生成包含 `apps/client` 和 `apps/server` importers 的 `pnpm-lock.yaml`。
- 不生成新的 npm 或子包锁文件。

- [ ] **步骤 7：验证 workspace 和现有测试**

运行：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm -r list --depth -1
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/client test:run
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/server exec vitest run
```

预期：

- pnpm 识别 `@taskflow/client` 和 `@taskflow/server`。
- 前端应用外壳测试通过。
- 后端健康检查和错误处理测试通过。

- [ ] **步骤 8：检查并提交**

运行：

```bash
npm run format
git add .
npm run commit:check
git diff --cached
```

阅读完整暂存差异并确认路径、锁文件和包名正确后提交：

```bash
git commit -m "refactor: 迁移应用目录到 pnpm workspace" -m "- 移动前端和后端到 apps 目录
- 建立唯一 workspace 和锁文件
- 固定 Node.js 22 与 pnpm 10.17.0"
```

---

### 任务 2：建立共享配置、接口契约和静态检查

**文件：**

- 创建：`packages/config/package.json`
- 创建：`packages/config/tsconfig.json`
- 创建：`packages/config/tsconfig/base.json`
- 创建：`packages/config/src/eslint/base.mjs`
- 创建：`packages/config/src/eslint/node.mjs`
- 创建：`packages/config/src/eslint/vue.mjs`
- 创建：`packages/config/src/vitest/base.ts`
- 创建：`packages/config/eslint.config.mjs`
- 创建：`packages/contracts/package.json`
- 创建：`packages/contracts/tsconfig.json`
- 创建：`packages/contracts/tsconfig.build.json`
- 创建：`packages/contracts/vitest.config.ts`
- 创建：`packages/contracts/src/error-codes.ts`
- 创建：`packages/contracts/src/response.ts`
- 创建：`packages/contracts/src/health.ts`
- 创建：`packages/contracts/src/index.ts`
- 创建：`packages/contracts/tests/contracts.test.ts`
- 创建：`eslint.config.mjs`
- 修改：`apps/client/package.json`
- 修改：`apps/server/package.json`
- 修改：`apps/client/vite.config.ts`
- 修改：`apps/server/vitest.config.mts`
- 修改：`apps/server/tsconfig.json`
- 修改：`apps/server/src/lib/app-error.ts`
- 修改：`apps/server/src/middlewares/error-handler.ts`
- 修改：`apps/server/src/routes/health.route.ts`

**接口：**

- 消耗：任务 1 的 workspace 和 `apps/*` 结构
- 产出：`@taskflow/config/eslint/base`、`@taskflow/config/eslint/node`、`@taskflow/config/eslint/vue`
- 产出：`@taskflow/config/tsconfig/base.json`
- 产出：`@taskflow/config/vitest/base` 中的 `baseVitestConfig`
- 产出：`@taskflow/contracts` 中的 `apiErrorCodeSchema`、`ApiErrorCode`、`successResponseSchema`、`errorResponseSchema`、`healthDataSchema`、`healthResponseSchema`

- [ ] **步骤 1：先写契约失败测试**

创建 `packages/contracts/tests/contracts.test.ts`：

```ts
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
```

- [ ] **步骤 2：创建契约包基础配置并确认测试失败**

创建 `packages/contracts/package.json`：

```json
{
  "name": "@taskflow/contracts",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "dev": "tsc -p tsconfig.build.json --watch --preserveWatchOutput",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  }
}
```

创建 `packages/contracts/tsconfig.json`：

```json
{
  "extends": "@taskflow/config/tsconfig/base.json",
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "Node16",
    "noEmit": true,
    "rootDir": "."
  },
  "include": ["src", "tests", "vitest.config.ts"]
}
```

创建 `packages/contracts/tsconfig.build.json`：

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "noEmit": false,
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["tests", "**/*.test.ts"]
}
```

安装临时依赖后运行契约测试：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/contracts add zod
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/contracts add -D typescript vitest
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/contracts test
```

预期：失败，错误指出无法解析 `../src/index.js`，而不是缺少 Vitest 或 TypeScript。

- [ ] **步骤 3：实现共享工具配置包**

创建 `packages/config/package.json`：

```json
{
  "name": "@taskflow/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./eslint/base": "./src/eslint/base.mjs",
    "./eslint/node": "./src/eslint/node.mjs",
    "./eslint/vue": "./src/eslint/vue.mjs",
    "./tsconfig/base.json": "./tsconfig/base.json",
    "./vitest/base": "./src/vitest/base.ts"
  },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

创建 `packages/config/tsconfig/base.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

创建 `packages/config/tsconfig.json`：

```json
{
  "extends": "./tsconfig/base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

创建 `packages/config/src/vitest/base.ts`：

```ts
/**
 * 各 workspace 包共享的 Vitest 基础配置。
 *
 * 包环境只覆盖自身需要的 environment，不在这里绑定浏览器或 Node 环境。
 */
export const baseVitestConfig = {
  clearMocks: true,
  restoreMocks: true,
} as const
```

创建 `packages/config/src/eslint/base.mjs`：

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export const baseConfig = [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
]
```

创建 `packages/config/src/eslint/node.mjs`：

```js
import globals from 'globals'

export const nodeConfig = {
  files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
}
```

创建 `packages/config/src/eslint/vue.mjs`：

```js
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export const vueConfig = [
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },
]
```

创建 `packages/config/eslint.config.mjs`：

```js
import { baseConfig } from './src/eslint/base.mjs'
import { nodeConfig } from './src/eslint/node.mjs'

export default [...baseConfig, nodeConfig]
```

安装共享配置包依赖：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/config add @eslint/js globals eslint-plugin-vue typescript-eslint
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/config add -D eslint typescript
```

创建 `packages/contracts/vitest.config.ts`：

```ts
import { baseVitestConfig } from '@taskflow/config/vitest/base'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    ...baseVitestConfig,
    environment: 'node',
  },
})
```

让契约包引用共享配置：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/contracts add -D @taskflow/config@workspace:* eslint
```

- [ ] **步骤 4：实现契约公共出口和业务 schema**

创建 `packages/contracts/src/error-codes.ts`：

```ts
import { z } from 'zod'

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

export const apiErrorCodeSchema = z.enum(apiErrorCodes)

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>
```

创建 `packages/contracts/src/response.ts`：

```ts
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
```

创建 `packages/contracts/src/health.ts`：

```ts
import { z } from 'zod'
import { successResponseSchema } from './response.js'

export const healthDataSchema = z.object({
  status: z.literal('ok'),
})

export const healthResponseSchema = successResponseSchema(healthDataSchema)

export type HealthData = z.infer<typeof healthDataSchema>
export type HealthResponse = z.infer<typeof healthResponseSchema>
```

创建 `packages/contracts/src/index.ts`：

```ts
export { apiErrorCodeSchema, apiErrorCodes, type ApiErrorCode } from './error-codes.js'
export { errorResponseSchema, successResponseSchema, type ErrorResponse } from './response.js'
export {
  healthDataSchema,
  healthResponseSchema,
  type HealthData,
  type HealthResponse,
} from './health.js'
```

- [ ] **步骤 5：运行契约测试并确认通过**

运行：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/contracts test
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/contracts build
```

预期：三个契约测试通过，`packages/contracts/dist/index.js` 和声明文件生成。

- [ ] **步骤 6：让后端实际使用共享契约**

将 `apps/server/src/lib/app-error.ts` 调整为：

```ts
import type { ApiErrorCode } from '@taskflow/contracts'

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
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details: unknown = null,
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

将 `apps/server/src/middlewares/error-handler.ts` 的导入和 `sendError` 签名调整为：

```ts
import type { ApiErrorCode } from '@taskflow/contracts'
import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../lib/app-error'

function sendError(
  response: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  details: unknown,
) {
  response.status(status).json({
    code,
    message,
    details,
    requestId: response.locals.requestId,
  })
}
```

其余错误分支和响应内容保持原样。

将 `apps/server/src/routes/health.route.ts` 调整为：

```ts
import { healthDataSchema } from '@taskflow/contracts'
import { Router } from 'express'
import { sendSuccess } from '../lib/response'

/**
 * 健康检查路由，用于确认服务进程和 HTTP 入口可用。
 */
export const healthRouter = Router()

healthRouter.get('/health', (_request, response) => {
  // 通过共享 schema 校验响应，防止健康检查契约在前后端之间漂移。
  const healthData = healthDataSchema.parse({ status: 'ok' })

  sendSuccess(response, healthData)
})
```

保持 `apps/server/src/lib/response.ts` 的现有响应字段不变。它的输出继续满足 `@taskflow/contracts` 中的成功响应契约。

- [ ] **步骤 7：接入共享 TypeScript、Vitest 和 ESLint 配置**

将 `apps/client/tsconfig.app.json`、`apps/client/tsconfig.node.json` 和 `apps/server/tsconfig.json` 增加：

```json
"extends": "@taskflow/config/tsconfig/base.json"
```

保留各包现有的 `module`、`moduleResolution`、`lib`、`types`、`rootDir` 和 `include` 设置。

将 `apps/client/vite.config.ts` 的测试配置改为：

```ts
import vue from '@vitejs/plugin-vue'
import { baseVitestConfig } from '@taskflow/config/vitest/base'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
  },
  test: {
    ...baseVitestConfig,
    environment: 'jsdom',
    globals: true,
  },
})
```

将 `apps/server/vitest.config.mts` 调整为：

```ts
import { baseVitestConfig } from '@taskflow/config/vitest/base'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    ...baseVitestConfig,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'test-secret-with-at-least-16-characters',
      UPLOAD_DIR: './uploads/test',
      CLIENT_ORIGIN: 'http://localhost:5173',
    },
  },
})
```

创建 `apps/client/eslint.config.mjs`：

```js
import { baseConfig } from '@taskflow/config/eslint/base'
import { vueConfig } from '@taskflow/config/eslint/vue'

export default [...baseConfig, ...vueConfig]
```

创建 `apps/server/eslint.config.mjs`：

```js
import { baseConfig } from '@taskflow/config/eslint/base'
import { nodeConfig } from '@taskflow/config/eslint/node'

export default [...baseConfig, nodeConfig]
```

创建根 `eslint.config.mjs`：

```js
import { baseConfig } from '@taskflow/config/eslint/base'
import { nodeConfig } from '@taskflow/config/eslint/node'

export default [...baseConfig, nodeConfig]
```

给前端和后端 `package.json` 增加：

```json
"lint": "eslint ."
```

给根 `package.json` 增加临时统一 lint 脚本，任务 3 会替换为 Turborepo：

```json
"lint": "pnpm -r --if-present run lint && eslint scripts"
```

在前后端、契约包和配置包中安装 workspace 配置依赖与 ESLint：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/client add -D @taskflow/config@workspace:* eslint
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/server add -D @taskflow/config@workspace:* eslint
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm add -Dw eslint
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm add -Dw @taskflow/config@workspace:*
```

让前端和后端引用共享契约：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/client add @taskflow/contracts@workspace:*
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/server add @taskflow/contracts@workspace:*
```

- [ ] **步骤 8：运行共享包、前后端和静态检查验证**

运行：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/contracts build
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm lint
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/client test:run
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/server exec vitest run
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/client typecheck
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm --filter @taskflow/server typecheck
```

预期：

- 契约测试通过。
- ESLint 不报告错误。
- 前后端现有测试通过。
- 前后端类型检查通过。

如果 ESLint 首次发现历史问题，只修正确定性问题，不通过关闭核心规则来“通过”检查。

- [ ] **步骤 9：检查并提交**

运行：

```bash
npm run format
git add .
npm run commit:check
git diff --cached
```

确认共享配置被实际引用、错误响应没有语义变化后提交：

```bash
git commit -m "feat: 增加共享配置和接口契约" -m "- 建立 TypeScript、Vitest 和 ESLint 共享配置
- 使用 Zod 统一错误码和健康检查契约
- 接入静态检查并保持现有测试通过"
```

---

### 任务 3：接入 Turborepo、统一命令、CI 和文档

**文件：**

- 创建：`turbo.json`
- 创建：`scripts/clean.mjs`
- 创建：`.github/workflows/ci.yml`
- 修改：`package.json`
- 修改：`scripts/dev.mjs`
- 修改：`.githooks/pre-commit`
- 修改：`.githooks/commit-msg`
- 修改：`apps/client/package.json`
- 修改：`apps/server/package.json`
- 修改：`packages/contracts/package.json`
- 修改：`.vscode/extensions.json`
- 修改：`README.md`
- 修改：`docs/PROGRESS.md`
- 修改：`docs/architecture/framework-roadmap.md`
- 修改：`docs/requirements/01-product-requirements.md`
- 修改：`docs/requirements/05-acceptance-and-test-matrix.md`
- 修改：`docs/superpowers/specs/2026-09-23-taskflow-design.md`
- 修改：`docs/superpowers/plans/2026-09-23-taskflow-implementation.md`
- 修改：`.github/pull_request_template.md`

**接口：**

- 消耗：任务 2 的共享配置和契约包
- 产出：根目录 `pnpm dev/build/test/typecheck/lint/clean`
- 产出：Turborepo 任务图和构建缓存
- 产出：GitHub Actions 质量门禁

- [ ] **步骤 1：安装 Turborepo 并创建任务图**

运行：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm add -Dw turbo
```

创建 `turbo.json`：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "stream",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    }
  }
}
```

- [ ] **步骤 2：统一各包命令**

将 `apps/client/package.json` 的脚本调整为：

```json
"scripts": {
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "test": "vitest run",
  "test:run": "vitest run",
  "test:watch": "vitest",
  "typecheck": "vue-tsc -b",
  "lint": "eslint ."
}
```

将 `apps/server/package.json` 的脚本调整为：

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc -p tsconfig.build.json",
  "start": "node dist/server.js",
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit",
  "lint": "eslint ."
}
```

将 `packages/contracts/package.json` 的脚本调整为：

```json
"scripts": {
  "build": "tsc -p tsconfig.build.json",
  "dev": "tsc -p tsconfig.build.json --watch --preserveWatchOutput",
  "test": "vitest run",
  "typecheck": "tsc --noEmit",
  "lint": "eslint ."
}
```

- [ ] **步骤 3：替换根目录统一命令**

将根 `package.json` 的脚本调整为：

```json
"scripts": {
  "prepare": "node scripts/setup-git-hooks.mjs",
  "dev": "node scripts/dev.mjs",
  "build": "turbo run build",
  "test": "turbo run test",
  "typecheck": "turbo run typecheck",
  "lint": "turbo run lint && eslint scripts",
  "clean": "node scripts/clean.mjs",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "commit:check": "node scripts/validate-staged.mjs",
  "commit:message": "node scripts/validate-commit-message.mjs"
}
```

将 `.githooks/pre-commit` 改为：

```sh
#!/bin/sh
set -eu

pnpm run commit:check
```

将 `.githooks/commit-msg` 改为：

```sh
#!/bin/sh
set -eu

pnpm run commit:message -- "$1"
```

- [ ] **步骤 4：让开发启动脚本通过 Turborepo 运行**

将 `scripts/dev.mjs` 调整为：

```js
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const serverEnvPath = path.join(rootDir, 'apps', 'server', '.env')

if (!existsSync(serverEnvPath)) {
  console.error('未找到 apps/server/.env，请先根据 apps/server/.env.example 创建后端环境配置。')
  process.exit(1)
}

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const child = spawn(pnpmCommand, ['exec', 'turbo', 'run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
})

child.once('error', (error) => {
  console.error(`[dev] Turborepo 启动失败：${error.message}`)
  process.exit(1)
})

child.once('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})

process.once('SIGINT', () => child.kill('SIGINT'))
process.once('SIGTERM', () => child.kill('SIGTERM'))
```

- [ ] **步骤 5：增加跨平台清理脚本**

创建 `scripts/clean.mjs`：

```js
import { rmSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const targets = [
  '.turbo',
  'apps/client/dist',
  'apps/client/coverage',
  'apps/server/dist',
  'apps/server/coverage',
  'packages/contracts/dist',
  'packages/contracts/coverage',
]

for (const target of targets) {
  rmSync(path.join(rootDir, target), {
    force: true,
    recursive: true,
  })
}

console.log(`已清理 ${targets.length} 个构建或缓存目录。`)
```

- [ ] **步骤 6：增加 GitHub Actions 质量门禁**

创建 `.github/workflows/ci.yml`：

```yaml
name: 持续集成

on:
  push:
  pull_request:

jobs:
  quality:
    name: 质量检查
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: 检出代码
        uses: actions/checkout@v4

      - name: 安装 pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.17.0

      - name: 安装 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: 安装依赖
        run: pnpm install --frozen-lockfile

      - name: 恢复 Turborepo 缓存
        uses: actions/cache@v4
        with:
          path: .turbo
          key: turbo-${{ runner.os }}-${{ github.sha }}
          restore-keys: |
            turbo-${{ runner.os }}-

      - name: 检查格式
        run: pnpm format:check

      - name: 运行静态检查
        run: pnpm lint

      - name: 运行类型检查
        run: pnpm typecheck

      - name: 运行测试
        run: pnpm test

      - name: 运行构建
        run: pnpm build
```

- [ ] **步骤 7：更新编辑器、README 和 Pull Request 模板**

将 `.vscode/extensions.json` 调整为：

```json
{
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
```

README 技术栈增加：

```markdown
- 工程化：pnpm workspace、Turborepo、ESLint、Prettier、Vitest
```

README 项目结构改为：

```text
apps/client/        Vue 前端应用
apps/server/        Express 后端服务
packages/config/    共享工程配置
packages/contracts/ Zod 接口契约
docs/               需求、设计、原型和进度文档
scripts/            根目录开发与校验脚本
```

README 快速开始改为：

```bash
nvm use
corepack pnpm install
pnpm dev
```

README 根目录验证命令改为：

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

将 `.github/pull_request_template.md` 中所有 `npm run ...` 替换为对应的 `pnpm ...`：

```text
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
```

- [ ] **步骤 8：同步历史设计和需求文档**

在 `docs/superpowers/specs/2026-09-23-taskflow-design.md` 顶部加入：

```markdown
> 2026-09-24 调整：仓库工程结构已由
> `docs/superpowers/specs/2026-09-24-monorepo-engineering-upgrade-design.md`
> 更新为 pnpm workspace 与 Turborepo。本文中的 Vue、Express、Prisma、SQLite 和业务设计仍然有效；
> `client/`、`server/` 路径分别对应 `apps/client/`、`apps/server/`。
```

在 `docs/superpowers/plans/2026-09-23-taskflow-implementation.md` 顶部加入同样提示，并增加：

```markdown
> 本文中的根目录安装和验证命令统一替换为 `pnpm` workspace 命令；
> 各任务的业务代码仍然按原顺序实施。
```

将 `docs/requirements/01-product-requirements.md` 中“第一版运行于本地环境，前后端分别启动，不使用 npm workspace。”改为：

```markdown
第一版运行于本地环境，前后端通过 pnpm workspace 和 Turborepo 统一启动、测试与构建。
```

将 `docs/requirements/05-acceptance-and-test-matrix.md` 中的安装和 CI 描述改为：

```markdown
1. 在仓库根目录执行 `pnpm install --frozen-lockfile`。
2. 运行 `pnpm build` 生成共享契约和前后端构建产物。
3. 运行 `pnpm lint`、`pnpm typecheck` 和 `pnpm test`。
4. 在接入 Playwright 后，为端到端任务单独安装 Chromium。

CI 使用 Node.js 22、pnpm 10.17.0 和冻结锁文件。
```

更新 `docs/architecture/framework-roadmap.md`：

- 当前基线加入 pnpm workspace、唯一锁文件、Turborepo、共享配置、Zod 契约、ESLint 和最小 CI。
- 从“当前主要缺口”移除 F-01 至 F-05 和 F-09 已完成项。
- 将目标结构中的 `client/`、`server/` 改为 `apps/client/`、`apps/server/`。
- 从“暂不引入”移除 Turborepo，改为“暂不引入 Nx 和远程构建缓存”。

更新 `docs/PROGRESS.md`：

```markdown
### 11. Monorepo 工程升级

已完成：

- 迁移到 `apps/client` 和 `apps/server`。
- 建立 pnpm workspace 和唯一根锁文件。
- 建立 `packages/config` 和 `packages/contracts`。
- 接入 Turborepo、ESLint、统一根命令和 GitHub Actions。
- 固定 Node.js 22 与 pnpm 10.17.0。

为什么这样做：

- 统一依赖图和任务入口，减少前后端配置分叉。
- 用 Zod 契约连接前后端，避免错误码和响应结构重复定义。
- 在业务数据层开始前建立质量门禁，降低后续迁移成本。
```

同时更新“当前快照”“当前可运行命令”“已知限制与风险”和“下一阶段推荐顺序”，使它们与 workspace、Turborepo 和 CI 的实际状态一致。

- [ ] **步骤 9：执行完整验收**

运行：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm install --frozen-lockfile
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm format:check
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm lint
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm typecheck
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm test
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm build
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm clean
```

预期：

- 冻结锁文件安装成功。
- 格式、lint、类型检查和测试通过。
- 三个 workspace 构建成功。
- 清理命令删除 `.turbo` 和各包 `dist`，不删除源码和锁文件。

- [ ] **步骤 10：验证真实开发启动**

确认 `apps/server/.env` 存在后运行：

```bash
PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH" pnpm dev
```

分别访问：

```text
http://127.0.0.1:5173/
http://127.0.0.1:3000/api/v1/health
```

预期：

- Vite 返回 TaskFlow 页面。
- 健康检查返回 `code: "OK"`、`data.status: "ok"` 和 `requestId`。
- 按 `Ctrl+C` 后 contracts、前端和后端进程全部退出。

- [ ] **步骤 11：检查并提交**

运行：

```bash
npm run format
git add .
npm run commit:check
git diff --cached
```

确认 CI 命令、文档路径和 Turborepo 缓存规则一致后提交：

```bash
git commit -m "build: 增加 Turborepo 和持续集成" -m "- 统一根目录开发、构建、测试和检查命令
- 增加 GitHub Actions 质量门禁
- 同步 README、需求、路线图和进度文档"
```

---

## 完成检查

- [ ] 仓库结构为 `apps/client`、`apps/server`、`packages/config`、`packages/contracts`。
- [ ] 根目录只保留一份 `pnpm-lock.yaml`。
- [ ] Node.js 22 和 pnpm 10.17.0 在本地、包声明和 CI 中一致。
- [ ] 前后端和共享包复用 TypeScript、Vitest 与 ESLint 配置。
- [ ] `@taskflow/contracts` 被后端实际使用且有测试覆盖。
- [ ] `pnpm dev/build/test/typecheck/lint/clean` 全部可用。
- [ ] `pnpm format:check` 和 `pnpm commit:check` 通过，暂存差异已人工阅读。
- [ ] GitHub Actions 覆盖安装、格式、lint、类型、测试和构建。
- [ ] README、需求、路线图和进度文档与实际结构一致。
