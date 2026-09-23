# TaskFlow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Vue 3 + Element Plus + Express + Prisma task management application in one repository while keeping the learner responsible for the primary implementation and providing extra Node.js support.

**Architecture:** The repository contains independent `client` and `server` directories. The server is a layered Express API using routes, controllers, services, middleware, Zod schemas, Prisma, and SQLite. The client is a Vue application using Vite, Pinia, Vue Router, Axios, and Element Plus.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, Pinia, Axios, Element Plus, Node.js, Express, Prisma, SQLite, JWT, Zod, Multer, Vitest, Supertest, Vue Test Utils, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-23-taskflow-design.md`

## Global Constraints

- Repository root: `/Users/mingju/Desktop/练手代码/111`
- Branch: `main`
- Node.js version: 20 or newer
- Package manager: npm
- Do not use npm workspaces.
- `client` and `server` each own their `package.json`, lockfile, scripts, and environment files.
- All application code uses TypeScript with strict mode enabled.
- API prefix: `/api/v1`
- Success envelope: `{ code: "OK", message: string, data: unknown, requestId: string }`
- Error envelope: `{ code: string, message: string, details: unknown, requestId: string }`
- Authentication header: `Authorization: Bearer <token>`
- Project roles: `OWNER`, `MEMBER`
- Task statuses: `TODO`, `IN_PROGRESS`, `DONE`
- Task priorities: `LOW`, `MEDIUM`, `HIGH`
- Pagination defaults: `page=1`, `pageSize=20`, `pageSize` maximum `100`
- Upload limit: one file at a time, maximum 5 MB, maximum 20 attachments per task
- Allowed upload types: PDF, PNG, JPEG, plain text
- Uploaded files are never exposed as public static files.
- User-facing application copy is Chinese.
- Each task ends with passing focused tests, a type check, and one commit.
- Do not implement features from the out-of-scope section of the spec.

## Learning Execution Mode

This plan is executed in guided learning mode:

1. The learner writes the test and implementation code.
2. Codex explains the Node.js, Express, HTTP, Prisma, database, authentication, file-system, and testing concepts needed for the current step.
3. Codex may provide missing scaffolding, focused examples, debugging help, and test design, with extra depth on the `server` tasks.
4. The learner runs each verification command and reports the result.
5. Codex reviews the implementation against the task interfaces and test expectations.
6. The next task starts only after the current task passes and its commit is created.

The checkbox steps remain the source of truth, but they are performed collaboratively rather than delegated to an agent.

## File Structure

### Root

- `.gitignore`: ignores dependencies, builds, local databases, environment files, test output, and uploads.
- `README.md`: setup, environment, migration, seed, development, test, and build instructions.
- `docs/`: approved specification and implementation plan.

### Server

- `server/package.json`: server scripts and dependencies.
- `server/tsconfig.json`: strict TypeScript server configuration.
- `server/tsconfig.build.json`: production build configuration limited to `src`.
- `server/vitest.config.ts`: server test configuration.
- `server/.env.example`: documented server environment values.
- `server/prisma/schema.prisma`: data model.
- `server/prisma/seed.ts`: idempotent development data.
- `server/src/app.ts`: creates and configures the Express application.
- `server/src/server.ts`: starts the HTTP server and handles process shutdown.
- `server/src/config/env.ts`: validates environment variables.
- `server/src/config/logger.ts`: structured application logger.
- `server/src/lib/prisma.ts`: shared Prisma client.
- `server/src/lib/app-error.ts`: typed business error.
- `server/src/lib/response.ts`: success response helper.
- `server/src/lib/password.ts`: password hashing functions.
- `server/src/lib/jwt.ts`: JWT signing and verification.
- `server/src/lib/upload.ts`: Multer memory upload configuration and file validation.
- `server/src/middlewares/auth.ts`: bearer-token authentication.
- `server/src/middlewares/not-found.ts`: unknown-route handler.
- `server/src/middlewares/error-handler.ts`: global error serializer.
- `server/src/schemas/auth.schema.ts`: authentication request schemas.
- `server/src/schemas/project.schema.ts`: project and member request schemas.
- `server/src/schemas/task.schema.ts`: task request schemas.
- `server/src/schemas/comment.schema.ts`: comment request schemas.
- `server/src/services/auth.service.ts`: registration, login, and current-user logic.
- `server/src/services/project-access.service.ts`: project membership and owner checks.
- `server/src/services/project.service.ts`: project and member logic.
- `server/src/services/task.service.ts`: task logic.
- `server/src/services/comment.service.ts`: comment logic.
- `server/src/services/attachment.service.ts`: attachment metadata and file logic.
- `server/src/services/dashboard.service.ts`: dashboard statistics.
- `server/src/controllers/*.controller.ts`: HTTP input/output handlers.
- `server/src/routes/*.route.ts`: route declarations.
- `server/src/types/http.ts`: pagination and authenticated-request types.
- `server/tests/helpers/database.ts`: isolated database lifecycle helpers.
- `server/tests/helpers/factories.ts`: reusable test data factories.
- `server/tests/*.test.ts`: API integration tests.
- `server/scripts/prepare-e2e.ts`: resets and seeds the end-to-end database.

### Client

- `client/package.json`: client scripts and dependencies.
- `client/tsconfig.json`, `client/tsconfig.app.json`, `client/tsconfig.node.json`: strict Vue TypeScript configuration.
- `client/vite.config.ts`: Vue plugin, dev server, and test configuration.
- `client/.env.example`: documented client API base URL.
- `client/index.html`: Vite entry document.
- `client/src/main.ts`: Vue, Pinia, Router, and Element Plus bootstrap.
- `client/src/App.vue`: router outlet.
- `client/src/router/index.ts`: routes and authentication guards.
- `client/src/api/http.ts`: Axios instance and response parsing.
- `client/src/api/auth.ts`: authentication requests.
- `client/src/api/projects.ts`: project and member requests.
- `client/src/api/tasks.ts`: task requests.
- `client/src/api/comments.ts`: comment requests.
- `client/src/api/attachments.ts`: attachment requests.
- `client/src/api/dashboard.ts`: dashboard requests.
- `client/src/stores/auth.ts`: authentication state.
- `client/src/stores/project.ts`: current project state.
- `client/src/utils/auth-token.ts`: token persistence.
- `client/src/utils/permissions.ts`: UI permission helpers.
- `client/src/utils/task-query.ts`: converts task filter state into API parameters.
- `client/src/layouts/AppLayout.vue`: authenticated application shell.
- `client/src/views/auth/LoginView.vue`: login page.
- `client/src/views/auth/RegisterView.vue`: registration page.
- `client/src/views/DashboardView.vue`: statistics page.
- `client/src/views/projects/ProjectsView.vue`: project list page.
- `client/src/views/projects/ProjectDetailView.vue`: project workspace.
- `client/src/views/tasks/TaskDetailView.vue`: task detail page.
- `client/src/components/projects/*`: project dialog and member panel.
- `client/src/components/tasks/*`: task filters, table, and form dialog.
- `client/src/components/comments/*`: comment list and form.
- `client/src/components/attachments/*`: upload and attachment list.
- `client/tests/*`: Vitest tests.
- `client/e2e/*`: Playwright smoke tests.
- `client/playwright.config.ts`: end-to-end server and client orchestration.

---

### Task 1: Server Foundation and Health Check

**Files:**

- Create: `.gitignore`
- Create: `README.md`
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/tsconfig.build.json`
- Create: `server/vitest.config.ts`
- Create: `server/.env.example`
- Create: `server/src/config/env.ts`
- Create: `server/src/app.ts`
- Create: `server/src/server.ts`
- Create: `server/src/routes/health.route.ts`
- Create: `server/tests/health.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `createApp(): Express`, `env`, and `GET /api/v1/health`.

- [ ] **Step 1: Initialize the server and install the foundation dependencies**

Run:

```bash
mkdir -p server/src/config server/src/routes server/tests
cd server
npm init -y
npm install express cors helmet dotenv zod
npm install -D typescript tsx vitest supertest @types/node @types/express @types/cors @types/supertest
```

Expected: `server/package.json` and `server/package-lock.json` exist.

- [ ] **Step 2: Write the failing health test**

Create `server/tests/health.test.ts`:

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

- [ ] **Step 3: Run the test and verify it fails**

Run: `cd server && npm test -- --run tests/health.test.ts`

Expected: FAIL because `../src/app` does not exist.

- [ ] **Step 4: Create the server configuration and health route**

Set scripts in `server/package.json`:

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

Create `server/tsconfig.json`:

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

Create `server/tsconfig.build.json`:

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

Create `server/vitest.config.ts`:

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

Create `server/.env.example`:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=replace-with-a-long-random-value
JWT_EXPIRES_IN=2h
UPLOAD_DIR=./uploads
CLIENT_ORIGIN=http://localhost:5173
```

Create `server/src/config/env.ts`:

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

Create `server/src/routes/health.route.ts`:

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

Create `server/src/app.ts`:

```ts
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { healthRouter } from './routes/health.route.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.CLIENT_ORIGIN }))
  app.use(express.json({ limit: '1mb' }))
  app.use('/api/v1', healthRouter)

  return app
}
```

Create `server/src/server.ts`:

```ts
import { createServer } from 'node:http'
import { createApp } from './app.js'
import { env } from './config/env.js'

const server = createServer(createApp())

server.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`)
})
```

- [ ] **Step 5: Run the health test and type check**

Run:

```bash
cd server
npm test -- --run tests/health.test.ts
npm run typecheck
```

Expected: one passing test and no TypeScript errors.

- [ ] **Step 6: Add repository ignores and initial documentation**

Create `.gitignore`:

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

Create `README.md`:

```markdown
# TaskFlow

Vue 3 + Element Plus + Express + Prisma 全栈练手项目。

## 目录

- `client`: 前端应用
- `server`: 后端 API
- `docs`: 设计和实施文档

## 后端启动

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

健康检查地址：`http://localhost:3000/api/v1/health`
```

- [ ] **Step 7: Commit**

```bash
git add .gitignore README.md server
git commit -m "chore: scaffold TaskFlow server"
```

---

### Task 2: Error Handling, Request IDs, and Logging

**Files:**

- Create: `server/src/lib/app-error.ts`
- Create: `server/src/lib/response.ts`
- Create: `server/src/middlewares/not-found.ts`
- Create: `server/src/middlewares/error-handler.ts`
- Create: `server/src/middlewares/request-context.ts`
- Create: `server/src/types/express.d.ts`
- Modify: `server/src/app.ts`
- Modify: `server/src/routes/health.route.ts`
- Test: `server/tests/error-handling.test.ts`

**Interfaces:**

- Consumes: `createApp()` from Task 1.
- Produces: `AppError`, `sendSuccess(res, data, message?)`, `errorHandler`, `notFoundHandler`, and `requestContext`.

- [ ] **Step 1: Write the failing error tests**

Create `server/tests/error-handling.test.ts`:

```ts
import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { AppError } from '../src/lib/app-error'
import { errorHandler } from '../src/middlewares/error-handler'

function appWithError(error: unknown) {
  const app = express()
  app.get('/error', () => {
    throw error
  })
  app.use(errorHandler)
  return app
}

describe('error handler', () => {
  it('serializes an AppError', async () => {
    const response = await request(
      appWithError(new AppError(403, 'FORBIDDEN', 'forbidden')),
    ).get('/error')

    expect(response.status).toBe(403)
    expect(response.body).toMatchObject({
      code: 'FORBIDDEN',
      message: 'forbidden',
      details: null,
    })
    expect(response.body.requestId).toBeTypeOf('string')
  })

  it('does not leak unknown errors', async () => {
    const response = await request(appWithError(new Error('secret'))).get('/error')

    expect(response.status).toBe(500)
    expect(response.body.code).toBe('INTERNAL_ERROR')
    expect(response.body.message).toBe('服务器内部错误')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd server && npm test -- --run tests/error-handling.test.ts`

Expected: FAIL because `AppError` and `errorHandler` do not exist.

- [ ] **Step 3: Implement the error primitives**

Create `server/src/lib/app-error.ts`:

```ts
export class AppError extends Error {
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
```

Create `server/src/lib/response.ts`:

```ts
import type { Response } from 'express'

export function sendSuccess<T>(
  response: Response,
  data: T,
  message = 'success',
) {
  response.json({
    code: 'OK',
    message,
    data,
    requestId: response.locals.requestId,
  })
}
```

- [ ] **Step 4: Implement request IDs, 404 handling, and the global error handler**

Create `server/src/types/express.d.ts`:

```ts
import type { AuthUser } from '../middlewares/auth'

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser
    }
  }
}

export {}
```

Temporarily create `server/src/middlewares/auth.ts` so the type import resolves:

```ts
export interface AuthUser {
  userId: string
}
```

Create `server/src/middlewares/request-context.ts`:

```ts
import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

export function requestContext(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  response.locals.requestId = randomUUID()
  next()
}
```

Create `server/src/middlewares/not-found.ts`:

```ts
import type { Request, Response } from 'express'
import { AppError } from '../lib/app-error.js'

export function notFoundHandler(_request: Request, _response: Response) {
  throw new AppError(404, 'ROUTE_NOT_FOUND', '接口不存在')
}
```

Create `server/src/middlewares/error-handler.ts`:

```ts
import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../lib/app-error.js'

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  const requestId = response.locals.requestId ?? 'unknown'

  if (error instanceof AppError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      details: error.details,
      requestId,
    })
    return
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      code: 'VALIDATION_ERROR',
      message: '请求参数错误',
      details: error.flatten(),
      requestId,
    })
    return
  }

  console.error(error)
  response.status(500).json({
    code: 'INTERNAL_ERROR',
    message: '服务器内部错误',
    details: null,
    requestId,
  })
}
```

- [ ] **Step 5: Wire middleware into the app and use the shared response helper**

Modify `server/src/app.ts`:

```ts
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/error-handler.js'
import { notFoundHandler } from './middlewares/not-found.js'
import { requestContext } from './middlewares/request-context.js'
import { healthRouter } from './routes/health.route.js'

export function createApp() {
  const app = express()

  app.use(requestContext)
  app.use(helmet())
  app.use(cors({ origin: env.CLIENT_ORIGIN }))
  app.use(express.json({ limit: '1mb' }))
  app.use('/api/v1', healthRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
```

Modify `server/src/routes/health.route.ts` to use `sendSuccess`:

```ts
import { Router } from 'express'
import { sendSuccess } from '../lib/response.js'

export const healthRouter = Router()

healthRouter.get('/health', (_request, response) => {
  sendSuccess(response, { status: 'ok' })
})
```

- [ ] **Step 6: Re-run tests and type check**

Run:

```bash
cd server
npm test -- --run tests/health.test.ts tests/error-handling.test.ts
npm run typecheck
```

Expected: all tests pass and TypeScript reports no errors.

- [ ] **Step 7: Commit**

```bash
git add server
git commit -m "feat: add API error handling foundation"
```

---

### Task 3: Prisma Schema, Migration, Test Database, and Seed

**Files:**

- Create: `server/prisma/schema.prisma`
- Create: `server/prisma/seed.ts`
- Create: `server/src/lib/prisma.ts`
- Create: `server/tests/helpers/database.ts`
- Create: `server/tests/helpers/factories.ts`
- Create: `server/tests/seed.test.ts`
- Modify: `server/package.json`
- Modify: `server/.env.example`

**Interfaces:**

- Consumes: `env` and `AppError`.
- Produces: the shared `prisma` client, all data models, `resetDatabase()`, `createUser()`, `createProjectWithOwner()`, and `/api/v1/health`.

- [ ] **Step 1: Install and initialize Prisma**

Run:

```bash
cd server
npm install @prisma/client bcryptjs
npm install -D prisma tsx @types/bcryptjs
npx prisma init --datasource-provider sqlite
```

Expected: `server/prisma/schema.prisma` exists.

- [ ] **Step 2: Write the failing seed test**

Create `server/tests/seed.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../src/lib/prisma'
import { createUser } from './helpers/factories'
import { resetDatabase } from './helpers/database'

beforeEach(resetDatabase)

describe('database test helpers', () => {
  it('creates isolated test users', async () => {
    const user = await createUser({ email: 'owner@example.com' })
    const count = await prisma.user.count()

    expect(user.email).toBe('owner@example.com')
    expect(count).toBe(1)
  })
})
```

- [ ] **Step 3: Run the test and verify it fails**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/seed.test.ts
```

Expected: FAIL because the Prisma models and helpers do not exist.

- [ ] **Step 4: Define the complete Prisma schema**

Replace `server/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id             String          @id @default(cuid())
  email          String          @unique
  username       String          @unique
  passwordHash   String
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  projectMembers ProjectMember[]
  createdTasks   Task[]          @relation("TaskCreator")
  assignedTasks  Task[]          @relation("TaskAssignee")
  comments       Comment[]
  attachments    Attachment[]
}

model Project {
  id          String          @id @default(cuid())
  name        String
  description String          @default("")
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  members     ProjectMember[]
  tasks       Task[]
}

model ProjectMember {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  role      String
  createdAt DateTime @default(now())
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([projectId])
  @@index([userId])
}

model Task {
  id          String       @id @default(cuid())
  projectId   String
  title       String
  description String       @default("")
  status      String       @default("TODO")
  priority    String       @default("MEDIUM")
  assigneeId  String?
  creatorId   String
  dueDate     DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee    User?        @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  creator     User         @relation("TaskCreator", fields: [creatorId], references: [id], onDelete: Restrict)
  comments    Comment[]
  attachments Attachment[]

  @@index([projectId])
  @@index([status])
  @@index([assigneeId])
  @@index([dueDate])
}

model Comment {
  id        String   @id @default(cuid())
  taskId    String
  authorId  String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Restrict)

  @@index([taskId])
}

model Attachment {
  id           String   @id @default(cuid())
  taskId       String
  uploaderId   String
  originalName String
  storedName   String   @unique
  mimeType     String
  size         Int
  createdAt    DateTime @default(now())
  task         Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  uploader     User     @relation(fields: [uploaderId], references: [id], onDelete: Restrict)

  @@index([taskId])
}
```

- [ ] **Step 5: Create the Prisma client and database test helpers**

Create `server/src/lib/prisma.ts`:

```ts
import { PrismaClient } from '@prisma/client'

declare global {
  var __taskflowPrisma: PrismaClient | undefined
}

export const prisma = globalThis.__taskflowPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__taskflowPrisma = prisma
}
```

Create `server/tests/helpers/database.ts`:

```ts
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { env } from '../../src/config/env'
import { prisma } from '../../src/lib/prisma'

export async function resetDatabase() {
  await prisma.attachment.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
  await rm(resolve(env.UPLOAD_DIR), { recursive: true, force: true })
}
```

Create `server/tests/helpers/factories.ts`:

```ts
import { prisma } from '../../src/lib/prisma'
import { hashPassword } from '../../src/lib/password'

export async function createUser(
  overrides: Partial<{ email: string; username: string; password: string }> = {},
) {
  const suffix = crypto.randomUUID().slice(0, 8)
  return prisma.user.create({
    data: {
      email: overrides.email ?? `user-${suffix}@example.com`,
      username: overrides.username ?? `user_${suffix}`,
      passwordHash: await hashPassword(overrides.password ?? 'password123'),
    },
  })
}

export async function createProjectWithOwner(
  userId: string,
  overrides: Partial<{ name: string; description: string }> = {},
) {
  return prisma.project.create({
    data: {
      name: overrides.name ?? 'Test Project',
      description: overrides.description ?? '',
      members: {
        create: { userId, role: 'OWNER' },
      },
    },
  })
}
```

Create `server/src/lib/password.ts` now because factories depend on it:

```ts
import bcrypt from 'bcryptjs'

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}
```

- [ ] **Step 6: Configure migration and seed scripts**

Add to `server/package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:generate": "prisma generate"
  }
}
```

- [ ] **Step 7: Create the idempotent development seed**

Create `server/prisma/seed.ts`:

```ts
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/password'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await hashPassword('password123')

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: { username: 'owner' },
    create: { email: 'owner@example.com', username: 'owner', passwordHash },
  })

  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: { username: 'member' },
    create: { email: 'member@example.com', username: 'member', passwordHash },
  })

  await prisma.project.upsert({
    where: { id: 'seed-project' },
    update: { name: 'TaskFlow 示例项目' },
    create: {
      id: 'seed-project',
      name: 'TaskFlow 示例项目',
      description: '用于本地开发和学习的数据',
      members: {
        create: [
          { userId: owner.id, role: 'OWNER' },
          { userId: member.id, role: 'MEMBER' },
        ],
      },
      tasks: {
        create: [
          {
            id: 'seed-task-todo',
            title: '完成项目基础搭建',
            status: 'TODO',
            priority: 'HIGH',
            creatorId: owner.id,
            assigneeId: member.id,
          },
          {
            id: 'seed-task-progress',
            title: '联调任务列表',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            creatorId: owner.id,
            assigneeId: owner.id,
          },
          {
            id: 'seed-task-done',
            title: '确认接口格式',
            status: 'DONE',
            priority: 'LOW',
            creatorId: owner.id,
            assigneeId: member.id,
          },
        ],
      },
    },
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
```

- [ ] **Step 8: Generate, migrate, seed, and run tests**

Run:

```bash
cd server
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
DATABASE_URL=file:./test.db npx prisma db push
DATABASE_URL=file:./test.db npm test -- --run tests/seed.test.ts
npm run db:seed
```

Expected: the test passes and the seed creates two users, one project, and three tasks.

- [ ] **Step 9: Commit**

```bash
git add server
git commit -m "feat: add Prisma data model and seed"
```

---

### Task 4: Authentication API

**Files:**

- Create: `server/src/lib/jwt.ts`
- Create: `server/src/schemas/auth.schema.ts`
- Create: `server/src/services/auth.service.ts`
- Create: `server/src/controllers/auth.controller.ts`
- Create: `server/src/routes/auth.route.ts`
- Modify: `server/src/middlewares/auth.ts`
- Modify: `server/src/routes/health.route.ts`
- Modify: `server/src/app.ts`
- Test: `server/tests/auth.test.ts`

**Interfaces:**

- Consumes: `prisma`, `AppError`, `hashPassword`, `verifyPassword`, `sendSuccess`, and `env`.
- Produces: `register(input)`, `login(input)`, `getCurrentUser(userId)`, `requireAuth`, `POST /auth/register`, `POST /auth/login`, and `GET /auth/me`.

- [ ] **Step 1: Write failing authentication tests**

Create `server/tests/auth.test.ts`:

```ts
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app'
import { resetDatabase } from './helpers/database'
import { createUser } from './helpers/factories'

const app = createApp()

beforeEach(resetDatabase)

describe('authentication', () => {
  it('registers and returns a token', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      username: 'learner',
      email: 'learner@example.com',
      password: 'password123',
    })

    expect(response.status).toBe(201)
    expect(response.body.data.user.email).toBe('learner@example.com')
    expect(response.body.data.token).toBeTypeOf('string')
  })

  it('rejects a duplicate email', async () => {
    await createUser({ email: 'used@example.com', username: 'used' })
    const response = await request(app).post('/api/v1/auth/register').send({
      username: 'other',
      email: 'used@example.com',
      password: 'password123',
    })

    expect(response.status).toBe(409)
    expect(response.body.code).toBe('EMAIL_ALREADY_EXISTS')
  })

  it('logs in and returns the current user', async () => {
    await createUser({
      email: 'member@example.com',
      username: 'member',
      password: 'password123',
    })

    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'member@example.com',
      password: 'password123',
    })
    const me = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${login.body.data.token}`)

    expect(me.status).toBe(200)
    expect(me.body.data.username).toBe('member')
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/auth.test.ts
```

Expected: FAIL with 404 because the authentication routes do not exist.

- [ ] **Step 3: Implement JWT and Zod validation**

Create `server/src/lib/jwt.ts`:

```ts
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export interface AccessTokenPayload {
  sub: string
}

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload
}
```

Create `server/src/schemas/auth.schema.ts`:

```ts
import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(20),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(72),
})

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(72),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
```

Install JWT:

```bash
cd server
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

- [ ] **Step 4: Implement the authentication service**

Create `server/src/services/auth.service.ts`:

```ts
import { AppError } from '../lib/app-error.js'
import { signAccessToken } from '../lib/jwt.js'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { prisma } from '../lib/prisma.js'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js'

function publicUser(user: {
  id: string
  email: string
  username: string
  createdAt: Date
}) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  }
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }],
    },
  })

  if (existing?.email === input.email) {
    throw new AppError(409, 'EMAIL_ALREADY_EXISTS', '邮箱已被使用')
  }
  if (existing) {
    throw new AppError(409, 'USERNAME_ALREADY_EXISTS', '用户名已被使用')
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      passwordHash: await hashPassword(input.password),
    },
  })

  return { token: signAccessToken(user.id), user: publicUser(user) }
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  const valid = user && (await verifyPassword(input.password, user.passwordHash))

  if (!valid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', '邮箱或密码错误')
  }

  return { token: signAccessToken(user.id), user: publicUser(user) }
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', '登录状态已失效')
  }
  return publicUser(user)
}
```

- [ ] **Step 5: Implement auth middleware, controller, and routes**

Replace `server/src/middlewares/auth.ts`:

```ts
import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../lib/app-error.js'
import { verifyAccessToken } from '../lib/jwt.js'

export interface AuthUser {
  userId: string
}

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const header = request.header('Authorization')

  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'UNAUTHORIZED', '请先登录'))
    return
  }

  try {
    const payload = verifyAccessToken(header.slice(7))
    request.auth = { userId: payload.sub }
    next()
  } catch {
    next(new AppError(401, 'TOKEN_EXPIRED', '登录已过期，请重新登录'))
  }
}
```

Create `server/src/controllers/auth.controller.ts`:

```ts
import type { Request, Response } from 'express'
import { sendSuccess } from '../lib/response.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'
import * as authService from '../services/auth.service.js'

export async function register(request: Request, response: Response) {
  const result = await authService.register(registerSchema.parse(request.body))
  sendSuccess(response, result, '注册成功')
}

export async function login(request: Request, response: Response) {
  const result = await authService.login(loginSchema.parse(request.body))
  sendSuccess(response, result, '登录成功')
}

export async function me(request: Request, response: Response) {
  const user = await authService.getCurrentUser(request.auth!.userId)
  sendSuccess(response, user)
}
```

Need status 201 for registration. Add `response.status(201)` before `sendSuccess`:

```ts
response.status(201)
sendSuccess(response, result, '注册成功')
```

Create `server/src/routes/auth.route.ts`:

```ts
import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const authRouter = Router()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/me', requireAuth, authController.me)
```

Modify `server/src/app.ts`:

```ts
import { authRouter } from './routes/auth.route.js'

app.use('/api/v1/auth', authRouter)
```

- [ ] **Step 6: Run focused tests and type check**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/auth.test.ts
npm run typecheck
```

Expected: registration, duplicate-email, login, and current-user tests pass.

- [ ] **Step 7: Commit**

```bash
git add server
git commit -m "feat: add JWT authentication API"
```

---

### Task 5: Client Foundation and Application Shell

**Files:**

- Create: `client/package.json`
- Create: `client/tsconfig.json`
- Create: `client/tsconfig.app.json`
- Create: `client/tsconfig.node.json`
- Create: `client/vite.config.ts`
- Create: `client/.env.example`
- Create: `client/index.html`
- Create: `client/src/env.d.ts`
- Create: `client/src/styles/base.css`
- Create: `client/src/main.ts`
- Create: `client/src/App.vue`
- Create: `client/src/router/index.ts`
- Create: `client/src/views/HomeView.vue`
- Test: `client/tests/app-shell.test.ts`

**Interfaces:**

- Consumes: the backend API from Tasks 1-4 when running locally.
- Produces: Vue application bootstrap, router, base styles, and `/` shell route.

- [ ] **Step 1: Create client configuration and test dependencies**

Run:

```bash
mkdir -p client/src/router client/src/views client/tests
cd client
npm init -y
npm install vue vue-router pinia axios element-plus
npm install -D typescript vite @vitejs/plugin-vue vue-tsc vitest @vue/test-utils jsdom
```

Set `client/package.json` scripts:

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

- [ ] **Step 2: Write the failing app-shell test**

Create `client/tests/app-shell.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../src/App.vue'
import { router } from '../src/router'

describe('App', () => {
  it('renders the current route', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('TaskFlow')
  })
})
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `cd client && npm test -- --run tests/app-shell.test.ts`

Expected: FAIL because the Vue application files do not exist.

- [ ] **Step 4: Create Vite and TypeScript configuration**

Create `client/tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `client/tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "tests/**/*.ts"]
}
```

Create `client/tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true
  },
  "include": ["vite.config.ts"]
}
```

Create `client/vite.config.ts`:

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

Create `client/.env.example`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

- [ ] **Step 5: Create the application shell**

Create `client/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskFlow</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Create `client/src/env.d.ts`:

