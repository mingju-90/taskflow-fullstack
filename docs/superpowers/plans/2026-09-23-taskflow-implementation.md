# TaskFlow 全栈项目中文实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 在一个仓库中完成 Vue 3 + Element Plus + Express + Prisma 任务管理系统，同时保证用户负责主要代码实现，Codex 重点提供 Node.js 和后端支持。

**架构：** 仓库包含彼此独立的 `client` 和 `server` 目录。后端采用 `route -> controller -> service -> Prisma` 分层；前端采用 Vue 3、Vite、Pinia、Vue Router、Axios 和 Element Plus。

**技术栈：** Vue 3、TypeScript、Vite、Vue Router、Pinia、Axios、Element Plus、Node.js、Express、Prisma、SQLite、JWT、Zod、Multer、Vitest、Supertest、Vue Test Utils、Playwright。

**设计文档：** `docs/superpowers/specs/2026-09-23-taskflow-design.md`

> 本文档正文使用中文。代码、命令、包名、接口字段和错误码保留英文，执行时以这些标识符的准确拼写为准。

## 学习执行方式

本计划采用“用户主写，Codex 支持”的引导模式：

1. 用户先写失败测试，再写最小实现。
2. Codex 重点解释 Node.js、HTTP、Express、Prisma、数据库、鉴权、文件系统和测试概念。
3. Codex 可以提供骨架、接口签名、测试样例、排错和代码审查。
4. 用户运行每个验证命令并反馈结果。
5. 当前任务测试通过并完成提交后，才开始下一个任务。
6. 前端逻辑由用户主导，后端逻辑可以获得更详细的分步支持。

## 全局约束

- 项目根目录：`/Users/mingju/Desktop/练手代码/111`
- Git 分支：`main`
- Node.js：20 或更高版本
- 包管理器：npm
- 不使用 npm workspace
- `client` 和 `server` 分别拥有自己的 `package.json`、锁文件、脚本和环境变量
- 所有应用代码使用严格模式 TypeScript
- API 前缀：`/api/v1`
- 成功响应：`{ code: "OK", message: string, data: unknown, requestId: string }`
- 失败响应：`{ code: string, message: string, details: unknown, requestId: string }`
- 鉴权请求头：`Authorization: Bearer <token>`
- 项目角色：`OWNER`、`MEMBER`
- 任务状态：`TODO`、`IN_PROGRESS`、`DONE`
- 任务优先级：`LOW`、`MEDIUM`、`HIGH`
- 分页默认值：`page=1`、`pageSize=20`，最大 `pageSize=100`
- 单文件上传上限：5 MB
- 每个任务最多 20 个附件
- 允许上传：PDF、PNG、JPEG、纯文本
- 上传文件不能通过公开静态目录访问
- UI 文案使用中文
- 每个任务结束后必须有通过的测试、类型检查和一次 Git 提交
- 不实现设计文档中明确排除的功能

## 文件结构

### 根目录

- `.gitignore`：忽略依赖、构建产物、本地数据库、环境文件、测试产物和上传文件。
- `README.md`：安装、环境、迁移、种子数据、开发、测试和构建说明。
- `docs/`：设计文档和本实施计划。

### 后端

- `server/package.json`：后端脚本和依赖。
- `server/tsconfig.json`：后端严格 TypeScript 配置。
- `server/tsconfig.build.json`：只编译 `src` 的生产构建配置。
- `server/vitest.config.ts`：后端测试配置。
- `server/.env.example`：后端环境变量模板。
- `server/prisma/schema.prisma`：数据模型。
- `server/prisma/seed.ts`：幂等开发数据。
- `server/src/app.ts`：创建并配置 Express 应用。
- `server/src/server.ts`：监听端口并处理退出。
- `server/src/config/env.ts`：校验环境变量。
- `server/src/config/logger.ts`：结构化日志。
- `server/src/lib/prisma.ts`：共享 Prisma Client。
- `server/src/lib/app-error.ts`：业务错误类。
- `server/src/lib/response.ts`：统一成功响应。
- `server/src/lib/password.ts`：密码哈希。
- `server/src/lib/jwt.ts`：JWT 签发和验证。
- `server/src/lib/upload.ts`：Multer 上传配置。
- `server/src/middlewares/auth.ts`：登录认证。
- `server/src/middlewares/error-handler.ts`：全局错误处理。
- `server/src/middlewares/not-found.ts`：404 处理。
- `server/src/middlewares/request-context.ts`：请求 ID。
- `server/src/schemas/*.schema.ts`：Zod 请求校验。
- `server/src/services/*.service.ts`：业务逻辑和权限判断。
- `server/src/controllers/*.controller.ts`：HTTP 输入输出。
- `server/src/routes/*.route.ts`：路由声明。
- `server/src/types/http.ts`：分页等 HTTP 类型。
- `server/tests/helpers/*.ts`：测试数据库和工厂函数。
- `server/tests/*.test.ts`：后端集成测试。
- `server/scripts/prepare-e2e.ts`：准备端到端测试数据库。

### 前端

- `client/package.json`：前端脚本和依赖。
- `client/tsconfig*.json`：Vue TypeScript 配置。
- `client/vite.config.ts`：Vite 和 Vitest 配置。
- `client/.env.example`：前端 API 地址模板。
- `client/src/main.ts`：Vue、Pinia、Router、Element Plus 初始化。
- `client/src/App.vue`：路由出口。
- `client/src/router/index.ts`：路由和登录守卫。
- `client/src/api/*.ts`：后端 API 请求。
- `client/src/stores/*.ts`：认证和当前项目状态。
- `client/src/utils/*.ts`：Token、权限、任务查询参数工具。
- `client/src/layouts/AppLayout.vue`：登录后的应用框架。
- `client/src/views/**/*.vue`：页面。
- `client/src/components/**/*.vue`：业务组件。
- `client/tests/*.test.ts`：前端单元测试。
- `client/e2e/*.spec.ts`：Playwright 测试。
- `client/playwright.config.ts`：端到端测试配置。

---

## 任务 1：搭建后端基础与健康检查

**目标：** 创建独立的 `server` 项目，可以启动并访问 `GET /api/v1/health`。

**涉及文件：**

