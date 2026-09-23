# TaskFlow

TaskFlow 是一个用于练习全栈开发的项目、任务和成员协作系统。本仓库包含 Vue 前端、Express 后端、需求文档、交互原型和实施计划。

## 技术栈

- 前端：Vue 3、TypeScript、Vite、Pinia、Vue Router、Element Plus
- 后端：Node.js、TypeScript、Express、Prisma
- 测试：Vitest、Vue Test Utils、Supertest、Playwright
- 包管理：pnpm

## 环境要求

- Node.js 20 或更高版本
- pnpm 10 或兼容版本

## 项目结构

```text
client/   前端应用
server/   后端服务
docs/     需求、设计、原型和进度文档
```

## 快速开始

根目录安装仓库级工具：

```bash
pnpm install
```

启动前端开发服务：

```bash
cd client
pnpm install
pnpm dev
```

启动后端开发服务：

```bash
cd server
pnpm install
pnpm dev
```

后端默认监听 `http://127.0.0.1:3000`，健康检查地址为 `http://127.0.0.1:3000/api/v1/health`。首次启动前需要根据 `server/.env.example` 创建本地 `server/.env`。

## 验证命令

在仓库根目录执行格式检查：

```bash
pnpm format:check
```

前端测试和类型检查：

```bash
cd client
pnpm test:run
pnpm typecheck
```

后端测试、类型检查和构建：

```bash
cd server
pnpm test
pnpm typecheck
pnpm build
```

项目协作规范见 `AGENTS.md`，当前进度见 `docs/PROGRESS.md`。