```ts
/// <reference types="vite/client" />
```

Create `client/src/styles/base.css`:

```css
:root {
  font-family:
    Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  color: #1f2937;
  background: #f5f7fa;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
textarea,
select {
  font: inherit;
}
```

Create `client/src/views/HomeView.vue`:

```vue
<template>
  <main class="home">
    <h1>TaskFlow</h1>
    <p>任务与项目协作台</p>
  </main>
</template>

<style scoped>
.home {
  padding: 48px;
}
</style>
```

Create `client/src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

Create `client/src/App.vue`:

```vue
<template>
  <RouterView />
</template>
```

Create `client/src/main.ts`:

```ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/base.css'

createApp(App).use(createPinia()).use(router).use(ElementPlus).mount('#app')
```

- [ ] **Step 6: Run the test, type check, and build**

Run:

```bash
cd client
npm test -- --run tests/app-shell.test.ts
npm run typecheck
npm run build
```

Expected: test, type check, and production build pass.

- [ ] **Step 7: Commit**

```bash
git add client
git commit -m "chore: scaffold TaskFlow client"
```

---

### Task 6: Login, Registration, Token Handling, and Route Guards

**Files:**

- Create: `client/src/utils/auth-token.ts`
- Create: `client/src/api/http.ts`
- Create: `client/src/api/auth.ts`
- Create: `client/src/stores/auth.ts`
- Create: `client/src/layouts/AppLayout.vue`
- Create: `client/src/views/auth/LoginView.vue`
- Create: `client/src/views/auth/RegisterView.vue`
- Create: `client/src/views/DashboardView.vue`
- Modify: `client/src/router/index.ts`
- Modify: `client/src/App.vue`
- Modify: `client/tests/app-shell.test.ts`
- Test: `client/tests/auth.test.ts`
- Test: `client/tests/http.test.ts`

**Interfaces:**

- Consumes: the auth API and health API from the server.
- Produces: `getAccessToken()`, `setAccessToken()`, `clearAccessToken()`, `apiRequest<T>()`, `authApi`, `useAuthStore()`, guarded `/login`, `/register`, and `/dashboard`.

- [ ] **Step 1: Install Axios test support and write failing HTTP tests**

Run:

```bash
cd client
npm install -D axios-mock-adapter
```

Create `client/tests/http.test.ts`:

```ts
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiRequest, http } from '../src/api/http'
import { clearAccessToken, setAccessToken } from '../src/utils/auth-token'

