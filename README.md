# TaskFlow

TaskFlow 是一个用于练习全栈开发的项目、任务和成员协作系统。本仓库包含 Vue 前端、Express 后端、需求文档、交互原型和实施计划。

## 技术栈

- 前端：Vue 3、TypeScript、Vite、Pinia、Vue Router、Element Plus
- 后端：Node.js、TypeScript、Express、Prisma
- 测试：Vitest、Vue Test Utils、Supertest、Playwright
- 包管理：pnpm
- 工程化：pnpm workspace、Turborepo、ESLint、Prettier、Vitest

## 环境要求

- Node.js `>=22.22.3 <23.0.0`
- pnpm 10.17.0

## 项目结构

```text
apps/client/        Vue 前端应用
apps/server/        Express 后端服务
packages/config/    共享工程配置
packages/contracts/ Zod 接口契约
docs/               需求、设计、原型和进度文档
scripts/            根目录开发与校验脚本
```

## 快速开始

```bash
nvm use
corepack pnpm install
pnpm dev
```

首次启动前，根据 `apps/server/.env.example` 创建本地环境配置。

前端默认监听 `http://127.0.0.1:5173/`，后端默认监听 `http://127.0.0.1:3000`，健康检查地址为 `http://127.0.0.1:3000/api/v1/health`。按 `Ctrl+C` 会停止所有开发任务。

也可以分别启动。单包命令不会自动构建 `@taskflow/contracts`；在干净仓库中先构建共享契约，再执行目标包命令：

```bash
pnpm --filter @taskflow/contracts build
pnpm --filter @taskflow/client dev
pnpm --filter @taskflow/server dev
```

## 验证命令

在仓库根目录执行：

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

项目协作规范见 `AGENTS.md`，当前进度见 `docs/PROGRESS.md`，框架建设待办见 `docs/architecture/framework-roadmap.md`。