- 新建：`.gitignore`
- 新建：`README.md`
- 新建：`server/package.json`
- 新建：`server/tsconfig.json`
- 新建：`server/tsconfig.build.json`
- 新建：`server/vitest.config.ts`
- 新建：`server/.env.example`
- 新建：`server/src/config/env.ts`
- 新建：`server/src/app.ts`
- 新建：`server/src/server.ts`
- 新建：`server/src/routes/health.route.ts`
- 新建：`server/tests/health.test.ts`

**接口：**

- 依赖：无。
- 产出：`createApp(): Express`、`env`、`GET /api/v1/health`。

- [ ] **步骤 1：安装后端基础依赖**

```bash
mkdir -p server/src/config server/src/routes server/tests
cd server
npm init -y
npm install express cors helmet dotenv zod
npm install -D typescript tsx vitest supertest @types/node @types/express @types/cors @types/supertest
```

- [ ] **步骤 2：先写失败的接口测试**

创建 `server/tests/health.test.ts`：

```ts
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app'

describe('GET /api/v1/health', () => {
  it('returns the service status', async () => {
    const response = await request(createApp()).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body.code).toBe('OK')
    expect(response.body.data).toEqual({ status: 'ok' })
  })
})
```

- [ ] **步骤 3：运行测试并确认失败**

```bash
npm test -- --run tests/health.test.ts
```

预期：因为 `src/app.ts` 不存在而失败。

- [ ] **步骤 4：创建后端配置和健康接口**

`server/package.json` 脚本：

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.build.json",
    "start": "node dist/server.js",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

`server/tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "rootDir": ".",
    "types": ["node"]
  },
  "include": ["src", "tests", "prisma", "scripts", "vitest.config.ts"]
}
```

`server/tsconfig.build.json`：

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["tests", "**/*.test.ts"]
}
```

`server/vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    clearMocks: true,
    restoreMocks: true,
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

`server/.env.example`：

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=replace-with-a-long-random-value
JWT_EXPIRES_IN=2h
UPLOAD_DIR=./uploads
CLIENT_ORIGIN=http://localhost:5173
```

`server/src/config/env.ts`：

```ts
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('2h'),
  UPLOAD_DIR: z.string().default('./uploads'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  throw new Error(`Invalid environment configuration: ${result.error.message}`)
}

export const env = result.data
```

`server/src/routes/health.route.ts`：

```ts
import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/health', (_request, response) => {
  response.json({
    code: 'OK',
    message: 'success',
    data: { status: 'ok' },
    requestId: 'health-check',
  })
})
```

`server/src/app.ts`：

```ts
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import { healthRouter } from './routes/health.route'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.CLIENT_ORIGIN }))
  app.use(express.json({ limit: '1mb' }))
  app.use('/api/v1', healthRouter)

  return app
}
```

`server/src/server.ts`：

```ts
import { createServer } from 'node:http'
import { createApp } from './app'
import { env } from './config/env'

const server = createServer(createApp())

server.listen(env.PORT, '127.0.0.1', () => {
  console.log(`API listening on http://127.0.0.1:${env.PORT}`)
})
```

- [ ] **步骤 5：验证**

```bash
npm test -- --run tests/health.test.ts
npm run typecheck
```

预期：测试通过，类型检查无错误。

- [ ] **步骤 6：添加基础忽略文件和 README，并提交**

`.gitignore`：

```gitignore
node_modules/
dist/
coverage/
playwright-report/
test-results/
.env
.env.*
!.env.example
*.db
*.db-journal
server/uploads/
.DS_Store
```

```bash
git add .gitignore README.md server
git commit -m "chore: scaffold TaskFlow server"
```

---

## 任务 2：统一错误处理、请求 ID 和日志

**目标：** 所有接口错误都返回统一结构，并给每个请求生成 `requestId`。

**涉及文件：**

- 新建：`server/src/lib/app-error.ts`
- 新建：`server/src/lib/response.ts`
- 新建：`server/src/middlewares/not-found.ts`
- 新建：`server/src/middlewares/error-handler.ts`
- 新建：`server/src/middlewares/request-context.ts`
- 新建：`server/src/types/express.d.ts`
- 修改：`server/src/app.ts`
- 修改：`server/src/routes/health.route.ts`
- 新建：`server/tests/error-handling.test.ts`

**接口：**

- 产出：`AppError`、`sendSuccess()`、`errorHandler`、`notFoundHandler`、`requestContext`。

- [ ] **步骤 1：写失败测试**

测试必须覆盖：

- `AppError` 返回指定状态码、业务码和消息。
- 未知错误返回 `500 INTERNAL_ERROR`，不能泄露堆栈。
- 所有错误响应包含字符串 `requestId`。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd server
npm test -- --run tests/error-handling.test.ts
```

- [ ] **步骤 3：实现错误基础设施**

`AppError` 构造函数固定为：

```ts
class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown = null,
  )
}
```

`sendSuccess()` 固定为：

```ts
sendSuccess<T>(response: Response, data: T, message = 'success')
```

`requestContext` 使用 `randomUUID()` 写入 `response.locals.requestId`。

`notFoundHandler` 抛出：

```ts
new AppError(404, 'ROUTE_NOT_FOUND', '接口不存在')
```

`errorHandler` 必须处理：

- `AppError`
- `ZodError`，返回 `VALIDATION_ERROR` 和字段级 `details`
- 未知错误，返回 `INTERNAL_ERROR`

- [ ] **步骤 4：完成验证**

```bash
npm test -- --run tests/health.test.ts tests/error-handling.test.ts
npm run typecheck
```

- [ ] **步骤 5：提交**

```bash
git add server
git commit -m "feat: add API error handling foundation"
```

---

## 任务 3：Prisma 数据模型、迁移、测试数据库和种子数据

**目标：** 建立全部核心数据模型，并提供可重复执行的开发数据。

**涉及文件：**

- 新建：`server/prisma/schema.prisma`
- 新建：`server/prisma/seed.ts`
- 新建：`server/src/lib/prisma.ts`
- 新建：`server/tests/helpers/database.ts`
- 新建：`server/tests/helpers/factories.ts`
- 新建：`server/tests/seed.test.ts`
- 修改：`server/package.json`

**接口：**

- 产出：`prisma`、`resetDatabase()`、`createUser()`、`createProjectWithOwner()`。

- [ ] **步骤 1：安装 Prisma**