const mock = new MockAdapter(http)

beforeEach(() => {
  clearAccessToken()
  mock.reset()
})

afterEach(clearAccessToken)

describe('http client', () => {
  it('adds the token and unwraps successful data', async () => {
    setAccessToken('test-token')
    mock.onGet('/protected').reply((config) => [
      200,
      {
        code: 'OK',
        message: 'success',
        data: { value: 42 },
        requestId: 'request-1',
      },
      { 'x-test-authorization': config.headers?.Authorization },
    ])

    const data = await apiRequest<{ value: number }>({
      method: 'GET',
      url: '/protected',
    })

    expect(data.value).toBe(42)
    expect(mock.history.get[0].headers?.Authorization).toBe('Bearer test-token')
  })

  it('throws a typed ApiError', async () => {
    mock.onGet('/missing').reply(404, {
      code: 'ROUTE_NOT_FOUND',
      message: '接口不存在',
      details: null,
      requestId: 'request-2',
    })

    await expect(
      apiRequest({ method: 'GET', url: '/missing' }),
    ).rejects.toMatchObject({
      code: 'ROUTE_NOT_FOUND',
      status: 404,
    })
  })
})
```

- [ ] **Step 2: Run the HTTP tests and verify they fail**

Run: `cd client && npm test -- --run tests/http.test.ts`

Expected: FAIL because the HTTP client does not exist.

- [ ] **Step 3: Implement token persistence and the HTTP client**

Create `client/src/utils/auth-token.ts`:

```ts
const TOKEN_KEY = 'taskflow.access-token'

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
}
```

Create `client/src/api/http.ts`:

```ts
import axios, { type AxiosRequestConfig } from 'axios'
import { clearAccessToken, getAccessToken } from '../utils/auth-token'

interface ApiEnvelope<T> {
  code: string
  message: string
  data: T
  requestId: string
}

interface ApiErrorBody {
  code?: string
  message?: string
  details?: unknown
  requestId?: string
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
    public readonly requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  timeout: 10_000,
})

http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined
    const body = (error.response?.data ?? {}) as ApiErrorBody

    if (status === 401) {
      clearAccessToken()
      window.dispatchEvent(new Event('auth:expired'))
    }

    return Promise.reject(
      new ApiError(
        body.code ?? 'NETWORK_ERROR',
        body.message ?? '网络请求失败',
        status,
        body.details,
        body.requestId,
      ),
    )
  },
)

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<ApiEnvelope<T>>(config)
  return response.data.data
}
```

Create `client/src/api/auth.ts`:

```ts
import { apiRequest } from './http'

export interface User {
  id: string
  email: string
  username: string
  createdAt: string
}

export interface AuthResult {
  token: string
  user: User
}

export const authApi = {
  register(input: { username: string; email: string; password: string }) {
    return apiRequest<AuthResult>({
      method: 'POST',
      url: '/auth/register',
      data: input,
    })
  },
  login(input: { email: string; password: string }) {
    return apiRequest<AuthResult>({
      method: 'POST',
      url: '/auth/login',
      data: input,
    })
  },
  me() {
    return apiRequest<User>({ method: 'GET', url: '/auth/me' })
  },
}
```

- [ ] **Step 4: Write the failing authentication store test**

Create `client/tests/auth.test.ts`:

```ts
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '../src/api/auth'
import { useAuthStore } from '../src/stores/auth'
import { getAccessToken } from '../src/utils/auth-token'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  vi.restoreAllMocks()
})

describe('auth store', () => {
  it('stores the token and user after login', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue({
      token: 'token-1',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        username: 'user',
        createdAt: '2026-09-23T00:00:00.000Z',
      },
    })

    const store = useAuthStore()
    await store.login({ email: 'user@example.com', password: 'password123' })

    expect(store.user?.username).toBe('user')
    expect(getAccessToken()).toBe('token-1')
  })

  it('clears state on logout', () => {
    localStorage.setItem('taskflow.access-token', 'token-1')
    const store = useAuthStore()

    store.logout()

    expect(store.user).toBeNull()
    expect(getAccessToken()).toBeNull()
  })
})
```

- [ ] **Step 5: Implement the authentication store**

Create `client/src/stores/auth.ts`:

```ts
import { defineStore } from 'pinia'
import { authApi, type User } from '../api/auth'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../utils/auth-token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user && getAccessToken()),
  },
  actions: {
    async login(input: { email: string; password: string }) {
      const result = await authApi.login(input)
      setAccessToken(result.token)
      this.user = result.user
      this.initialized = true
    },
    async register(input: {
      username: string
      email: string
      password: string
    }) {
      const result = await authApi.register(input)
      setAccessToken(result.token)
      this.user = result.user
      this.initialized = true
    },
    async bootstrap() {
      if (this.initialized) return
      if (!getAccessToken()) {
        this.initialized = true
        return
      }
      try {
        this.user = await authApi.me()
      } catch {
        clearAccessToken()
        this.user = null
      } finally {
        this.initialized = true
      }
    },
    logout() {
      clearAccessToken()
      this.user = null
      this.initialized = true
    },
  },
})
```

- [ ] **Step 6: Add auth pages, application layout, and route guard**

Create `client/src/layouts/AppLayout.vue` with a sidebar and logout action:

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  auth.logout()
  await router.push('/login')
}
</script>

<template>
  <el-container class="app-layout">
    <el-aside width="220px">
      <div class="brand">TaskFlow</div>
      <el-menu router :default-active="$route.path">
        <el-menu-item index="/dashboard">总览</el-menu-item>
        <el-menu-item index="/projects">项目</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="app-header">
        <span>{{ auth.user?.username }}</span>
        <el-button text @click="logout">退出登录</el-button>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-layout > .el-aside {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

.brand {
  padding: 24px 20px;
  font-size: 20px;
  font-weight: 700;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}
</style>
```

Create `client/src/views/auth/LoginView.vue`:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiError } from '../../api/http'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const form = reactive({ email: '', password: '' })

async function submit() {
  loading.value = true
  errorMessage.value = ''
  try {
    await auth.login(form)
    await router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <el-card class="auth-card">
      <h1>登录 TaskFlow</h1>
      <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
      <el-form label-position="top" @submit.prevent="submit">
        <el-form-item label="邮箱">
          <el-input v-model="form.email" type="email" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">
          登录
        </el-button>
        <RouterLink to="/register">注册账号</RouterLink>
      </el-form>
    </el-card>
  </main>
</template>

<style scoped>
.auth-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
}

.auth-card {
  width: min(420px, 100%);
}
</style>
```

Create `client/src/views/auth/RegisterView.vue` with the same structure and these form fields:

```ts
const form = reactive({ username: '', email: '', password: '' })
```

Submit with `await auth.register(form)` and route to `/dashboard`.

Create `client/src/views/DashboardView.vue` initially:

```vue
<template>
  <section>
    <h1>工作台</h1>
    <p>总览数据将在看板任务中接入。</p>
  </section>
</template>
```

Modify `client/src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.bootstrap()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})
```

Modify `client/src/main.ts` to install Pinia before the router, because the guard uses the store:

```ts
const pinia = createPinia()

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')
```

Modify `client/tests/app-shell.test.ts` so the mounted test app installs Pinia:

```ts
import { createPinia } from 'pinia'

const wrapper = mount(App, {
  global: { plugins: [createPinia(), router] },
})
```

- [ ] **Step 7: Run tests, type check, and build**

Run:

```bash
cd client
npm test -- --run tests/http.test.ts tests/auth.test.ts
npm run typecheck
npm run build
```

Expected: tests, type check, and build pass.

- [ ] **Step 8: Commit**

```bash
git add client
git commit -m "feat: add client authentication flow"
```

---

### Task 7: Projects and Members API

**Files:**

- Create: `server/src/types/http.ts`
- Create: `server/src/schemas/project.schema.ts`
- Create: `server/src/services/project-access.service.ts`
- Create: `server/src/services/project.service.ts`
- Create: `server/src/controllers/project.controller.ts`
- Create: `server/src/routes/project.route.ts`
- Create: `server/tests/helpers/auth.ts`
- Modify: `server/src/app.ts`
- Test: `server/tests/projects.test.ts`

**Interfaces:**

- Consumes: `requireAuth`, `prisma`, `AppError`, `sendSuccess`, `createUser()`, and JWT helpers.
- Produces: `Paginated<T>`, `paginationSchema`, `requireProjectMember()`, `requireProjectOwner()`, and project/member HTTP routes.

- [ ] **Step 1: Write failing project and member tests**

Create `server/tests/helpers/auth.ts`:

```ts
import { signAccessToken } from '../../src/lib/jwt'
import { createUser } from './factories'

export async function createAuthenticatedUser(
  overrides: Partial<{ email: string; username: string; password: string }> = {},
) {
  const user = await createUser(overrides)
  return { user, token: signAccessToken(user.id) }
}
```

Create `server/tests/projects.test.ts`:

```ts
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app'
import { prisma } from '../src/lib/prisma'
import { createAuthenticatedUser } from './helpers/auth'
import { resetDatabase } from './helpers/database'
import { createProjectWithOwner } from './helpers/factories'

const app = createApp()

beforeEach(resetDatabase)

describe('projects', () => {
  it('creates a project and writes the owner membership', async () => {
    const { token } = await createAuthenticatedUser()

    const response = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'First project', description: 'Learning' })

    expect(response.status).toBe(201)
    expect(response.body.data.name).toBe('First project')
    expect(response.body.data.members[0].role).toBe('OWNER')
  })

  it('does not expose a project to a non-member', async () => {
    const owner = await createAuthenticatedUser()
    const outsider = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)

    const response = await request(app)
      .get(`/api/v1/projects/${project.id}`)
      .set('Authorization', `Bearer ${outsider.token}`)

    expect(response.status).toBe(403)
    expect(response.body.code).toBe('PROJECT_MEMBER_REQUIRED')
  })

  it('allows only an owner to add and remove a member', async () => {
    const owner = await createAuthenticatedUser()
    const member = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)

    const added = await request(app)
      .post(`/api/v1/projects/${project.id}/members`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ identifier: member.user.email })

    expect(added.status).toBe(201)

    const forbidden = await request(app)
      .delete(`/api/v1/projects/${project.id}/members/${member.user.id}`)
      .set('Authorization', `Bearer ${member.token}`)

    expect(forbidden.status).toBe(403)
    expect(forbidden.body.code).toBe('PROJECT_OWNER_REQUIRED')
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/projects.test.ts
```

Expected: FAIL with 404 because project routes do not exist.

- [ ] **Step 3: Add pagination types and project schemas**

Create `server/src/types/http.ts`:

```ts
export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}
```

Create `server/src/schemas/project.schema.ts`:

```ts
import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export const projectListQuerySchema = paginationSchema.extend({
  keyword: z.string().trim().optional(),
  role: z.enum(['OWNER', 'MEMBER']).optional(),
})

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(1000).default(''),
})

export const projectUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    description: z.string().trim().max(1000).optional(),
  })
  .refine(
  (value) => Object.keys(value).length > 0,
  '至少提供一个需要修改的字段',
  )

export const memberCreateSchema = z.object({
  identifier: z.string().trim().min(1),
})

export type ProjectListQuery = z.infer<typeof projectListQuerySchema>
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
```

- [ ] **Step 4: Implement project access checks**

Create `server/src/services/project-access.service.ts`:

```ts
import type { Prisma } from '@prisma/client'
import { AppError } from '../lib/app-error.js'
import { prisma } from '../lib/prisma.js'