```bash
cd server
npm install @prisma/client bcryptjs
npm install -D prisma tsx @types/bcryptjs
npx prisma init --datasource-provider sqlite
```

- [ ] **步骤 2：先写失败测试**

测试创建用户后断言：

```ts
const user = await createUser({ email: 'owner@example.com' })
expect(user.email).toBe('owner@example.com')
expect(await prisma.user.count()).toBe(1)
```

- [ ] **步骤 3：运行测试并确认失败**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/seed.test.ts
```

- [ ] **步骤 4：定义 Prisma 模型**

模型必须包含：

- `User`
- `Project`
- `ProjectMember`
- `Task`
- `Comment`
- `Attachment`

关键关系：

```text
User N ── ProjectMember ── N Project
Project 1 ── N Task
User 1 ── N Task(assignee)
User 1 ── N Task(creator)
Task 1 ── N Comment
Task 1 ── N Attachment
```

关键约束：

- `User.email` 唯一。
- `User.username` 唯一。
- `ProjectMember` 的 `projectId + userId` 组合唯一。
- 删除项目级联删除成员、任务、评论和附件记录。
- 删除任务级联删除评论和附件记录。
- 删除负责人时将 `assigneeId` 设为 `null`。

`role`、`status`、`priority` 使用 `String`，合法值由 Zod 和 TypeScript 联合类型限制。

- [ ] **步骤 5：实现测试辅助函数**

`resetDatabase()` 按以下顺序清理：

```text
attachment
comment
task
projectMember
project
user
```

最后删除测试上传目录：

```ts
await rm(resolve(env.UPLOAD_DIR), { recursive: true, force: true })
```

`createUser()` 默认使用动态邮箱和用户名，避免测试冲突。

`createProjectWithOwner()` 在创建项目时同时写入 `OWNER` 成员。

- [ ] **步骤 6：创建幂等种子数据**

种子数据必须包含：

- `owner@example.com`
- `member@example.com`
- 一个示例项目
- `TODO`、`IN_PROGRESS`、`DONE` 三个任务
- 两个用户的密码均为 `password123`

用户和项目使用 `upsert`，重复执行不能产生重复记录。

- [ ] **步骤 7：生成、迁移、写种子并验证**

```bash
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
DATABASE_URL=file:./test.db npx prisma db push
DATABASE_URL=file:./test.db npm test -- --run tests/seed.test.ts
npm run db:seed
npm run typecheck
```

- [ ] **步骤 8：提交**

```bash
git add server
git commit -m "feat: add Prisma data model and seed"
```

---

## 任务 4：注册、登录和 JWT 鉴权 API

**目标：** 实现 `POST /auth/register`、`POST /auth/login`、`GET /auth/me`。

**涉及文件：**

- 新建：`server/src/lib/jwt.ts`
- 新建：`server/src/schemas/auth.schema.ts`
- 新建：`server/src/services/auth.service.ts`
- 新建：`server/src/controllers/auth.controller.ts`
- 新建：`server/src/routes/auth.route.ts`
- 修改：`server/src/middlewares/auth.ts`
- 修改：`server/src/app.ts`
- 新建：`server/tests/auth.test.ts`

**接口：**

- 产出：`register()`、`login()`、`getCurrentUser()`、`requireAuth`。
- 请求字段：`username`、`email`、`password`。
- 响应：`{ token, user }`。

- [ ] **步骤 1：写失败测试**

必须覆盖：

- 注册成功后返回 `201`、Token 和公开用户信息。
- 重复邮箱返回 `409 EMAIL_ALREADY_EXISTS`。
- 正确密码可以登录。
- 错误密码返回 `401 INVALID_CREDENTIALS`。
- 携带 Bearer Token 可以访问 `/auth/me`。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/auth.test.ts
```

- [ ] **步骤 3：实现校验、哈希和 JWT**

注册规则：

```ts
username: z.string().trim().min(3).max(20)
email: z.string().trim().email().toLowerCase()
password: z.string().min(8).max(72)
```

JWT Payload 固定为：

```ts
interface AccessTokenPayload {
  sub: string
}
```

密码使用 `bcryptjs` 哈希，成本因子为 12。

- [ ] **步骤 4：实现 Service、Controller 和 Route**

注册逻辑：

1. 查找邮箱或用户名是否已存在。
2. 哈希密码。
3. 创建用户。
4. 签发 Token。
5. 返回公开用户字段，不能返回 `passwordHash`。

登录逻辑：

1. 按邮箱查询用户。
2. 比较密码。
3. 失败统一返回“邮箱或密码错误”。
4. 成功返回 Token 和公开用户信息。

`requireAuth` 从 `Authorization` 读取 Bearer Token，验证后写入：

```ts
request.auth = { userId: payload.sub }
```

- [ ] **步骤 5：验证并提交**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/auth.test.ts
npm run typecheck
git add server
git commit -m "feat: add JWT authentication API"
```

---

## 任务 5：搭建 Vue 前端和基础应用框架

**目标：** 创建独立的 `client` 项目，可以运行、测试和构建。

**涉及文件：**

- 新建：`client/package.json`
- 新建：`client/tsconfig.json`
- 新建：`client/tsconfig.app.json`
- 新建：`client/tsconfig.node.json`
- 新建：`client/vite.config.ts`
- 新建：`client/.env.example`
- 新建：`client/index.html`
- 新建：`client/src/main.ts`
- 新建：`client/src/App.vue`
- 新建：`client/src/router/index.ts`
- 新建：`client/src/styles/base.css`
- 新建：`client/src/views/HomeView.vue`
- 新建：`client/tests/app-shell.test.ts`

**接口：**

- 产出：Vue 应用启动入口、Router、基础样式和首页路由。

- [ ] **步骤 1：安装依赖**

```bash
mkdir -p client/src/router client/src/views client/tests
cd client
npm init -y
npm install vue vue-router pinia axios element-plus
npm install -D typescript vite @vitejs/plugin-vue vue-tsc vitest @vue/test-utils jsdom
```

脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "test": "vitest",
    "typecheck": "vue-tsc -b"
  }
}
```

- [ ] **步骤 2：先写失败测试**

挂载 `App.vue` 并使用真实的 `router`，断言页面文本包含 `TaskFlow`。

- [ ] **步骤 3：运行测试并确认失败**

```bash
cd client
npm test -- --run tests/app-shell.test.ts
```