export async function requireProjectMember(
  projectId: string,
  userId: string,
) {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  })

  if (!membership) {
    throw new AppError(403, 'PROJECT_MEMBER_REQUIRED', '你没有访问该项目')
  }

  return membership
}

export async function requireProjectOwner(projectId: string, userId: string) {
  const membership = await requireProjectMember(projectId, userId)

  if (membership.role !== 'OWNER') {
    throw new AppError(403, 'PROJECT_OWNER_REQUIRED', '只有项目负责人可以执行此操作')
  }

  return membership
}
```

- [ ] **Step 5: Implement the project and member service**

Create `server/src/services/project.service.ts`:

```ts
import { AppError } from '../lib/app-error.js'
import { prisma } from '../lib/prisma.js'
import type {
  ProjectCreateInput,
  ProjectListQuery,
  ProjectUpdateInput,
} from '../schemas/project.schema.js'
import type { Paginated } from '../types/http.js'
import {
  requireProjectMember,
  requireProjectOwner,
} from './project-access.service.js'

export async function listProjects(
  userId: string,
  query: ProjectListQuery,
): Promise<Paginated<object>> {
  const where: Prisma.ProjectMemberWhereInput = {
    userId,
    ...(query.role ? { role: query.role } : {}),
    project: query.keyword
      ? { name: { contains: query.keyword } }
      : undefined,
  }

  const [memberships, total] = await prisma.$transaction([
    prisma.projectMember.findMany({
      where,
      include: { project: true },
      orderBy: { project: { updatedAt: 'desc' } },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.projectMember.count({ where }),
  ])

  return {
    items: memberships.map(({ project, role }) => ({ ...project, role })),
    page: query.page,
    pageSize: query.pageSize,
    total,
  }
}

export async function createProject(userId: string, input: ProjectCreateInput) {
  return prisma.project.create({
    data: {
      ...input,
      members: { create: { userId, role: 'OWNER' } },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      },
    },
  })
}

export async function getProject(projectId: string, userId: string) {
  await requireProjectMember(projectId, userId)

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, username: true, email: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!project) {
    throw new AppError(404, 'PROJECT_NOT_FOUND', '项目不存在')
  }

  return project
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: ProjectUpdateInput,
) {
  await requireProjectOwner(projectId, userId)
  return prisma.project.update({ where: { id: projectId }, data: input })
}

export async function deleteProject(projectId: string, userId: string) {
  await requireProjectOwner(projectId, userId)
  await prisma.project.delete({ where: { id: projectId } })
}

export async function listMembers(projectId: string, userId: string) {
  await requireProjectMember(projectId, userId)
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, username: true, email: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function addMember(
  projectId: string,
  ownerId: string,
  identifier: string,
) {
  await requireProjectOwner(projectId, ownerId)

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  })

  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', '用户不存在')
  }

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: user.id } },
  })

  if (existing) {
    throw new AppError(409, 'MEMBER_ALREADY_EXISTS', '该用户已经是项目成员')
  }

  return prisma.projectMember.create({
    data: { projectId, userId: user.id, role: 'MEMBER' },
    include: {
      user: { select: { id: true, username: true, email: true } },
    },
  })
}

export async function removeMember(
  projectId: string,
  ownerId: string,
  memberUserId: string,
) {
  await requireProjectOwner(projectId, ownerId)

  if (ownerId === memberUserId) {
    throw new AppError(409, 'OWNER_CANNOT_BE_REMOVED', '项目负责人不能被移除')
  }

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: memberUserId } },
  })

  if (!membership) {
    throw new AppError(404, 'MEMBER_NOT_FOUND', '项目成员不存在')
  }
  if (membership.role === 'OWNER') {
    throw new AppError(409, 'OWNER_CANNOT_BE_REMOVED', '项目负责人不能被移除')
  }

  await prisma.projectMember.delete({ where: { id: membership.id } })
}
```

- [ ] **Step 6: Implement project controller and routes**

Create `server/src/controllers/project.controller.ts`:

```ts
import type { Request, Response } from 'express'
import { sendSuccess } from '../lib/response.js'
import {
  memberCreateSchema,
  projectCreateSchema,
  projectListQuerySchema,
  projectUpdateSchema,
} from '../schemas/project.schema.js'
import * as projectService from '../services/project.service.js'

export async function list(request: Request, response: Response) {
  const result = await projectService.listProjects(
    request.auth!.userId,
    projectListQuerySchema.parse(request.query),
  )
  sendSuccess(response, result)
}

export async function create(request: Request, response: Response) {
  const result = await projectService.createProject(
    request.auth!.userId,
    projectCreateSchema.parse(request.body),
  )
  response.status(201)
  sendSuccess(response, result, '项目创建成功')
}

export async function detail(request: Request, response: Response) {
  sendSuccess(
    response,
    await projectService.getProject(
      request.params.projectId,
      request.auth!.userId,
    ),
  )
}

export async function update(request: Request, response: Response) {
  sendSuccess(
    response,
    await projectService.updateProject(
      request.params.projectId,
      request.auth!.userId,
      projectUpdateSchema.parse(request.body),
    ),
  )
}

export async function remove(request: Request, response: Response) {
  await projectService.deleteProject(
    request.params.projectId,
    request.auth!.userId,
  )
  sendSuccess(response, null, '项目已删除')
}

export async function members(request: Request, response: Response) {
  sendSuccess(
    response,
    await projectService.listMembers(
      request.params.projectId,
      request.auth!.userId,
    ),
  )
}

export async function addMember(request: Request, response: Response) {
  const { identifier } = memberCreateSchema.parse(request.body)
  const result = await projectService.addMember(
    request.params.projectId,
    request.auth!.userId,
    identifier,
  )
  response.status(201)
  sendSuccess(response, result, '成员添加成功')
}

export async function removeMember(request: Request, response: Response) {
  await projectService.removeMember(
    request.params.projectId,
    request.auth!.userId,
    request.params.userId,
  )
  sendSuccess(response, null, '成员已移除')
}
```

Create `server/src/routes/project.route.ts`:

```ts
import { Router } from 'express'
import * as projectController from '../controllers/project.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const projectRouter = Router()

projectRouter.use(requireAuth)
projectRouter.get('/', projectController.list)
projectRouter.post('/', projectController.create)
projectRouter.get('/:projectId', projectController.detail)
projectRouter.patch('/:projectId', projectController.update)
projectRouter.delete('/:projectId', projectController.remove)
projectRouter.get('/:projectId/members', projectController.members)
projectRouter.post('/:projectId/members', projectController.addMember)
projectRouter.delete(
  '/:projectId/members/:userId',
  projectController.removeMember,
)
```

Modify `server/src/app.ts`:

```ts
import { projectRouter } from './routes/project.route.js'

app.use('/api/v1/projects', projectRouter)
```

- [ ] **Step 7: Run tests and type check**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/projects.test.ts
npm run typecheck
```

Expected: project ownership, outsider rejection, member creation, and owner-only removal tests pass.

- [ ] **Step 8: Commit**

```bash
git add server
git commit -m "feat: add project and member APIs"
```

---

### Task 8: Project List, Detail, and Member UI

**Files:**

- Create: `client/src/api/projects.ts`
- Create: `client/src/stores/project.ts`
- Create: `client/src/utils/permissions.ts`
- Create: `client/src/components/projects/ProjectFormDialog.vue`
- Create: `client/src/components/projects/MemberPanel.vue`
- Create: `client/src/views/projects/ProjectsView.vue`
- Create: `client/src/views/projects/ProjectDetailView.vue`
- Modify: `client/src/router/index.ts`
- Modify: `client/src/layouts/AppLayout.vue`
- Test: `client/tests/project-store.test.ts`
- Test: `client/tests/permissions.test.ts`

**Interfaces:**

- Consumes: `apiRequest<T>()`, `useAuthStore()`, and project API routes.
- Produces: `projectApi`, `useProjectStore()`, `canManageProject()`, `/projects`, and `/projects/:projectId`.

- [ ] **Step 1: Write failing permission and store tests**

Create `client/tests/permissions.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { canManageProject } from '../src/utils/permissions'

describe('canManageProject', () => {
  it('allows only an owner', () => {
    expect(canManageProject('OWNER')).toBe(true)
    expect(canManageProject('MEMBER')).toBe(false)
    expect(canManageProject(undefined)).toBe(false)
  })
})
```

Create `client/tests/project-store.test.ts`:

```ts
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { projectApi } from '../src/api/projects'
import { useProjectStore } from '../src/stores/project'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.restoreAllMocks()
})

describe('project store', () => {
  it('loads a project and exposes the current role', async () => {
    vi.spyOn(projectApi, 'detail').mockResolvedValue({
      id: 'project-1',
      name: 'Project',
      description: '',
      updatedAt: '2026-09-23T00:00:00.000Z',
      members: [
        {
          id: 'member-1',
          role: 'OWNER',
          user: {
            id: 'user-1',
            email: 'owner@example.com',
            username: 'owner',
          },
        },
      ],
    })

    const store = useProjectStore()
    await store.load('project-1', 'user-1')

    expect(store.currentRole).toBe('OWNER')
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
cd client
npm test -- --run tests/permissions.test.ts tests/project-store.test.ts
```

Expected: FAIL because the project API, store, and permission helper do not exist.

- [ ] **Step 3: Implement project types, API, permissions, and store**

Create `client/src/api/projects.ts`:

```ts
import { apiRequest } from './http'

export type ProjectRole = 'OWNER' | 'MEMBER'

export interface ProjectMember {
  id: string
  role: ProjectRole
  user: { id: string; username: string; email: string }
}

export interface ProjectSummary {
  id: string
  name: string
  description: string
  updatedAt: string
  role: ProjectRole
}

export interface ProjectDetail {
  id: string
  name: string
  description: string
  updatedAt: string
  members: ProjectMember[]
}

export interface PaginatedProjects {
  items: ProjectSummary[]
  page: number
  pageSize: number
  total: number
}

export const projectApi = {
  list(params: {
    page?: number
    pageSize?: number
    keyword?: string
    role?: ProjectRole
  }) {
    return apiRequest<PaginatedProjects>({
      method: 'GET',
      url: '/projects',
      params,
    })
  },
  create(input: { name: string; description: string }) {
    return apiRequest<ProjectDetail>({
      method: 'POST',
      url: '/projects',
      data: input,
    })
  },
  detail(projectId: string) {
    return apiRequest<ProjectDetail>({
      method: 'GET',
      url: `/projects/${projectId}`,
    })
  },
  update(projectId: string, input: { name?: string; description?: string }) {
    return apiRequest<ProjectDetail>({
      method: 'PATCH',
      url: `/projects/${projectId}`,
      data: input,
    })
  },
  remove(projectId: string) {
    return apiRequest<null>({
      method: 'DELETE',
      url: `/projects/${projectId}`,
    })
  },
  members(projectId: string) {
    return apiRequest<ProjectMember[]>({
      method: 'GET',
      url: `/projects/${projectId}/members`,
    })
  },
  addMember(projectId: string, identifier: string) {
    return apiRequest<ProjectMember>({
      method: 'POST',
      url: `/projects/${projectId}/members`,
      data: { identifier },
    })
  },
  removeMember(projectId: string, userId: string) {
    return apiRequest<null>({
      method: 'DELETE',
      url: `/projects/${projectId}/members/${userId}`,
    })
  },
}
```

Create `client/src/utils/permissions.ts`:

```ts
import type { ProjectRole } from '../api/projects'

export function canManageProject(role: ProjectRole | undefined) {
  return role === 'OWNER'
}
```

Create `client/src/stores/project.ts`:

```ts
import { defineStore } from 'pinia'
import {
  projectApi,
  type ProjectDetail,
  type ProjectRole,
} from '../api/projects'

export const useProjectStore = defineStore('project', {
  state: () => ({
    current: null as ProjectDetail | null,
    currentUserId: '',
    loading: false,
  }),
  getters: {
    currentRole(state): ProjectRole | undefined {
      return state.current?.members.find(
        (member) => member.user.id === state.currentUserId,
      )?.role
    },
  },
  actions: {
    async load(projectId: string, userId: string) {
      this.loading = true
      this.currentUserId = userId
      try {
        this.current = await projectApi.detail(projectId)
      } finally {
        this.loading = false
      }
    },
    clear() {
      this.current = null
      this.currentUserId = ''
    },
  },
})
```

- [ ] **Step 4: Implement the project dialogs, views, and member panel**

Create `client/src/components/projects/ProjectFormDialog.vue` with:

- Props: `modelValue: boolean`, `project?: { id: string; name: string; description: string }`.
- Emits: `update:modelValue`, `saved`.
- Owns local `name` and `description` fields.
- Calls `projectApi.create()` when `project` is absent.
- Calls `projectApi.update(project.id, input)` when `project` exists.
- Displays Element Plus validation errors.

Create `client/src/components/projects/MemberPanel.vue` with:

- Props: `projectId: string`, `members: ProjectMember[]`, `canManage: boolean`.
- Emits: `changed`.
- Uses an input with label `邮箱或用户名` for adding members.
- Calls `projectApi.addMember()` and `projectApi.removeMember()`.
- Hides add/remove controls when `canManage` is false.

Create `client/src/views/projects/ProjectsView.vue` with:

- Keyword input, role select with `全部角色`, `我负责的`, `我参与的`, search button, and page controls.
- `el-table` with project name, description, role, and update time.
- A row click that routes to `/projects/:projectId`.
- A `新建项目` button that opens `ProjectFormDialog`.
- Empty state text `还没有项目`.

Create `client/src/views/projects/ProjectDetailView.vue` with:

- Reads `projectId` from `route.params.projectId`.
- Calls `projectStore.load(projectId, auth.user!.id)` on mount and when the ID changes.
- Shows project name and description.
- Shows an owner-only edit button and a delete button.
- Renders `MemberPanel`.
- Leaves a clearly labeled `任务` section as the next task's insertion point.

Add routes in `client/src/router/index.ts` under the authenticated layout:

```ts
{
  path: 'projects',
  name: 'projects',
  component: () => import('../views/projects/ProjectsView.vue'),
},
{
  path: 'projects/:projectId',
  name: 'project-detail',
  component: () => import('../views/projects/ProjectDetailView.vue'),
},
```

Update the sidebar menu to include:

```vue
<el-menu-item index="/projects">项目</el-menu-item>
```

- [ ] **Step 5: Run tests, type check, and build**

Run:

```bash
cd client
npm test -- --run tests/permissions.test.ts tests/project-store.test.ts
npm run typecheck
npm run build
```

Expected: tests, type check, and build pass.

- [ ] **Step 6: Commit**

```bash
git add client
git commit -m "feat: add project and member UI"
```

---

### Task 9: Tasks API with Filters, Pagination, and Assignment Rules

**Files:**

- Create: `server/src/schemas/task.schema.ts`
- Create: `server/src/services/task.service.ts`
- Create: `server/src/controllers/task.controller.ts`
- Create: `server/src/routes/task.route.ts`
- Create: `server/src/routes/project-task.route.ts`
- Modify: `server/src/app.ts`
- Modify: `server/tests/helpers/factories.ts`
- Test: `server/tests/tasks.test.ts`

**Interfaces:**

- Consumes: `requireProjectMember()`, `paginationSchema`, `prisma`, and `AppError`.
- Produces: `listTasks()`, `createTask()`, `getTask()`, `updateTask()`, `deleteTask()`, and task HTTP routes.

- [ ] **Step 1: Add a task factory and write failing task tests**

Add to `server/tests/helpers/factories.ts`:

```ts
export async function createTask(
  projectId: string,
  creatorId: string,
  overrides: Partial<{
    title: string
    status: string
    priority: string
    assigneeId: string
    dueDate: Date
  }> = {},
) {
  return prisma.task.create({
    data: {
      projectId,
      creatorId,
      title: overrides.title ?? 'Test task',
      status: overrides.status ?? 'TODO',
      priority: overrides.priority ?? 'MEDIUM',
      assigneeId: overrides.assigneeId,
      dueDate: overrides.dueDate,
    },
  })
}
```

Create `server/tests/tasks.test.ts`:

```ts
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app'
import { createAuthenticatedUser } from './helpers/auth'
import { resetDatabase } from './helpers/database'
import { createProjectWithOwner, createTask } from './helpers/factories'

const app = createApp()

beforeEach(resetDatabase)

describe('tasks', () => {
  it('creates and filters tasks inside a project', async () => {
    const owner = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)

    await request(app)
      .post(`/api/v1/projects/${project.id}/tasks`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        title: 'First task',
        description: '',
        status: 'TODO',
        priority: 'HIGH',
      })

    const response = await request(app)
      .get(`/api/v1/projects/${project.id}/tasks?status=TODO&page=1&pageSize=20`)
      .set('Authorization', `Bearer ${owner.token}`)

    expect(response.status).toBe(200)
    expect(response.body.data.total).toBe(1)
    expect(response.body.data.items[0].priority).toBe('HIGH')
  })

  it('rejects an assignee who is not a project member', async () => {
    const owner = await createAuthenticatedUser()
    const outsider = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)

    const response = await request(app)
      .post(`/api/v1/projects/${project.id}/tasks`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        title: 'Invalid assignment',
        assigneeId: outsider.user.id,
      })

    expect(response.status).toBe(400)
    expect(response.body.code).toBe('ASSIGNEE_NOT_PROJECT_MEMBER')
  })

  it('allows a member to edit but prevents deleting another creator task', async () => {
    const owner = await createAuthenticatedUser()
    const member = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: member.user.id, role: 'MEMBER' },
    })
    const task = await createTask(project.id, owner.user.id)

    const update = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .set('Authorization', `Bearer ${member.token}`)
      .send({ status: 'IN_PROGRESS' })
    const remove = await request(app)
      .delete(`/api/v1/tasks/${task.id}`)
      .set('Authorization', `Bearer ${member.token}`)

    expect(update.status).toBe(200)
    expect(remove.status).toBe(403)
    expect(remove.body.code).toBe('TASK_DELETE_FORBIDDEN')
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/tasks.test.ts
```

Expected: FAIL with 404 because task routes do not exist.

- [ ] **Step 3: Define task validation schemas**

Create `server/src/schemas/task.schema.ts`:

```ts
import { z } from 'zod'
import { paginationSchema } from './project.schema.js'

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
export const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH'])

export const taskListQuerySchema = paginationSchema.extend({
  keyword: z.string().trim().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().trim().optional(),
  dueBefore: z.coerce.date().optional(),
})

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(5000).default(''),
  status: taskStatusSchema.default('TODO'),
  priority: taskPrioritySchema.default('MEDIUM'),
  assigneeId: z.string().trim().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
})

export const taskUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(5000).optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    assigneeId: z.string().trim().nullable().optional(),
    dueDate: z.coerce.date().nullable().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    '至少提供一个需要修改的字段',
  )

export type TaskListQuery = z.infer<typeof taskListQuerySchema>
export type TaskCreateInput = z.infer<typeof taskCreateSchema>
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>
```

- [ ] **Step 4: Implement task services**

Create `server/src/services/task.service.ts`:

```ts
import type { Prisma } from '@prisma/client'
import { AppError } from '../lib/app-error.js'
import { prisma } from '../lib/prisma.js'
import type {
  TaskCreateInput,
  TaskListQuery,
  TaskUpdateInput,
} from '../schemas/task.schema.js'
import type { Paginated } from '../types/http.js'
import { requireProjectMember } from './project-access.service.js'

const taskInclude = {
  assignee: { select: { id: true, username: true, email: true } },
  creator: { select: { id: true, username: true, email: true } },
} satisfies Prisma.TaskInclude

async function requireAssigneeMembership(
  projectId: string,
  assigneeId: string | null | undefined,
) {
  if (!assigneeId) return

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: assigneeId } },
  })

  if (!membership) {
    throw new AppError(
      400,
      'ASSIGNEE_NOT_PROJECT_MEMBER',
      '任务负责人必须是项目成员',
    )
  }
}

export async function listTasks(
  userId: string,
  projectId: string,
  query: TaskListQuery,
): Promise<Paginated<object>> {
  await requireProjectMember(projectId, userId)

  const where: Prisma.TaskWhereInput = {
    projectId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
    ...(query.dueBefore ? { dueDate: { lte: query.dueBefore } } : {}),
    ...(query.keyword
      ? {
          OR: [
            { title: { contains: query.keyword } },
            { description: { contains: query.keyword } },
          ],
        }
      : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.task.count({ where }),
  ])

  return { items, page: query.page, pageSize: query.pageSize, total }
}

export async function createTask(
  userId: string,
  projectId: string,
  input: TaskCreateInput,
) {
  await requireProjectMember(projectId, userId)
  await requireAssigneeMembership(projectId, input.assigneeId)

  return prisma.task.create({
    data: {
      ...input,
      projectId,
      creatorId: userId,
    },
    include: taskInclude,
  })
}

async function findTaskForMember(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: taskInclude,
  })

  if (!task) {
    throw new AppError(404, 'TASK_NOT_FOUND', '任务不存在')
  }

  const membership = await requireProjectMember(task.projectId, userId)
  return { task, membership }
}

export async function getTask(taskId: string, userId: string) {
  return (await findTaskForMember(taskId, userId)).task
}

export async function updateTask(
  taskId: string,
  userId: string,
  input: TaskUpdateInput,
) {
  const { task } = await findTaskForMember(taskId, userId)
  await requireAssigneeMembership(task.projectId, input.assigneeId)

  return prisma.task.update({
    where: { id: taskId },
    data: input,
    include: taskInclude,
  })
}

export async function deleteTask(taskId: string, userId: string) {
  const { task, membership } = await findTaskForMember(taskId, userId)

  if (task.creatorId !== userId && membership.role !== 'OWNER') {
    throw new AppError(403, 'TASK_DELETE_FORBIDDEN', '你不能删除该任务')
  }

  await prisma.task.delete({ where: { id: taskId } })
}
```

- [ ] **Step 5: Implement task controller and routes**

Create `server/src/controllers/task.controller.ts`:

```ts
import type { Request, Response } from 'express'
import { sendSuccess } from '../lib/response.js'
import {
  taskCreateSchema,
  taskListQuerySchema,
  taskUpdateSchema,
} from '../schemas/task.schema.js'
import * as taskService from '../services/task.service.js'

export async function list(request: Request, response: Response) {
  sendSuccess(
    response,
    await taskService.listTasks(
      request.auth!.userId,
      request.params.projectId,
      taskListQuerySchema.parse(request.query),
    ),
  )
}

export async function create(request: Request, response: Response) {
  const result = await taskService.createTask(
    request.auth!.userId,
    request.params.projectId,
    taskCreateSchema.parse(request.body),
  )
  response.status(201)
  sendSuccess(response, result, '任务创建成功')
}

export async function detail(request: Request, response: Response) {
  sendSuccess(
    response,
    await taskService.getTask(request.params.taskId, request.auth!.userId),
  )
}

export async function update(request: Request, response: Response) {
  sendSuccess(
    response,
    await taskService.updateTask(
      request.params.taskId,
      request.auth!.userId,
      taskUpdateSchema.parse(request.body),
    ),
  )
}

export async function remove(request: Request, response: Response) {
  await taskService.deleteTask(request.params.taskId, request.auth!.userId)
  sendSuccess(response, null, '任务已删除')
}
```

Create `server/src/routes/project-task.route.ts`:

```ts
import { Router } from 'express'
import * as taskController from '../controllers/task.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const projectTaskRouter = Router({ mergeParams: true })

projectTaskRouter.use(requireAuth)
projectTaskRouter.get('/', taskController.list)
projectTaskRouter.post('/', taskController.create)
```

Create `server/src/routes/task.route.ts`:

```ts
import { Router } from 'express'
import * as taskController from '../controllers/task.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const taskRouter = Router()

taskRouter.use(requireAuth)
taskRouter.get('/:taskId', taskController.detail)
taskRouter.patch('/:taskId', taskController.update)
taskRouter.delete('/:taskId', taskController.remove)
```

Modify `server/src/app.ts`:

```ts
import { projectTaskRouter } from './routes/project-task.route.js'
import { taskRouter } from './routes/task.route.js'

app.use('/api/v1/projects/:projectId/tasks', projectTaskRouter)
app.use('/api/v1/tasks', taskRouter)
```

- [ ] **Step 6: Run tests and type check**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/tasks.test.ts
npm run typecheck
```

Expected: task creation, filters, assignment validation, update permission, and delete permission tests pass.

- [ ] **Step 7: Commit**

```bash
git add server
git commit -m "feat: add task APIs"
```

---

### Task 10: Task List, Filters, Forms, and Task Detail UI

**Files:**

- Create: `client/src/api/tasks.ts`
- Create: `client/src/components/tasks/TaskFilters.vue`
- Create: `client/src/components/tasks/TaskTable.vue`
- Create: `client/src/components/tasks/TaskFormDialog.vue`
- Create: `client/src/views/tasks/TaskDetailView.vue`
- Create: `client/src/utils/task-query.ts`
- Modify: `client/src/views/projects/ProjectDetailView.vue`
- Modify: `client/src/router/index.ts`
- Test: `client/tests/task-filters.test.ts`

**Interfaces:**

- Consumes: `projectApi`, `useProjectStore()`, `apiRequest<T>()`, and task API routes.
- Produces: `taskApi`, `toTaskQuery()`, task table/filter/form components, `/projects/:projectId/tasks/:taskId`, and the task section in project detail.

- [ ] **Step 1: Write the failing filter conversion test**

Create `client/tests/task-filters.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { toTaskQuery } from '../src/utils/task-query'