- [ ] **步骤 4：实现 Vite、TypeScript 和 Vue 入口**

`vite.config.ts` 使用：

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  server: { port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

`main.ts` 安装：

```text
Pinia -> Router -> Element Plus -> mount('#app')
```

`/src/env.d.ts` 引入 Vite 客户端类型。

`/.env.example` 写入：

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

- [ ] **步骤 5：验证并提交**

```bash
npm test -- --run tests/app-shell.test.ts
npm run typecheck
npm run build
git add client
git commit -m "chore: scaffold TaskFlow client"
```

---

## 任务 6：登录、注册、Token 和路由守卫

**目标：** 完成前端认证闭环，刷新页面可以恢复登录状态。

**涉及文件：**

- 新建：`client/src/utils/auth-token.ts`
- 新建：`client/src/api/http.ts`
- 新建：`client/src/api/auth.ts`
- 新建：`client/src/stores/auth.ts`
- 新建：`client/src/layouts/AppLayout.vue`
- 新建：`client/src/views/auth/LoginView.vue`
- 新建：`client/src/views/auth/RegisterView.vue`
- 新建：`client/src/views/DashboardView.vue`
- 修改：`client/src/router/index.ts`
- 修改：`client/src/main.ts`
- 修改：`client/tests/app-shell.test.ts`
- 新建：`client/tests/http.test.ts`
- 新建：`client/tests/auth.test.ts`

**接口：**

- 产出：`getAccessToken()`、`setAccessToken()`、`clearAccessToken()`
- 产出：`apiRequest<T>()`、`ApiError`
- 产出：`authApi`、`useAuthStore()`
- 路由：`/login`、`/register`、`/dashboard`

- [ ] **步骤 1：安装测试适配器并写失败测试**

```bash
cd client
npm install -D axios-mock-adapter
```

HTTP 测试必须验证：

- 请求前自动添加 Bearer Token。
- 成功响应自动解包 `data`。
- 异常响应转换为 `ApiError`。

认证 Store 测试必须验证：

- 登录后保存 Token 和用户。
- 退出后清空 Token 和用户。

- [ ] **步骤 2：运行测试并确认失败**

```bash
npm test -- --run tests/http.test.ts tests/auth.test.ts
```

- [ ] **步骤 3：实现 Token 和 Axios 客户端**

Token 保存键固定为：

```text
taskflow.access-token
```

Axios 基地址：

```ts
import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
```

遇到 `401` 时：

1. 清除 Token。
2. 触发 `auth:expired` 事件。
3. 抛出带 `code`、`message`、`status`、`details`、`requestId` 的 `ApiError`。

- [ ] **步骤 4：实现认证 Store 和页面**

Store 状态固定包含：

```ts
{
  user: User | null
  initialized: boolean
}
```

Store 动作固定包含：

```text
login
register
bootstrap
logout
```

`bootstrap()`：

- 无 Token 时直接标记初始化完成。
- 有 Token 时调用 `/auth/me`。
- 请求失败时清除 Token。

登录和注册页面使用 Element Plus 表单，错误信息直接展示服务端消息。

- [ ] **步骤 5：实现路由守卫**

路由元数据：

```ts
meta: { requiresAuth: true }
meta: { guestOnly: true }
```

守卫先执行 `auth.bootstrap()`：

- 未登录访问受保护页面：跳转 `/login`。
- 已登录访问登录或注册页：跳转 `/dashboard`。

`app-shell.test.ts` 挂载时必须安装 `createPinia()`。

- [ ] **步骤 6：验证并提交**

```bash
npm test -- --run tests/http.test.ts tests/auth.test.ts tests/app-shell.test.ts
npm run typecheck
npm run build
git add client
git commit -m "feat: add client authentication flow"
```

---

## 任务 7：项目和成员后端 API

**目标：** 实现项目的增删改查、成员添加和成员移除。

**涉及文件：**

- 新建：`server/src/types/http.ts`
- 新建：`server/src/schemas/project.schema.ts`
- 新建：`server/src/services/project-access.service.ts`
- 新建：`server/src/services/project.service.ts`
- 新建：`server/src/controllers/project.controller.ts`
- 新建：`server/src/routes/project.route.ts`
- 新建：`server/tests/helpers/auth.ts`
- 新建：`server/tests/projects.test.ts`
- 修改：`server/src/app.ts`

**接口：**

- 产出：`Paginated<T>`
- 产出：`requireProjectMember()`、`requireProjectOwner()`
- 产出：项目列表、创建、详情、修改、删除、成员列表、添加成员、移除成员接口

- [ ] **步骤 1：写失败测试**

必须覆盖：

- 创建项目后，创建者自动成为 `OWNER`。
- 非项目成员访问项目返回 `403 PROJECT_MEMBER_REQUIRED`。
- `OWNER` 可以添加成员。
- `MEMBER` 不能移除成员，返回 `403 PROJECT_OWNER_REQUIRED`。
- 重复添加成员返回 `409 MEMBER_ALREADY_EXISTS`。
- 移除负责人返回 `409 OWNER_CANNOT_BE_REMOVED`。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/projects.test.ts
```

- [ ] **步骤 3：定义分页和请求校验**

分页规则：

```ts
page: z.coerce.number().int().min(1).default(1)
pageSize: z.coerce.number().int().min(1).max(100).default(20)
```

项目创建输入固定为：

```ts
{
  name: string
  description: string
}
```

成员添加输入固定为：

```ts
{
  identifier: string
}
```

- [ ] **步骤 4：实现项目权限检查**

`requireProjectMember()`：

1. 查询 `ProjectMember`。
2. 不存在时抛出 `403 PROJECT_MEMBER_REQUIRED`。
3. 返回成员记录。

`requireProjectOwner()`：

1. 先调用 `requireProjectMember()`。
2. 角色不是 `OWNER` 时抛出 `403 PROJECT_OWNER_REQUIRED`。
3. 返回成员记录。

- [ ] **步骤 5：实现项目 Service**

创建项目时必须在同一个 Prisma 写入中同时创建项目和 `OWNER` 成员。

删除项目时当前使用 Prisma 级联删除；附件文件清理会在任务 13 补充。

添加成员时：

- 只有 `OWNER` 可以操作。
- 按邮箱或用户名查询用户。
- 重复成员返回 `409`。

移除成员时：

- 不能移除自己。
- 不能移除任何 `OWNER`。
- 成员不存在返回 `404`。

- [ ] **步骤 6：实现 Controller 和 Route**

路由固定为：

```text
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:projectId
PATCH  /api/v1/projects/:projectId
DELETE /api/v1/projects/:projectId
GET    /api/v1/projects/:projectId/members
POST   /api/v1/projects/:projectId/members
DELETE /api/v1/projects/:projectId/members/:userId
```

- [ ] **步骤 7：验证并提交**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/projects.test.ts
npm run typecheck
git add server
git commit -m "feat: add project and member APIs"
```

---

## 任务 8：项目列表、详情和成员管理前端

**目标：** 用户可以在界面上创建项目、查看项目、修改项目和维护成员。

**涉及文件：**

- 新建：`client/src/api/projects.ts`
- 新建：`client/src/stores/project.ts`
- 新建：`client/src/utils/permissions.ts`
- 新建：`client/src/components/projects/ProjectFormDialog.vue`
- 新建：`client/src/components/projects/MemberPanel.vue`
- 新建：`client/src/views/projects/ProjectsView.vue`
- 新建：`client/src/views/projects/ProjectDetailView.vue`
- 修改：`client/src/router/index.ts`
- 修改：`client/src/layouts/AppLayout.vue`
- 新建：`client/tests/project-store.test.ts`
- 新建：`client/tests/permissions.test.ts`

**接口：**

- 产出：`projectApi`
- 产出：`useProjectStore()`
- 产出：`canManageProject()`
- 路由：`/projects`、`/projects/:projectId`

- [ ] **步骤 1：写失败测试**

测试必须验证：

- `OWNER` 返回 `true`。
- `MEMBER` 和 `undefined` 返回 `false`。
- 项目详情加载后能根据当前用户 ID 得到正确角色。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd client
npm test -- --run tests/permissions.test.ts tests/project-store.test.ts
```

- [ ] **步骤 3：实现项目 API 和权限工具**

`projectApi` 固定包含：

```text
list
create
detail
update
remove
members
addMember
removeMember
```

角色类型固定为：

```ts
type ProjectRole = 'OWNER' | 'MEMBER'
```

`canManageProject()` 只在角色为 `OWNER` 时返回 `true`。

- [ ] **步骤 4：实现项目 Store**

Store 状态固定包含：

```ts
{
  current: ProjectDetail | null
  currentUserId: string
  loading: boolean
}
```

`currentRole` getter 根据 `currentUserId` 在 `current.members` 中查找角色。

`load(projectId, userId)` 负责请求详情并设置当前用户 ID。

`clear()` 同时清空项目、当前用户 ID 和加载状态。

- [ ] **步骤 5：实现页面和组件**

项目列表页面包含：

- 关键字输入。
- 角色筛选：`全部角色`、`我负责的`、`我参与的`。
- 分页。
- 项目名称、描述、角色、更新时间。
- `新建项目` 按钮。

项目详情页面包含：

- 项目名称和描述。
- `OWNER` 可见的编辑和删除按钮。
- 成员面板。
- 预留的 `任务` 区域。

成员面板只有在 `canManage` 为 `true` 时才显示添加和删除按钮。

- [ ] **步骤 6：验证并提交**

```bash
npm test -- --run tests/permissions.test.ts tests/project-store.test.ts
npm run typecheck
npm run build
git add client
git commit -m "feat: add project and member UI"
```

---

## 任务 9：任务后端 API

**目标：** 实现任务 CRUD、筛选、分页、负责人校验和删除权限。

**涉及文件：**

- 新建：`server/src/schemas/task.schema.ts`
- 新建：`server/src/services/task.service.ts`
- 新建：`server/src/controllers/task.controller.ts`
- 新建：`server/src/routes/project-task.route.ts`
- 新建：`server/src/routes/task.route.ts`
- 修改：`server/src/app.ts`
- 修改：`server/tests/helpers/factories.ts`
- 新建：`server/tests/tasks.test.ts`

**接口：**

- 产出：`listTasks()`、`createTask()`、`getTask()`、`updateTask()`、`deleteTask()`
- 列表筛选：`keyword`、`status`、`priority`、`assigneeId`、`dueBefore`、`page`、`pageSize`

- [ ] **步骤 1：写失败测试**

必须覆盖：

- 项目成员可以创建任务。
- 按状态筛选任务。
- 非项目成员不能设置成负责人。
- 普通成员可以编辑任务。
- 普通成员不能删除他人创建的任务。
- `OWNER` 可以删除任意任务。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/tasks.test.ts
```

- [ ] **步骤 3：定义任务校验**

状态：

```ts
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
```

优先级：

```ts
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
```

创建字段：

```text
title
description
status
priority
assigneeId
dueDate
```

更新接口单独定义可选的同名字段，避免默认值在局部更新时覆盖原数据。

- [ ] **步骤 4：实现任务 Service**

所有操作先调用 `requireProjectMember()`。

创建任务前，如果存在 `assigneeId`，必须确认该用户是项目成员。

更新任务同样重新校验负责人。

删除规则：

```text
task.creatorId === currentUserId
或
membership.role === 'OWNER'
```

否则返回 `403 TASK_DELETE_FORBIDDEN`。

列表查询使用 Prisma `where` 组合筛选条件，并用事务同时执行：

```text
findMany
count
```

- [ ] **步骤 5：实现 Controller 和 Route**

路由固定为：

```text
GET    /api/v1/projects/:projectId/tasks
POST   /api/v1/projects/:projectId/tasks
GET    /api/v1/tasks/:taskId
PATCH  /api/v1/tasks/:taskId
DELETE /api/v1/tasks/:taskId
```

- [ ] **步骤 6：验证并提交**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/tasks.test.ts
npm run typecheck
git add server
git commit -m "feat: add task APIs"
```

---

## 任务 10：任务列表、筛选、表单和详情前端

**目标：** 在项目详情中管理任务，并提供任务详情页面。

**涉及文件：**

- 新建：`client/src/api/tasks.ts`
- 新建：`client/src/utils/task-query.ts`
- 新建：`client/src/components/tasks/TaskFilters.vue`
- 新建：`client/src/components/tasks/TaskTable.vue`
- 新建：`client/src/components/tasks/TaskFormDialog.vue`
- 新建：`client/src/views/tasks/TaskDetailView.vue`
- 修改：`client/src/views/projects/ProjectDetailView.vue`
- 修改：`client/src/router/index.ts`
- 新建：`client/tests/task-filters.test.ts`

**接口：**

- 产出：`taskApi`
- 产出：`toTaskQuery()`
- 路由：`/projects/:projectId/tasks/:taskId`

- [ ] **步骤 1：写筛选转换测试**

`toTaskQuery()` 必须：

- 删除空白关键字。
- 删除空状态、空优先级、空负责人和空日期。
- 始终保留 `page` 和 `pageSize`。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd client
npm test -- --run tests/task-filters.test.ts
```

- [ ] **步骤 3：实现任务 API 和查询转换**

`taskApi` 固定包含：

```text
list
create
detail
update
remove
```

筛选组件包含：

- 搜索任务。
- 状态：全部、待处理、进行中、已完成。
- 优先级：全部、低、中、高。
- 负责人。
- 截止时间早于。

- [ ] **步骤 4：实现任务表格和表单**

表格显示：

- 标题。
- 状态。
- 优先级。
- 负责人。
- 截止时间。
- 更新时间。

表单显示：

- 标题。
- 描述。
- 状态。
- 优先级。
- 负责人。
- 截止日期。

提交前把日期转换为 ISO 字符串。

- [ ] **步骤 5：集成项目详情和任务详情**

项目详情：

- 加载任务列表。
- 新建、编辑、删除任务后刷新列表。
- 点击任务跳转详情。

任务详情：

- 显示任务全部核心字段。
- 支持编辑和按权限删除。
- 预留评论和附件区域。

- [ ] **步骤 6：验证并提交**

```bash
npm test -- --run tests/task-filters.test.ts
npm run typecheck
npm run build
git add client
git commit -m "feat: add task management UI"
```

---

## 任务 11：评论后端 API

**目标：** 项目成员可以查看和发布评论，作者或项目负责人可以删除评论。

**涉及文件：**

- 新建：`server/src/schemas/comment.schema.ts`
- 新建：`server/src/services/comment.service.ts`
- 新建：`server/src/controllers/comment.controller.ts`
- 新建：`server/src/routes/task-comment.route.ts`
- 新建：`server/src/routes/comment.route.ts`
- 修改：`server/src/app.ts`
- 新建：`server/tests/comments.test.ts`

**接口：**

- 产出：评论列表、创建评论、删除评论接口。
- 评论内容长度为 1 到 2000。

- [ ] **步骤 1：写失败测试**

必须覆盖：

- 项目成员可以发布评论。
- 评论列表按创建时间正序返回。
- 评论作者可以删除。
- 项目负责人可以删除。
- 其他普通成员不能删除，返回 `403 COMMENT_DELETE_FORBIDDEN`。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/comments.test.ts
```

- [ ] **步骤 3：实现评论 Service**

查询任务后调用 `requireProjectMember()`。

删除规则：

```text
comment.authorId === currentUserId
或
membership.role === 'OWNER'
```

列表返回分页结构：

```ts
{
  items: Comment[]
  page: number
  pageSize: number
  total: number
}
```

- [ ] **步骤 4：实现路由**

```text
GET    /api/v1/tasks/:taskId/comments
POST   /api/v1/tasks/:taskId/comments
DELETE /api/v1/comments/:commentId
```

- [ ] **步骤 5：验证并提交**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/comments.test.ts
npm run typecheck
git add server
git commit -m "feat: add comment APIs"
```

---

## 任务 12：评论前端

**目标：** 在任务详情中查看、发布和删除评论。

**涉及文件：**

- 新建：`client/src/api/comments.ts`
- 新建：`client/src/components/comments/CommentForm.vue`
- 新建：`client/src/components/comments/CommentList.vue`
- 修改：`client/src/views/tasks/TaskDetailView.vue`
- 新建：`client/tests/comments.test.ts`

**接口：**

- 产出：`commentApi`
- 产出：评论表单和评论列表组件。

- [ ] **步骤 1：写失败测试**

测试 `commentApi.create()` 能正确调用：

```text
POST /tasks/:taskId/comments
```

并返回评论对象。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd client
npm test -- --run tests/comments.test.ts
```

- [ ] **步骤 3：实现评论 API 和组件**

`commentApi` 固定包含：

```text
list
create
remove
```

评论表单：

- 最大 2000 字。
- 空内容时禁用提交。
- 成功后清空输入并通知父组件。

评论列表：

- 显示作者、本地时间和内容。
- 作者或项目负责人显示删除按钮。
- 删除成功后通知父组件刷新。

- [ ] **步骤 4：集成任务详情**

任务和评论并行加载：

```ts
const [taskResult, commentResult] = await Promise.all([
  taskApi.detail(taskId),
  commentApi.list(taskId),
])
```

- [ ] **步骤 5：验证并提交**

```bash
npm test -- --run tests/comments.test.ts
npm run typecheck
npm run build
git add client
git commit -m "feat: add comment UI"
```

---

## 任务 13：附件后端 API 和文件生命周期

**目标：** 实现附件上传、下载、删除，并确保项目或任务删除时清理文件。

**涉及文件：**

- 新建：`server/src/lib/upload.ts`
- 新建：`server/src/services/attachment.service.ts`
- 新建：`server/src/controllers/attachment.controller.ts`
- 新建：`server/src/routes/task-attachment.route.ts`
- 新建：`server/src/routes/attachment.route.ts`
- 修改：`server/src/middlewares/error-handler.ts`
- 修改：`server/src/services/task.service.ts`
- 修改：`server/src/services/project.service.ts`
- 修改：`server/src/app.ts`
- 新建：`server/tests/attachments.test.ts`

**接口：**

- 产出：`upload`、`uploadAttachment()`、`downloadAttachment()`、`deleteAttachment()`
- 产出：受控附件下载接口。

- [ ] **步骤 1：安装 Multer 并写失败测试**

```bash
cd server
npm install multer
npm install -D @types/multer
```

测试必须覆盖：

- 项目成员可以上传和下载文本文件。
- 非项目成员下载返回 `403 PROJECT_MEMBER_REQUIRED`。
- 超过 5 MB 返回 `400 FILE_TOO_LARGE`。
- 非允许 MIME 类型返回 `400 FILE_TYPE_NOT_ALLOWED`。
- 超过 20 个附件返回 `400 ATTACHMENT_LIMIT_REACHED`。

- [ ] **步骤 2：运行测试并确认失败**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/attachments.test.ts
```

- [ ] **步骤 3：实现上传中间件**

Multer 使用内存存储：

```ts
multer.memoryStorage()
```

限制：

```ts
{
  fileSize: 5 * 1024 * 1024,
  files: 1
}
```

允许的 MIME：

```text
application/pdf
image/png
image/jpeg
text/plain
```

错误处理中间件需要识别：

```ts
error instanceof multer.MulterError
```

并处理 `LIMIT_FILE_SIZE`。

- [ ] **步骤 4：实现附件 Service**

上传流程：

1. 查询任务。
2. 调用 `requireProjectMember()`。
3. 检查附件数量。
4. 生成随机文件名：`${randomUUID()}${extension}`。
5. 创建上传目录。
6. 写入文件。
7. 创建附件记录。
8. 数据库创建失败时删除刚写入的文件。

下载流程：

1. 查询附件和任务。
2. 校验项目成员。
3. 读取文件。
4. 设置 `Content-Type` 和 `Content-Disposition`。
5. 返回二进制文件。

删除规则：

```text
uploaderId === currentUserId
或
task.creatorId === currentUserId
或
membership.role === 'OWNER'
```

- [ ] **步骤 5：把附件加入任务详情**

任务查询的 `include` 必须增加：

```ts
attachments: {
  include: {
    uploader: {
      select: { id: true, username: true, email: true }
    }
  },
  orderBy: { createdAt: 'desc' }
}
```

- [ ] **步骤 6：补充文件和记录清理**

删除任务前查询附件文件名，数据库删除成功后尽力删除文件。

删除项目前查询所有任务附件文件名，项目删除后尽力删除文件。

文件删除失败只记录，不回滚已经完成的数据库删除。

- [ ] **步骤 7：实现路由**

```text
POST   /api/v1/tasks/:taskId/attachments
GET    /api/v1/attachments/:attachmentId/download
DELETE /api/v1/attachments/:attachmentId
```

- [ ] **步骤 8：验证并提交**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/attachments.test.ts
npm run typecheck
git add server
git commit -m "feat: add attachment APIs"
```

---

## 任务 14：附件前端

**目标：** 在任务详情页上传、下载和删除附件。

**涉及文件：**

- 新建：`client/src/api/attachments.ts`
- 新建：`client/src/components/attachments/AttachmentPanel.vue`
- 修改：`client/src/api/tasks.ts`
- 修改：`client/src/views/tasks/TaskDetailView.vue`
- 新建：`client/tests/attachments.test.ts`

**接口：**

- 产出：`attachmentApi`
- `Task` 接口增加 `attachments: Attachment[]`

- [ ] **步骤 1：写失败测试**

测试上传时：

- 请求体是 `FormData`。
- 文件字段名为 `file`。
- 返回附件对象。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd client
npm test -- --run tests/attachments.test.ts
```

- [ ] **步骤 3：实现附件 API**

```ts
attachmentApi.upload(taskId, file)
attachmentApi.download(attachment)
attachmentApi.remove(attachmentId)
```

下载时：

- 使用 `responseType: 'blob'`。
- 创建临时对象 URL。
- 使用原始文件名触发浏览器下载。
- 下载后释放对象 URL。

- [ ] **步骤 4：实现附件面板**

面板必须：

- 只允许 `.pdf、.png、.jpg、.jpeg、.txt`。
- 前端先检查 5 MB。
- 上传成功后通知父组件。
- 显示文件名、上传者、大小和时间。
- 根据权限显示下载和删除按钮。

- [ ] **步骤 5：集成任务详情**

上传或删除后重新加载任务详情，保证附件列表以服务端数据为准。

- [ ] **步骤 6：验证并提交**

```bash
npm test -- --run tests/attachments.test.ts
npm run typecheck
npm run build
git add client
git commit -m "feat: add attachment UI"
```

---

## 任务 15：看板后端 API

**目标：** 返回当前用户可访问项目中的任务统计和最近项目。

**涉及文件：**

- 新建：`server/src/services/dashboard.service.ts`
- 新建：`server/src/controllers/dashboard.controller.ts`
- 新建：`server/src/routes/dashboard.route.ts`
- 修改：`server/src/app.ts`
- 新建：`server/tests/dashboard.test.ts`

**接口：**

- 产出：`getDashboardSummary(userId)`
- 接口：`GET /api/v1/dashboard/summary`

- [ ] **步骤 1：写失败测试**

创建一个含三个任务的项目：

- 一个 `TODO` 且已逾期。
- 一个 `IN_PROGRESS`。
- 一个 `DONE`。

断言：

```json
{
  "total": 3,
  "todo": 1,
  "inProgress": 1,
  "done": 1,
  "overdue": 1
}
```

并断言最近项目包含该项目。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/dashboard.test.ts
```

- [ ] **步骤 3：实现统计 Service**

可访问任务条件：

```ts
{
  project: {
    members: {
      some: { userId }
    }
  }
}
```

逾期条件：

```ts
{
  status: { not: 'DONE' },
  dueDate: { lt: new Date() }
}
```

返回：

```ts
{
  counts: {
    total: number
    todo: number
    inProgress: number
    done: number
    overdue: number
  }
  recentProjects: Project[]
}
```

最近项目按 `updatedAt` 降序，最多 5 条。

- [ ] **步骤 4：实现 Controller 和 Route，并验证**

```bash
DATABASE_URL=file:./test.db npm test -- --run tests/dashboard.test.ts
npm run typecheck
git add server
git commit -m "feat: add dashboard API"
```

---

## 任务 16：看板前端

**目标：** 登录后的首页显示任务统计和最近项目。

**涉及文件：**

- 新建：`client/src/api/dashboard.ts`
- 修改：`client/src/views/DashboardView.vue`
- 新建：`client/tests/dashboard.test.ts`

**接口：**

- 产出：`dashboardApi.summary()`

- [ ] **步骤 1：写失败测试**

测试调用：

```text
GET /dashboard/summary
```

并返回五个统计数字和最近项目数组。

- [ ] **步骤 2：运行测试并确认失败**

```bash
cd client
npm test -- --run tests/dashboard.test.ts
```

- [ ] **步骤 3：实现 API 和页面**

统计卡片：

```text
全部任务
待处理
进行中
已完成
逾期
```

完成进度：

```ts
total === 0 ? 0 : done / total
```

最近项目表格显示项目名、描述和更新时间，点击进入 `/projects/:projectId`。

- [ ] **步骤 4：验证并提交**

```bash
npm test -- --run tests/dashboard.test.ts
npm run typecheck
npm run build
git add client
git commit -m "feat: add dashboard UI"
```

---

## 任务 17：Playwright 端到端冒烟测试

**目标：** 用一条浏览器测试验证主要流程可以完整运行。

**涉及文件：**

- 新建：`client/playwright.config.ts`
- 新建：`client/e2e/taskflow.spec.ts`
- 修改：`client/package.json`
- 修改：`server/package.json`
- 新建：`server/scripts/prepare-e2e.ts`

**接口：**

- 产出：从 `client` 执行 `npm run test:e2e`。

- [ ] **步骤 1：安装 Playwright**

```bash
cd client
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **步骤 2：准备独立 E2E 数据库**

`server/scripts/prepare-e2e.ts`：

1. 设置 `DATABASE_URL=file:./e2e.db`。
2. 执行 `prisma db push --force-reset`。
3. 执行 `prisma db seed`。

`server` 增加：

```json
{
  "scripts": {
    "e2e:prepare": "tsx scripts/prepare-e2e.ts",
    "dev:e2e": "cross-env NODE_ENV=test DATABASE_URL=file:./e2e.db JWT_SECRET=test-secret-with-at-least-16-characters UPLOAD_DIR=./uploads/e2e CLIENT_ORIGIN=http://127.0.0.1:5173 tsx src/server.ts"
  }
}
```

安装：

```bash
cd server
npm install -D cross-env
```

- [ ] **步骤 3：先写失败的浏览器测试**

一条测试覆盖：

1. 注册。
2. 创建项目。
3. 创建任务。
4. 修改状态。
5. 添加评论。
6. 退出登录。

使用可访问标签定位：

```text
用户名
邮箱
密码
注册
项目名称
保存
任务标题
新建任务
评论内容
发布评论
退出登录
```

- [ ] **步骤 4：配置同时启动前后端**

`playwright.config.ts` 配置两个 `webServer`：

```text
server: npm run e2e:prepare && npm run dev:e2e
client: npm run dev -- --host 127.0.0.1
```

后端 `NODE_ENV=test` 时监听 `0.0.0.0`。

- [ ] **步骤 5：运行并修复选择器**

```bash
cd client
npm run test:e2e
```

如果失败，优先修复 Vue 组件的可访问标签或按钮文案，不通过脆弱的 CSS 选择器绕过。

- [ ] **步骤 6：提交**

```bash
git add client server
git commit -m "test: add end-to-end smoke test"
```

---

## 任务 18：日志、限流、完整文档和最终验证

**目标：** 完成可运行项目最后的工程化收尾。

**涉及文件：**

- 新建：`server/src/config/logger.ts`
- 修改：`server/src/app.ts`
- 修改：`server/src/routes/auth.route.ts`
- 修改：`README.md`
- 修改：`.gitignore`
- 修改：`server/.env.example`
- 根据最终验证结果修改失败实现文件

**接口：**

- 产出：结构化请求日志、登录限流、完整 README、全量验证结果。

- [ ] **步骤 1：安装日志和限流依赖**

```bash
cd server
npm install pino pino-http express-rate-limit
npm install -D @types/pino-http
```

- [ ] **步骤 2：实现日志**

测试环境日志级别为 `silent`，其他环境为 `info`。

`pino-http` 必须在 `requestContext` 之后注册，并使用：

```ts
genReqId: (_request, response) => response.locals.requestId
```

- [ ] **步骤 3：实现登录限流**

规则：

```text
窗口：60 秒
最多：10 次
```

超过限制返回：

```json
{
  "code": "RATE_LIMITED",
  "message": "登录尝试过于频繁，请稍后再试",
  "details": null,
  "requestId": "..."
}
```

- [ ] **步骤 4：完成 README**

README 必须写明：

- Node.js 和 npm 要求。
- 后端安装、环境变量、Prisma 生成、迁移和种子数据。
- 前端安装和启动。
- 后端测试和类型检查。
- 前端测试、类型检查、构建和 E2E。
- 种子账号。
- `localStorage + JWT` 的安全限制。

- [ ] **步骤 5：执行全量验证**

```bash
cd server
npm run typecheck
DATABASE_URL=file:./test.db npm test
npm run build

cd ../client
npm run typecheck
npm test
npm run build
npm run test:e2e
```

全部命令必须通过。

- [ ] **步骤 6：确认忽略规则**

```bash
git status --short
git check-ignore server/uploads server/prisma/dev.db server/.env client/dist server/dist
```

环境文件、数据库、上传文件和构建产物不能进入 Git。

- [ ] **步骤 7：提交**

```bash
git add .
git commit -m "chore: complete TaskFlow documentation and hardening"
```

---

## 最终验收清单

- [ ] 注册、登录和 JWT 鉴权正常。
- [ ] 项目 `OWNER` 和 `MEMBER` 权限由后端严格执行。
- [ ] 非项目成员不能成为任务负责人。
- [ ] 任务筛选和分页符合设计。
- [ ] 评论删除权限符合设计要求。
- [ ] 附件有大小、类型、数量和下载权限校验。
- [ ] 删除项目或任务后，数据库记录和附件文件按设计处理。
- [ ] 看板统计只包含当前用户可访问的项目。
- [ ] 前端路由守卫能够恢复和验证登录状态。
- [ ] 页面覆盖加载中、空状态、错误重试和成功反馈。
- [ ] 后端测试、前端测试和 Playwright 冒烟测试全部通过。
- [ ] README 可以让新环境从零启动项目。

## 执行顺序

严格按照任务 1 到任务 18 执行。每次只打开当前任务，完成：

1. 写测试。
2. 运行并确认失败。
3. 编写最小实现。
4. 运行并确认通过。
5. 类型检查。
6. 提交。

超出当前任务范围的优化不要顺手加入，统一留到后续任务或项目完成后讨论。