describe('toTaskQuery', () => {
  it('omits empty filters and keeps pagination', () => {
    expect(
      toTaskQuery({
        keyword: '  ',
        status: '',
        priority: 'HIGH',
        assigneeId: '',
        dueBefore: '',
        page: 2,
        pageSize: 20,
      }),
    ).toEqual({
      page: 2,
      pageSize: 20,
      priority: 'HIGH',
    })
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd client && npm test -- --run tests/task-filters.test.ts`

Expected: FAIL because `task-query.ts` does not exist.

- [ ] **Step 3: Implement the task API**

Create `client/src/api/tasks.ts`:

```ts
import { apiRequest } from './http'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface TaskUser {
  id: string
  username: string
  email: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string | null
  assignee: TaskUser | null
  creatorId: string
  creator: TaskUser
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskQuery {
  page: number
  pageSize: number
  keyword?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueBefore?: string
}

export interface PaginatedTasks {
  items: Task[]
  page: number
  pageSize: number
  total: number
}

export interface TaskCreateInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string | null
  dueDate: string | null
}

export const taskApi = {
  list(projectId: string, params: TaskQuery) {
    return apiRequest<PaginatedTasks>({
      method: 'GET',
      url: `/projects/${projectId}/tasks`,
      params,
    })
  },
  create(projectId: string, input: TaskCreateInput) {
    return apiRequest<Task>({
      method: 'POST',
      url: `/projects/${projectId}/tasks`,
      data: input,
    })
  },
  detail(taskId: string) {
    return apiRequest<Task>({
      method: 'GET',
      url: `/tasks/${taskId}`,
    })
  },
  update(taskId: string, input: Partial<TaskCreateInput>) {
    return apiRequest<Task>({
      method: 'PATCH',
      url: `/tasks/${taskId}`,
      data: input,
    })
  },
  remove(taskId: string) {
    return apiRequest<null>({
      method: 'DELETE',
      url: `/tasks/${taskId}`,
    })
  },
}
```

- [ ] **Step 4: Implement task filter conversion and components**

Create `client/src/utils/task-query.ts`:

```ts
import type {
  TaskPriority,
  TaskQuery,
  TaskStatus,
} from '../api/tasks'

export interface TaskFilterState {
  keyword: string
  status: TaskStatus | ''
  priority: TaskPriority | ''
  assigneeId: string
  dueBefore: string
  page: number
  pageSize: number
}

export function toTaskQuery(state: TaskFilterState): TaskQuery {
  return {
    page: state.page,
    pageSize: state.pageSize,
    ...(state.keyword.trim() ? { keyword: state.keyword.trim() } : {}),
    ...(state.status ? { status: state.status } : {}),
    ...(state.priority ? { priority: state.priority } : {}),
    ...(state.assigneeId ? { assigneeId: state.assigneeId } : {}),
    ...(state.dueBefore ? { dueBefore: state.dueBefore } : {}),
  }
}
```

Import `toTaskQuery()` inside `TaskFilters.vue`.

The component template contains:

- Input labeled `搜索任务`.
- Status select with `全部状态`, `待处理`, `进行中`, `已完成`.
- Priority select with `全部优先级`, `低`, `中`, `高`.
- Assignee select populated from project members with `全部负责人`.
- Date picker labeled `截止时间早于` mapped to `dueBefore`.
- Emits `change` with `toTaskQuery(state)`.

Create `client/src/components/tasks/TaskTable.vue` with:

- Props: `tasks: Task[]`, `loading: boolean`, `total: number`, `page: number`, `pageSize: number`.
- Emits: `edit`, `delete`, `page-change`, `row-click`.
- Columns: title, status tag, priority tag, assignee, due date, update time.
- Maps `TODO` to `待处理`, `IN_PROGRESS` to `进行中`, `DONE` to `已完成`.
- Maps priorities to `低`, `中`, `高`.

Create `client/src/components/tasks/TaskFormDialog.vue` with:

- Props: `modelValue`, `projectId`, `members`, `task?: Task`.
- Emits: `update:modelValue`, `saved`.
- Fields: title, description, status, priority, assignee, due date.
- Uses `taskApi.create()` or `taskApi.update()`.
- Converts Element Plus date values to ISO strings before sending.

- [ ] **Step 5: Integrate the task section into project detail**

Modify `client/src/views/projects/ProjectDetailView.vue`:

- Add a `任务` card.
- Call `taskApi.list(projectId, query)` after the project loads.
- Render `TaskFilters`, `TaskTable`, and `新建任务`.
- On row click, route to `/projects/:projectId/tasks/:taskId`.
- Refresh the project detail after task create, update, or delete.
- Show `暂无任务` when the response total is zero.

- [ ] **Step 6: Implement task detail and route**

Create `client/src/views/tasks/TaskDetailView.vue` with:

- Loads `taskApi.detail(taskId)` on mount.
- Shows title, creator, assignee, due date, status, and priority.
- Provides an edit button that opens `TaskFormDialog`.
- Provides a delete button for the task creator or project owner.
- Routes back to `/projects/:projectId` after deletion.
- Leaves a `评论` section and an `附件` section for Tasks 12 and 14.

Add the route under the authenticated layout:

```ts
{
  path: 'projects/:projectId/tasks/:taskId',
  name: 'task-detail',
  component: () => import('../views/tasks/TaskDetailView.vue'),
}
```

- [ ] **Step 7: Run tests, type check, and build**

Run:

```bash
cd client
npm test -- --run tests/task-filters.test.ts
npm run typecheck
npm run build
```

Expected: filter test, type check, and build pass.

- [ ] **Step 8: Commit**

```bash
git add client
git commit -m "feat: add task management UI"
```

---

### Task 11: Comments API

**Files:**

- Create: `server/src/schemas/comment.schema.ts`
- Create: `server/src/services/comment.service.ts`
- Create: `server/src/controllers/comment.controller.ts`
- Create: `server/src/routes/comment.route.ts`
- Create: `server/src/routes/task-comment.route.ts`
- Modify: `server/src/app.ts`
- Test: `server/tests/comments.test.ts`

**Interfaces:**

- Consumes: `requireProjectMember()`, `paginationSchema`, `prisma`, and `AppError`.
- Produces: comment list, create, and delete endpoints.

- [ ] **Step 1: Write failing comment tests**

Create `server/tests/comments.test.ts`:

```ts
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app'
import { prisma } from '../src/lib/prisma'
import { createAuthenticatedUser } from './helpers/auth'
import { resetDatabase } from './helpers/database'
import { createProjectWithOwner, createTask } from './helpers/factories'

const app = createApp()

beforeEach(resetDatabase)

describe('comments', () => {
  it('creates and lists a comment', async () => {
    const owner = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)
    const task = await createTask(project.id, owner.user.id)

    const created = await request(app)
      .post(`/api/v1/tasks/${task.id}/comments`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ content: '第一条评论' })
    const listed = await request(app)
      .get(`/api/v1/tasks/${task.id}/comments`)
      .set('Authorization', `Bearer ${owner.token}`)

    expect(created.status).toBe(201)
    expect(listed.body.data.items).toHaveLength(1)
    expect(listed.body.data.items[0].content).toBe('第一条评论')
  })

  it('allows only the author or project owner to delete', async () => {
    const owner = await createAuthenticatedUser()
    const member = await createAuthenticatedUser()
    const other = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)
    await prisma.projectMember.createMany({
      data: [
        { projectId: project.id, userId: member.user.id, role: 'MEMBER' },
        { projectId: project.id, userId: other.user.id, role: 'MEMBER' },
      ],
    })
    const task = await createTask(project.id, owner.user.id)
    const comment = await prisma.comment.create({
      data: { taskId: task.id, authorId: member.user.id, content: 'keep' },
    })

    const forbidden = await request(app)
      .delete(`/api/v1/comments/${comment.id}`)
      .set('Authorization', `Bearer ${other.token}`)
    const allowed = await request(app)
      .delete(`/api/v1/comments/${comment.id}`)
      .set('Authorization', `Bearer ${owner.token}`)

    expect(forbidden.status).toBe(403)
    expect(forbidden.body.code).toBe('COMMENT_DELETE_FORBIDDEN')
    expect(allowed.status).toBe(200)
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/comments.test.ts
```

Expected: FAIL with 404 because comment routes do not exist.

- [ ] **Step 3: Implement comment schema and service**

Create `server/src/schemas/comment.schema.ts`:

```ts
import { z } from 'zod'
import { paginationSchema } from './project.schema.js'

export const commentListQuerySchema = paginationSchema

export const commentCreateSchema = z.object({
  content: z.string().trim().min(1).max(2000),
})
```

Create `server/src/services/comment.service.ts`:

```ts
import { AppError } from '../lib/app-error.js'
import { prisma } from '../lib/prisma.js'
import type { Paginated } from '../types/http.js'
import { requireProjectMember } from './project-access.service.js'

async function getTaskAndMembership(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } })

  if (!task) {
    throw new AppError(404, 'TASK_NOT_FOUND', '任务不存在')
  }

  const membership = await requireProjectMember(task.projectId, userId)
  return { task, membership }
}

export async function listComments(
  taskId: string,
  userId: string,
  page: number,
  pageSize: number,
): Promise<Paginated<object>> {
  await getTaskAndMembership(taskId, userId)

  const where = { taskId }
  const [items, total] = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      include: {
        author: { select: { id: true, username: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.comment.count({ where }),
  ])

  return { items, page, pageSize, total }
}

export async function createComment(
  taskId: string,
  userId: string,
  content: string,
) {
  await getTaskAndMembership(taskId, userId)

  return prisma.comment.create({
    data: { taskId, authorId: userId, content },
    include: {
      author: { select: { id: true, username: true, email: true } },
    },
  })
}

export async function deleteComment(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { task: true },
  })

  if (!comment) {
    throw new AppError(404, 'COMMENT_NOT_FOUND', '评论不存在')
  }

  const membership = await requireProjectMember(comment.task.projectId, userId)
  const canDelete =
    comment.authorId === userId || membership.role === 'OWNER'

  if (!canDelete) {
    throw new AppError(403, 'COMMENT_DELETE_FORBIDDEN', '你不能删除该评论')
  }

  await prisma.comment.delete({ where: { id: commentId } })
}
```

- [ ] **Step 4: Implement comment controller and routes**

Create `server/src/controllers/comment.controller.ts`:

```ts
import type { Request, Response } from 'express'
import { sendSuccess } from '../lib/response.js'
import {
  commentCreateSchema,
  commentListQuerySchema,
} from '../schemas/comment.schema.js'
import * as commentService from '../services/comment.service.js'

export async function list(request: Request, response: Response) {
  const query = commentListQuerySchema.parse(request.query)
  sendSuccess(
    response,
    await commentService.listComments(
      request.params.taskId,
      request.auth!.userId,
      query.page,
      query.pageSize,
    ),
  )
}

export async function create(request: Request, response: Response) {
  const { content } = commentCreateSchema.parse(request.body)
  const result = await commentService.createComment(
    request.params.taskId,
    request.auth!.userId,
    content,
  )
  response.status(201)
  sendSuccess(response, result, '评论已发布')
}

export async function remove(request: Request, response: Response) {
  await commentService.deleteComment(
    request.params.commentId,
    request.auth!.userId,
  )
  sendSuccess(response, null, '评论已删除')
}
```

Create `server/src/routes/task-comment.route.ts`:

```ts
import { Router } from 'express'
import * as commentController from '../controllers/comment.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const taskCommentRouter = Router({ mergeParams: true })

taskCommentRouter.use(requireAuth)
taskCommentRouter.get('/', commentController.list)
taskCommentRouter.post('/', commentController.create)
```

Create `server/src/routes/comment.route.ts`:

```ts
import { Router } from 'express'
import * as commentController from '../controllers/comment.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const commentRouter = Router()

commentRouter.use(requireAuth)
commentRouter.delete('/:commentId', commentController.remove)
```

Modify `server/src/app.ts`:

```ts
import { commentRouter } from './routes/comment.route.js'
import { taskCommentRouter } from './routes/task-comment.route.js'

app.use('/api/v1/tasks/:taskId/comments', taskCommentRouter)
app.use('/api/v1/comments', commentRouter)
```

- [ ] **Step 5: Run tests and type check**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/comments.test.ts
npm run typecheck
```

Expected: comment create, list, author deletion, and owner deletion tests pass.

- [ ] **Step 6: Commit**

```bash
git add server
git commit -m "feat: add comment APIs"
```

---

### Task 12: Comments UI

**Files:**

- Create: `client/src/api/comments.ts`
- Create: `client/src/components/comments/CommentList.vue`
- Create: `client/src/components/comments/CommentForm.vue`
- Modify: `client/src/views/tasks/TaskDetailView.vue`
- Test: `client/tests/comments.test.ts`

**Interfaces:**

- Consumes: `apiRequest<T>()`, `useAuthStore()`, `useProjectStore()`, and comment API routes.
- Produces: `commentApi`, comment list/form components, and task-detail comment integration.

- [ ] **Step 1: Write a failing comment API test**

Create `client/tests/comments.test.ts`:

```ts
import MockAdapter from 'axios-mock-adapter'
import { beforeEach, describe, expect, it } from 'vitest'
import { commentApi } from '../src/api/comments'
import { http } from '../src/api/http'

const mock = new MockAdapter(http)

beforeEach(() => mock.reset())

describe('commentApi', () => {
  it('creates a comment', async () => {
    mock.onPost('/tasks/task-1/comments').reply(201, {
      code: 'OK',
      message: '评论已发布',
      data: { id: 'comment-1', content: 'hello' },
      requestId: 'request-1',
    })

    const result = await commentApi.create('task-1', 'hello')

    expect(result.id).toBe('comment-1')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd client && npm test -- --run tests/comments.test.ts`

Expected: FAIL because `commentApi` does not exist.

- [ ] **Step 3: Implement the comment API and components**

Create `client/src/api/comments.ts`:

```ts
import { apiRequest } from './http'

export interface Comment {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: string
  updatedAt: string
  author: { id: string; username: string; email: string }
}

export interface PaginatedComments {
  items: Comment[]
  page: number
  pageSize: number
  total: number
}

export const commentApi = {
  list(taskId: string, page = 1, pageSize = 50) {
    return apiRequest<PaginatedComments>({
      method: 'GET',
      url: `/tasks/${taskId}/comments`,
      params: { page, pageSize },
    })
  },
  create(taskId: string, content: string) {
    return apiRequest<Comment>({
      method: 'POST',
      url: `/tasks/${taskId}/comments`,
      data: { content },
    })
  },
  remove(commentId: string) {
    return apiRequest<null>({
      method: 'DELETE',
      url: `/comments/${commentId}`,
    })
  },
}
```

Create `client/src/components/comments/CommentForm.vue`:

- Props: `taskId: string`.
- Emits: `created`.
- Contains an `el-input` textarea with a maximum length of 2000.
- Disables submit for empty text.
- Calls `commentApi.create()` and resets the field.

Create `client/src/components/comments/CommentList.vue`:

- Props: `comments: Comment[]`, `currentUserId: string`, `canManage: boolean`.
- Emits: `deleted`.
- Shows author, local date, content, and delete button.
- Shows delete when the current user is the author or `canManage` is true.
- Calls `commentApi.remove()`.

- [ ] **Step 4: Integrate comments into task detail**

Modify `client/src/views/tasks/TaskDetailView.vue`:

- Load comments in parallel with the task:

```ts
const [taskResult, commentResult] = await Promise.all([
  taskApi.detail(taskId),
  commentApi.list(taskId),
])
task.value = taskResult
comments.value = commentResult.items
```

- Render `CommentForm` and `CommentList` in the `评论` section.
- Set `canManage` from `projectStore.currentRole === 'OWNER'`.
- Reload comments after create or delete.
- Show `暂无评论` when the list is empty.

- [ ] **Step 5: Run tests, type check, and build**

Run:

```bash
cd client
npm test -- --run tests/comments.test.ts
npm run typecheck
npm run build
```

Expected: test, type check, and build pass.

- [ ] **Step 6: Commit**

```bash
git add client
git commit -m "feat: add comment UI"
```

---

### Task 13: Attachments API and File Lifecycle

**Files:**

- Create: `server/src/lib/upload.ts`
- Create: `server/src/services/attachment.service.ts`
- Create: `server/src/controllers/attachment.controller.ts`
- Create: `server/src/routes/task-attachment.route.ts`
- Create: `server/src/routes/attachment.route.ts`
- Modify: `server/src/middlewares/error-handler.ts`
- Modify: `server/src/services/task.service.ts`
- Modify: `server/src/services/project.service.ts`
- Modify: `server/src/app.ts`
- Test: `server/tests/attachments.test.ts`

**Interfaces:**

- Consumes: `env.UPLOAD_DIR`, `requireProjectMember()`, `prisma`, and task access helpers.
- Produces: `upload`, `uploadAttachment()`, `downloadAttachment()`, `deleteAttachment()`, attachment download route, and attachment metadata in task responses.

- [ ] **Step 1: Install Multer and write failing attachment tests**

Run:

```bash
cd server
npm install multer
npm install -D @types/multer
```

Create `server/tests/attachments.test.ts`:

```ts
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app'
import { prisma } from '../src/lib/prisma'
import { createAuthenticatedUser } from './helpers/auth'
import { resetDatabase } from './helpers/database'
import { createProjectWithOwner, createTask } from './helpers/factories'

const app = createApp()

beforeEach(resetDatabase)

describe('attachments', () => {
  it('uploads and downloads a text file for a project member', async () => {
    const owner = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)
    const task = await createTask(project.id, owner.user.id)

    const uploaded = await request(app)
      .post(`/api/v1/tasks/${task.id}/attachments`)
      .set('Authorization', `Bearer ${owner.token}`)
      .attach('file', Buffer.from('hello'), {
        filename: 'note.txt',
        contentType: 'text/plain',
      })

    expect(uploaded.status).toBe(201)

    const downloaded = await request(app)
      .get(`/api/v1/attachments/${uploaded.body.data.id}/download`)
      .set('Authorization', `Bearer ${owner.token}`)

    expect(downloaded.status).toBe(200)
    expect(downloaded.text).toBe('hello')
  })

  it('rejects a non-member download', async () => {
    const owner = await createAuthenticatedUser()
    const outsider = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id)
    const task = await createTask(project.id, owner.user.id)
    const attachment = await prisma.attachment.create({
      data: {
        taskId: task.id,
        uploaderId: owner.user.id,
        originalName: 'note.txt',
        storedName: 'missing.txt',
        mimeType: 'text/plain',
        size: 5,
      },
    })

    const response = await request(app)
      .get(`/api/v1/attachments/${attachment.id}/download`)
      .set('Authorization', `Bearer ${outsider.token}`)

    expect(response.status).toBe(403)
    expect(response.body.code).toBe('PROJECT_MEMBER_REQUIRED')
  })
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/attachments.test.ts
```

Expected: FAIL with 404 because attachment routes do not exist.

- [ ] **Step 3: Implement Multer validation**

Create `server/src/lib/upload.ts`:

```ts
import multer from 'multer'
import { AppError } from './app-error.js'

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
])

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new AppError(
          400,
          'FILE_TYPE_NOT_ALLOWED',
          '仅支持 PDF、PNG、JPEG 和文本文件',
        ),
      )
      return
    }
    callback(null, true)
  },
})
```

Modify `server/src/middlewares/error-handler.ts` to map Multer size errors:

```ts
import multer from 'multer'

if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
  response.status(400).json({
    code: 'FILE_TOO_LARGE',
    message: '文件不能超过 5 MB',
    details: null,
    requestId,
  })
  return
}
```

- [ ] **Step 4: Implement attachment services**

Create `server/src/services/attachment.service.ts`:

```ts
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { env } from '../config/env.js'
import { AppError } from '../lib/app-error.js'
import { prisma } from '../lib/prisma.js'
import { requireProjectMember } from './project-access.service.js'

async function getAttachmentForMember(attachmentId: string, userId: string) {
  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { task: true },
  })

  if (!attachment) {
    throw new AppError(404, 'ATTACHMENT_NOT_FOUND', '附件不存在')
  }

  const membership = await requireProjectMember(
    attachment.task.projectId,
    userId,
  )
  return { attachment, membership }
}

export async function uploadAttachment(
  taskId: string,
  userId: string,
  file: Express.Multer.File,
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } })

  if (!task) {
    throw new AppError(404, 'TASK_NOT_FOUND', '任务不存在')
  }

  await requireProjectMember(task.projectId, userId)

  const count = await prisma.attachment.count({ where: { taskId } })
  if (count >= 20) {
    throw new AppError(400, 'ATTACHMENT_LIMIT_REACHED', '每个任务最多上传 20 个附件')
  }

  const extension = extname(file.originalname).toLowerCase()
  const storedName = `${randomUUID()}${extension}`
  const uploadDirectory = resolve(env.UPLOAD_DIR)
  const filePath = join(uploadDirectory, storedName)

  await mkdir(uploadDirectory, { recursive: true })
  await writeFile(filePath, file.buffer)

  try {
    return await prisma.attachment.create({
      data: {
        taskId,
        uploaderId: userId,
        originalName: file.originalname,
        storedName,
        mimeType: file.mimetype,
        size: file.size,
      },
    })
  } catch (error) {
    await unlink(filePath).catch(() => undefined)
    throw error
  }
}

export async function downloadAttachment(
  attachmentId: string,
  userId: string,
) {
  const { attachment } = await getAttachmentForMember(attachmentId, userId)
  const filePath = join(resolve(env.UPLOAD_DIR), attachment.storedName)

  try {
    const buffer = await readFile(filePath)
    return { attachment, buffer }
  } catch {
    throw new AppError(404, 'ATTACHMENT_FILE_MISSING', '附件文件不存在')
  }
}

export async function deleteAttachment(
  attachmentId: string,
  userId: string,
) {
  const { attachment, membership } = await getAttachmentForMember(
    attachmentId,
    userId,
  )
  const task = await prisma.task.findUnique({
    where: { id: attachment.taskId },
  })

  const canDelete =
    attachment.uploaderId === userId ||
    task?.creatorId === userId ||
    membership.role === 'OWNER'

  if (!canDelete) {
    throw new AppError(403, 'ATTACHMENT_DELETE_FORBIDDEN', '你不能删除该附件')
  }

  await prisma.attachment.delete({ where: { id: attachmentId } })
  await unlink(join(resolve(env.UPLOAD_DIR), attachment.storedName)).catch(
    () => undefined,
  )
}

export async function removeAttachmentFiles(storedNames: string[]) {
  await Promise.all(
    storedNames.map((storedName) =>
      unlink(join(resolve(env.UPLOAD_DIR), storedName)).catch(() => undefined),
    ),
  )
}
```

- [ ] **Step 5: Include attachments in task responses and clean files on deletion**

Modify `taskInclude` in `server/src/services/task.service.ts`:

```ts
attachments: {
  include: {
    uploader: { select: { id: true, username: true, email: true } },
  },
  orderBy: { createdAt: 'desc' },
},
```

Import `removeAttachmentFiles` from `attachment.service.js`.

Modify `deleteTask()`:

```ts
const attachments = await prisma.attachment.findMany({
  where: { taskId },
  select: { storedName: true },
})

await prisma.task.delete({ where: { id: taskId } })
await removeAttachmentFiles(attachments.map((item) => item.storedName))
```

Modify `deleteProject()` in `server/src/services/project.service.ts`:

```ts
const attachments = await prisma.attachment.findMany({
  where: { task: { projectId } },
  select: { storedName: true },
})

await prisma.project.delete({ where: { id: projectId } })
await removeAttachmentFiles(attachments.map((item) => item.storedName))
```

- [ ] **Step 6: Implement attachment controller and routes**

Create `server/src/controllers/attachment.controller.ts`:

```ts
import type { Request, Response } from 'express'
import { AppError } from '../lib/app-error.js'
import { sendSuccess } from '../lib/response.js'
import * as attachmentService from '../services/attachment.service.js'

export async function upload(request: Request, response: Response) {
  if (!request.file) {
    throw new AppError(400, 'FILE_REQUIRED', '请选择需要上传的文件')
  }

  const result = await attachmentService.uploadAttachment(
    request.params.taskId,
    request.auth!.userId,
    request.file,
  )
  response.status(201)
  sendSuccess(response, result, '附件上传成功')
}

export async function download(request: Request, response: Response) {
  const { attachment, buffer } = await attachmentService.downloadAttachment(
    request.params.attachmentId,
    request.auth!.userId,
  )

  response.setHeader('Content-Type', attachment.mimeType)
  response.setHeader(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(attachment.originalName)}`,
  )
  response.send(buffer)
}

export async function remove(request: Request, response: Response) {
  await attachmentService.deleteAttachment(
    request.params.attachmentId,
    request.auth!.userId,
  )
  sendSuccess(response, null, '附件已删除')
}
```

Create `server/src/routes/task-attachment.route.ts`:

```ts
import { Router } from 'express'
import * as attachmentController from '../controllers/attachment.controller.js'
import { requireAuth } from '../middlewares/auth.js'
import { upload } from '../lib/upload.js'

export const taskAttachmentRouter = Router({ mergeParams: true })

taskAttachmentRouter.use(requireAuth)
taskAttachmentRouter.post(
  '/',
  upload.single('file'),
  attachmentController.upload,
)
```

Create `server/src/routes/attachment.route.ts`:

```ts
import { Router } from 'express'
import * as attachmentController from '../controllers/attachment.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const attachmentRouter = Router()

attachmentRouter.use(requireAuth)
attachmentRouter.get('/:attachmentId/download', attachmentController.download)
attachmentRouter.delete('/:attachmentId', attachmentController.remove)
```

Modify `server/src/app.ts`:

```ts
import { attachmentRouter } from './routes/attachment.route.js'
import { taskAttachmentRouter } from './routes/task-attachment.route.js'

app.use('/api/v1/tasks/:taskId/attachments', taskAttachmentRouter)
app.use('/api/v1/attachments', attachmentRouter)
```

- [ ] **Step 7: Run tests and type check**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/attachments.test.ts
npm run typecheck
```

Expected: upload, download, and non-member rejection tests pass.

- [ ] **Step 8: Commit**

```bash
git add server
git commit -m "feat: add attachment APIs"
```

---

### Task 14: Attachment UI

**Files:**

- Create: `client/src/api/attachments.ts`
- Create: `client/src/components/attachments/AttachmentPanel.vue`
- Modify: `client/src/api/tasks.ts`
- Modify: `client/src/views/tasks/TaskDetailView.vue`
- Test: `client/tests/attachments.test.ts`

**Interfaces:**

- Consumes: `http`, `apiRequest<T>()`, task attachments from the task response, and attachment routes.
- Produces: `attachmentApi` and attachment upload/list/download/delete UI.

- [ ] **Step 1: Write the failing attachment API test**

Create `client/tests/attachments.test.ts`:

```ts
import MockAdapter from 'axios-mock-adapter'
import { beforeEach, describe, expect, it } from 'vitest'
import { attachmentApi } from '../src/api/attachments'
import { http } from '../src/api/http'

const mock = new MockAdapter(http)

beforeEach(() => mock.reset())

describe('attachmentApi', () => {
  it('uploads a file as multipart data', async () => {
    mock.onPost('/tasks/task-1/attachments').reply((config) => {
      expect(config.data).toBeInstanceOf(FormData)
      return [
        201,
        {
          code: 'OK',
          message: '附件上传成功',
          data: { id: 'attachment-1', originalName: 'note.txt' },
          requestId: 'request-1',
        },
      ]
    })

    const result = await attachmentApi.upload(
      'task-1',
      new File(['hello'], 'note.txt', { type: 'text/plain' }),
    )

    expect(result.id).toBe('attachment-1')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd client && npm test -- --run tests/attachments.test.ts`

Expected: FAIL because `attachmentApi` does not exist.

- [ ] **Step 3: Implement the attachment API**

Create `client/src/api/attachments.ts`:

```ts
import { apiRequest, http } from './http'

export interface Attachment {
  id: string
  taskId: string
  uploaderId: string
  originalName: string
  mimeType: string
  size: number
  createdAt: string
  uploader: { id: string; username: string; email: string }
}

export const attachmentApi = {
  upload(taskId: string, file: File) {
    const data = new FormData()
    data.append('file', file)

    return apiRequest<Attachment>({
      method: 'POST',
      url: `/tasks/${taskId}/attachments`,
      data,
    })
  },
  remove(attachmentId: string) {
    return apiRequest<null>({
      method: 'DELETE',
      url: `/attachments/${attachmentId}`,
    })
  },
  async download(attachment: Attachment) {
    const response = await http.get<Blob>(
      `/attachments/${attachment.id}/download`,
      { responseType: 'blob' },
    )
    const url = URL.createObjectURL(response.data)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = attachment.originalName
    anchor.click()
    URL.revokeObjectURL(url)
  },
}
```

Modify the `Task` interface in `client/src/api/tasks.ts`:

```ts
import type { Attachment } from './attachments'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string | null
  assignee: TaskUser | null
  creatorId: string
  creator: TaskUser
  dueDate: string | null
  createdAt: string
  updatedAt: string
  attachments: Attachment[]
}
```

- [ ] **Step 4: Implement the attachment panel and integrate it**

Create `client/src/components/attachments/AttachmentPanel.vue` with:

- Props: `taskId: string`, `attachments: Attachment[]`, `currentUserId: string`, `taskCreatorId: string`, `canManage: boolean`.
- Emits: `changed`.
- Uses `el-upload` with `:auto-upload="false"`, `:limit="1"`, and accepted `.pdf,.png,.jpg,.jpeg,.txt`.
- Rejects files larger than 5 MB before calling the API.
- Calls `attachmentApi.upload()`, then emits `changed`.
- Shows filename, uploader, size, download button, and delete button.
- Shows delete when the current user is uploader, task creator, or project owner.

Modify `client/src/views/tasks/TaskDetailView.vue`:

- Render `AttachmentPanel` in the `附件` section.
- Pass `task.attachments`.
- Reload the task after upload or delete so metadata stays authoritative.
- Show `暂无附件` when the array is empty.

- [ ] **Step 5: Run tests, type check, and build**

Run:

```bash
cd client
npm test -- --run tests/attachments.test.ts
npm run typecheck
npm run build
```

Expected: test, type check, and build pass.

- [ ] **Step 6: Commit**

```bash
git add client
git commit -m "feat: add attachment UI"
```

---

### Task 15: Dashboard API

**Files:**

- Create: `server/src/services/dashboard.service.ts`
- Create: `server/src/controllers/dashboard.controller.ts`
- Create: `server/src/routes/dashboard.route.ts`
- Modify: `server/src/app.ts`
- Test: `server/tests/dashboard.test.ts`

**Interfaces:**

- Consumes: `prisma`, `requireAuth`, and `sendSuccess`.
- Produces: `getDashboardSummary(userId)` and `GET /api/v1/dashboard/summary`.

- [ ] **Step 1: Write the failing dashboard test**

Create `server/tests/dashboard.test.ts`:

```ts
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app'
import { createAuthenticatedUser } from './helpers/auth'
import { resetDatabase } from './helpers/database'
import { createProjectWithOwner, createTask } from './helpers/factories'

const app = createApp()

beforeEach(resetDatabase)

describe('dashboard summary', () => {
  it('counts statuses, overdue tasks, and recent projects', async () => {
    const owner = await createAuthenticatedUser()
    const project = await createProjectWithOwner(owner.user.id, {
      name: 'Dashboard project',
    })

    await createTask(project.id, owner.user.id, {
      title: 'Todo',
      status: 'TODO',
      dueDate: new Date('2020-01-01T00:00:00.000Z'),
    })
    await createTask(project.id, owner.user.id, {
      title: 'Progress',
      status: 'IN_PROGRESS',
    })
    await createTask(project.id, owner.user.id, {
      title: 'Done',
      status: 'DONE',
    })

    const response = await request(app)
      .get('/api/v1/dashboard/summary')
      .set('Authorization', `Bearer ${owner.token}`)

    expect(response.status).toBe(200)
    expect(response.body.data.counts).toEqual({
      total: 3,
      todo: 1,
      inProgress: 1,
      done: 1,
      overdue: 1,
    })
    expect(response.body.data.recentProjects[0].name).toBe('Dashboard project')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/dashboard.test.ts
```

Expected: FAIL with 404 because the dashboard route does not exist.

- [ ] **Step 3: Implement the dashboard service**

Create `server/src/services/dashboard.service.ts`:

```ts
import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

export async function getDashboardSummary(userId: string) {
  const accessibleTask: Prisma.TaskWhereInput = {
    project: { members: { some: { userId } } },
  }

  const [
    total,
    todo,
    inProgress,
    done,
    overdue,
    recentProjects,
  ] = await prisma.$transaction([
    prisma.task.count({ where: accessibleTask }),
    prisma.task.count({ where: { ...accessibleTask, status: 'TODO' } }),
    prisma.task.count({
      where: { ...accessibleTask, status: 'IN_PROGRESS' },
    }),
    prisma.task.count({ where: { ...accessibleTask, status: 'DONE' } }),
    prisma.task.count({
      where: {
        ...accessibleTask,
        status: { not: 'DONE' },
        dueDate: { lt: new Date() },
      },
    }),
    prisma.project.findMany({
      where: { members: { some: { userId } } },
      select: { id: true, name: true, description: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])

  return {
    counts: { total, todo, inProgress, done, overdue },
    recentProjects,
  }
}
```

- [ ] **Step 4: Implement the dashboard controller and route**

Create `server/src/controllers/dashboard.controller.ts`:

```ts
import type { Request, Response } from 'express'
import { sendSuccess } from '../lib/response.js'
import { getDashboardSummary } from '../services/dashboard.service.js'

export async function summary(request: Request, response: Response) {
  sendSuccess(response, await getDashboardSummary(request.auth!.userId))
}
```

Create `server/src/routes/dashboard.route.ts`:

```ts
import { Router } from 'express'
import * as dashboardController from '../controllers/dashboard.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const dashboardRouter = Router()

dashboardRouter.use(requireAuth)
dashboardRouter.get('/summary', dashboardController.summary)
```

Modify `server/src/app.ts`:

```ts
import { dashboardRouter } from './routes/dashboard.route.js'

app.use('/api/v1/dashboard', dashboardRouter)
```

- [ ] **Step 5: Run tests and type check**

Run:

```bash
cd server
DATABASE_URL=file:./test.db npm test -- --run tests/dashboard.test.ts
npm run typecheck
```

Expected: dashboard count and recent-project test passes.

- [ ] **Step 6: Commit**

```bash
git add server
git commit -m "feat: add dashboard API"
```

---

### Task 16: Dashboard UI

**Files:**

- Create: `client/src/api/dashboard.ts`
- Modify: `client/src/views/DashboardView.vue`
- Test: `client/tests/dashboard.test.ts`

**Interfaces:**

- Consumes: `apiRequest<T>()` and `GET /dashboard/summary`.
- Produces: `dashboardApi` and the dashboard summary page.

- [ ] **Step 1: Write the failing dashboard API test**

Create `client/tests/dashboard.test.ts`:

```ts
import MockAdapter from 'axios-mock-adapter'
import { beforeEach, describe, expect, it } from 'vitest'
import { dashboardApi } from '../src/api/dashboard'
import { http } from '../src/api/http'

const mock = new MockAdapter(http)

beforeEach(() => mock.reset())

describe('dashboardApi', () => {
  it('loads summary counts', async () => {
    mock.onGet('/dashboard/summary').reply(200, {
      code: 'OK',
      message: 'success',
      data: {
        counts: { total: 3, todo: 1, inProgress: 1, done: 1, overdue: 0 },
        recentProjects: [],
      },
      requestId: 'request-1',
    })

    const result = await dashboardApi.summary()

    expect(result.counts.total).toBe(3)
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd client && npm test -- --run tests/dashboard.test.ts`

Expected: FAIL because `dashboardApi` does not exist.

- [ ] **Step 3: Implement the dashboard API and view**

Create `client/src/api/dashboard.ts`:

```ts
import { apiRequest } from './http'

export interface DashboardSummary {
  counts: {
    total: number
    todo: number
    inProgress: number
    done: number
    overdue: number
  }
  recentProjects: Array<{
    id: string
    name: string
    description: string
    updatedAt: string
  }>
}

export const dashboardApi = {
  summary() {
    return apiRequest<DashboardSummary>({
      method: 'GET',
      url: '/dashboard/summary',
    })
  },
}
```

Modify `client/src/views/DashboardView.vue`:

- Load `dashboardApi.summary()` on mount.
- Show five compact statistic cards: `全部任务`, `待处理`, `进行中`, `已完成`, `逾期`.
- Show a completion progress bar calculated as `done / total`, treating zero total as 0 percent.
- Render recent projects in an Element Plus table with name, description, and update time.
- Make project rows route to `/projects/:projectId`.
- Show `暂无项目` when the recent-project array is empty.
- Handle loading and request failure without removing the page structure.

- [ ] **Step 4: Run tests, type check, and build**

Run:

```bash
cd client
npm test -- --run tests/dashboard.test.ts
npm run typecheck
npm run build
```

Expected: test, type check, and build pass.

- [ ] **Step 5: Commit**

```bash
git add client
git commit -m "feat: add dashboard UI"
```

---

### Task 17: Playwright End-to-End Smoke Test

**Files:**

- Create: `client/playwright.config.ts`
- Create: `client/e2e/taskflow.spec.ts`
- Modify: `client/package.json`
- Modify: `server/package.json`
- Create: `server/scripts/prepare-e2e.ts`

**Interfaces:**

- Consumes: both dev servers, the development database, and all user-facing flows.
- Produces: one runnable `npm run test:e2e` command from `client`.

- [ ] **Step 1: Install Playwright and create the test preparation script**

Run:

```bash
cd client
npm install -D @playwright/test
npx playwright install chromium
```

Create `server/scripts/prepare-e2e.ts`:

```ts
import { execFileSync } from 'node:child_process'

process.env.DATABASE_URL = 'file:./e2e.db'

execFileSync('npx', ['prisma', 'db', 'push', '--force-reset'], {
  stdio: 'inherit',
  env: process.env,
})

execFileSync('npx', ['prisma', 'db', 'seed'], {
  stdio: 'inherit',
  env: process.env,
})
```

Add to `server/package.json`:

```json
{
  "scripts": {
    "e2e:prepare": "tsx scripts/prepare-e2e.ts",
    "dev:e2e": "cross-env NODE_ENV=test DATABASE_URL=file:./e2e.db JWT_SECRET=test-secret-with-at-least-16-characters UPLOAD_DIR=./uploads/e2e CLIENT_ORIGIN=http://127.0.0.1:5173 tsx src/server.ts"
  }
}
```

Install `cross-env`:

```bash
cd server
npm install -D cross-env
```

- [ ] **Step 2: Write the failing end-to-end test**

Create `client/e2e/taskflow.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('registers, creates a project and task, comments, and logs out', async ({
  page,
}) => {
  const suffix = Date.now()
  const username = `learner_${suffix}`
  const email = `${username}@example.com`

  await page.goto('/register')
  await page.getByLabel('用户名').fill(username)
  await page.getByLabel('邮箱').fill(email)
  await page.getByLabel('密码').fill('password123')
  await page.getByRole('button', { name: '注册' }).click()

  await expect(page).toHaveURL(/dashboard/)

  await page.goto('/projects')
  await page.getByRole('button', { name: '新建项目' }).click()
  await page.getByLabel('项目名称').fill('E2E 项目')
  await page.getByRole('button', { name: '保存' }).click()
  await page.getByText('E2E 项目').click()

  await page.getByRole('button', { name: '新建任务' }).click()
  await page.getByLabel('任务标题').fill('E2E 任务')
  await page.getByRole('button', { name: '保存' }).click()
  await page.getByText('E2E 任务').click()

  await page.getByLabel('评论内容').fill('E2E 评论')
  await page.getByRole('button', { name: '发布评论' }).click()
  await expect(page.getByText('E2E 评论')).toBeVisible()

  await page.getByRole('button', { name: '退出登录' }).click()
  await expect(page).toHaveURL(/login/)
})
```

- [ ] **Step 3: Create the Playwright configuration**

Create `client/playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run e2e:prepare && npm run dev:e2e',
      cwd: '../server',
      url: 'http://127.0.0.1:3000/api/v1/health',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      cwd: '.',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
```

Add to `client/package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

The server must bind to `0.0.0.0` when `NODE_ENV=test`. Modify `server/src/server.ts`:

```ts
const host = env.NODE_ENV === 'test' ? '0.0.0.0' : '127.0.0.1'

server.listen(env.PORT, host, () => {
  console.log(`API listening on http://${host}:${env.PORT}`)
})
```

- [ ] **Step 4: Run the test and verify it fails**

Run: `cd client && npm run test:e2e`

Expected: the test starts both applications and fails on the first missing label or control before the end-to-end flow is complete.

- [ ] **Step 5: Align accessible labels and controls until the flow passes**

Update the relevant Vue components:

- Registration inputs must use labels `用户名`, `邮箱`, and `密码`.
- Registration submit button text must be `注册`.
- Project form input must use label `项目名称`.
- Project and task dialog submit buttons must use text `保存`.
- Task form title input must use label `任务标题`.
- New task button text must be `新建任务`.
- Comment textarea must use label `评论内容`.
- Comment submit button text must be `发布评论`.
- Logout button text must be `退出登录`.

Run:

```bash
cd client
npm run test:e2e
```

Expected: one passing Chromium smoke test.

- [ ] **Step 6: Commit**

```bash
git add client server
git commit -m "test: add end-to-end smoke test"
```

---

### Task 18: Logging, Rate Limiting, Complete Documentation, and Final Verification

**Files:**

- Create: `server/src/config/logger.ts`
- Modify: `server/src/app.ts`
- Modify: `server/src/routes/auth.route.ts`
- Modify: `README.md`
- Modify: `.gitignore`
- Modify: `server/.env.example`
- Conditional modify: any implementation file whose verification command fails during this task

**Interfaces:**

- Consumes: all previous tasks.
- Produces: structured request logging, login throttling, complete setup documentation, and a fully verified repository.

- [ ] **Step 1: Install logging and rate-limit dependencies**

Run:

```bash
cd server
npm install pino pino-http express-rate-limit
npm install -D @types/pino-http
```

- [ ] **Step 2: Implement structured logging**

Create `server/src/config/logger.ts`:

```ts
import pino from 'pino'
import { env } from './env.js'

export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : 'info',
  base: null,
})
```

Modify `server/src/app.ts` before route registration:

```ts
import pinoHttp from 'pino-http'
import { logger } from './config/logger.js'

app.use(
  pinoHttp({
    logger,
    genReqId: (_request, response) => response.locals.requestId,
  }),
)
```

Keep `requestContext` before `pinoHttp`.

- [ ] **Step 3: Add login rate limiting**

Modify `server/src/routes/auth.route.ts`:

```ts
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({
      code: 'RATE_LIMITED',
      message: '登录尝试过于频繁，请稍后再试',
      details: null,
      requestId: response.locals.requestId,
    })
  },
})

authRouter.post('/login', loginLimiter, authController.login)
```

Update the error middleware only if the installed `express-rate-limit` version does not use the configured JSON message directly.

- [ ] **Step 4: Replace the initial README with complete operating instructions**

Write `README.md` with:

```markdown
# TaskFlow

Vue 3 + Element Plus + Express + Prisma 全栈任务管理系统。

## 环境要求

- Node.js 20+
- npm 10+
- Git

## 后端

```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

接口地址：`http://localhost:3000/api/v1`

种子账号：

- `owner@example.com` / `password123`
- `member@example.com` / `password123`

## 前端

```bash
cd client
npm install
npm run dev
```

访问：`http://localhost:5173`

## 测试

```bash
cd server
DATABASE_URL=file:./test.db npm test
npm run typecheck

cd ../client
npm test
npm run typecheck
npm run build
npm run test:e2e
```

## 项目功能

- 注册、登录和 JWT 鉴权
- 项目与成员管理
- 任务创建、筛选、分页和状态流转
- 评论
- 附件上传、下载和删除
- 看板统计

## 安全说明

本项目使用 JWT 和 `localStorage` 作为学习用认证方案。生产环境应进一步评估 Refresh Token、HttpOnly Cookie、CSRF 和密钥轮换。
```

- [ ] **Step 5: Run the complete verification suite**

Run:

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

Expected:

- Server type check passes.
- All server tests pass.
- Server build passes.
- Client type check passes.
- All client tests pass.
- Client build passes.
- Chromium smoke test passes.

If any command fails, fix the implementation and re-run that command before continuing.

- [ ] **Step 6: Verify repository cleanliness and ignore rules**

Run:

```bash
git status --short
git check-ignore server/uploads server/prisma/dev.db server/.env client/dist server/dist
```

Expected:

- `.env`, database files, upload files, and build directories are ignored.
- Only intended source and documentation files are tracked.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: complete TaskFlow documentation and hardening"
```

---

## Final Acceptance Checklist

- [ ] Backend registration, login, and JWT-protected routes work.
- [ ] Project owner and member rules are enforced in services and verified by tests.
- [ ] Task assignment rejects non-members.
- [ ] Task filters and pagination match the spec.
- [ ] Comments enforce author-or-owner deletion rules.
- [ ] Attachments are size/type limited, authorization checked, and not publicly served.
- [ ] Deleting a project or task cleans attachment records and best-effort removes files.
- [ ] Dashboard counts are scoped to the current user's projects.
- [ ] Client route guards restore and validate authentication.
- [ ] Element Plus UI covers loading, empty, error, and success states.
- [ ] Server integration tests, client unit tests, and the Playwright smoke test pass.
- [ ] README supports a clean checkout on a new machine.
