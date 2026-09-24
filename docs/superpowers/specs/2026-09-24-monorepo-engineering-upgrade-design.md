# TaskFlow Monorepo 工程升级设计

## 文档定位

本文档定义 TaskFlow 从“根目录工具加两个独立项目”迁移到 pnpm workspace 与 Turborepo 的设计边界、目标结构、迁移步骤和验收标准。

本轮不迁移后端框架，不更换数据库，不实现业务功能。Express 5、Prisma、SQLite 和现有 API 行为保持不变。

## 背景

当前仓库已经具备：

- `client` 和 `server` 两个独立应用。
- 根目录联调启动脚本。
- 根目录 Prettier、cspell、EditorConfig 和 Git hooks。
- 后端环境变量校验、健康检查、统一错误处理和请求 ID。
- 前端 Vue 3、Vue Router、Pinia、Axios 和 Element Plus 基础入口。

当前主要问题：

- 根目录、前端和后端分别维护依赖与锁文件，依赖图不统一。
- 根目录命令只覆盖开发和格式化，缺少统一的测试、类型检查、构建、lint 和清理入口。
- 前后端配置重复且缺少共享边界。
- 错误码、响应结构和健康检查契约尚未形成前后端共享定义。
- 没有实际 CI 工作流验证提交质量。

## 设计目标

- 建立单一 pnpm workspace 和唯一根锁文件。
- 使用 Turborepo 编排构建、测试、类型检查、lint 和开发任务。
- 使用 `apps/*` 与 `packages/*` 表达主流 monorepo 边界。
- 提供共享 TypeScript、ESLint 和 Vitest 配置。
- 以后端现有 Zod 作为唯一接口契约来源。
- 提供可在本地和 CI 重复执行的质量门禁。
- 保持现有前端页面、后端接口和 SQLite 数据行为不变。

## 非目标

- 不迁移到 NestJS、Fastify 或其他后端框架。
- 不迁移到 PostgreSQL。
- 不实现 Prisma 数据模型、认证或业务 API。
- 不安装 Playwright，等到端到端业务链路具备后再接入。
- 不引入 Nx、微服务、消息队列或独立发布流水线。

## 目标结构

```text
taskflow-fullstack/
├── apps/
│   ├── client/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── server/
│       ├── src/
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── config/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── contracts/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── docs/
├── scripts/
├── .github/workflows/ci.yml
├── .nvmrc
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── turbo.json
```

包名统一为：

- `@taskflow/client`
- `@taskflow/server`
- `@taskflow/config`
- `@taskflow/contracts`

## 包边界

### `@taskflow/client`

保留 Vue 3、Vite、Vue Router、Pinia、Axios 和 Element Plus。

职责：

- 页面、组件、路由和状态管理。
- 浏览器端 API 调用。
- 前端单元测试和构建。

### `@taskflow/server`

保留 Express 5、TypeScript、Prisma 和 SQLite。

职责：

- HTTP 应用、路由、控制器、服务和中间件。
- Prisma 数据访问和迁移。
- 后端集成测试和生产构建。

### `@taskflow/config`

只承载跨包工具配置，不包含业务代码。

职责：

- 共享 TypeScript 基础配置。
- 共享 ESLint 基础、Node 和 Vue 配置。
- 可复用的 Vitest 基础配置。

### `@taskflow/contracts`

以后端现有 Zod 作为接口契约唯一来源。

首个版本覆盖：

- 统一成功响应结构。
- 统一错误响应结构。
- 稳定错误码类型。
- 健康检查数据结构和类型。

前端、后端和测试通过 workspace 依赖引用契约，不复制接口字段和错误码。

## 版本策略

- Node.js 固定为 `>=22.22.3 <23.0.0`，通过 `.nvmrc`、根 `engines` 和 CI 保持一致。
- pnpm 固定为 `10.17.0`，只在根 `package.json` 声明 `packageManager`。
- 根目录维护唯一 `pnpm-lock.yaml`。
- 删除根目录和子包的 npm 锁文件以及子包 pnpm 锁文件。
- 应用和共享包继续使用各自 `package.json` 管理运行依赖和开发依赖。

## Turborepo 任务设计

根目录提供：

```text
pnpm dev
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm format
pnpm format:check
pnpm clean
```

任务规则：

- `build` 依赖上游包的 `build`，输出各自的 `dist`。
- `typecheck` 依赖上游包构建，避免引用未生成的契约声明。
- `test` 依赖上游包构建，保证集成测试使用最新共享包。
- `lint` 不缓存跨包环境差异，保证所有包都被检查。
- `dev` 不缓存、保持长驻，并先完成共享包构建。
- `format` 和 `format:check` 由根目录统一处理。
- `clean` 清理构建、覆盖率和 Turborepo 缓存。

各 workspace 包保留独立命令，既支持 Turborepo 调度，也支持进入包目录单独运行。

## 开发任务

`pnpm dev` 的执行顺序：

1. 构建 `@taskflow/contracts`。
2. 启动 contracts 的 TypeScript 监听。
3. 启动 Vite 前端。
4. 启动 Express 后端。
5. 任一非监听任务失败时停止其他进程。
6. 按 `Ctrl+C` 时统一停止所有子进程。

前端默认地址保持 `http://127.0.0.1:5173/`。

后端默认地址保持 `http://127.0.0.1:3000`。

健康检查地址保持 `http://127.0.0.1:3000/api/v1/health`。

## CI 设计

GitHub Actions 在推送和 Pull Request 时执行：

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

CI 使用 Node.js 22 和 pnpm 10.17.0；本地可安装范围与包声明保持为
`>=22.22.3 <23.0.0`。

缓存范围：

- pnpm 下载缓存。
- Turborepo 本地任务缓存。

CI 不启动监听模式，不依赖本地 `.env`，不执行尚未接入的 Playwright 流程。

## 错误处理

- 迁移过程中保留现有 `AppError` 和统一错误中间件行为。
- `@taskflow/contracts` 只抽取稳定协议，不吞并 Express 错误处理职责。
- 契约解析失败继续由现有 Zod 错误转换逻辑返回 `VALIDATION_ERROR`。
- 迁移完成后，现有错误处理和请求 ID 测试必须保持通过。

## 数据与兼容性

- 不修改 Prisma schema、迁移和 SQLite 文件。
- 不修改环境变量含义。
- 路径变化后更新 `server/.env.example` 的使用说明和启动脚本。
- 现有 API 路径、响应字段和状态码保持不变。
- 旧锁文件删除后，依赖版本以迁移前锁文件为基线；需要升级时单独提交。

## 迁移步骤

### 提交一：迁移 workspace 与目录结构

1. 使用 Git 移动 `client` 到 `apps/client`。
2. 使用 Git 移动 `server` 到 `apps/server`。
3. 更新包名、脚本路径、环境文件路径和文档引用。
4. 新增 `pnpm-workspace.yaml`。
5. 删除 npm 锁文件和子包锁文件。
6. 在 Node.js 22 下生成唯一根锁文件。

### 提交二：共享配置、契约与静态检查

1. 建立 `@taskflow/config`，抽取 TypeScript、ESLint 和 Vitest 基础配置。
2. 建立 `@taskflow/contracts`，抽取响应结构、错误码和健康检查契约。
3. 让后端实际引用共享契约。
4. 为前端、后端和配置包补齐 ESLint。
5. 保持现有测试通过。

### 提交三：Turborepo、统一命令、CI 与文档

1. 新增 `turbo.json` 和根任务脚本。
2. 更新联调启动脚本，使其适配 Turborepo。
3. 新增 GitHub Actions 质量门禁。
4. 更新 README、框架路线图和进度文档。
5. 验证开发、测试、类型检查、构建和清理命令。

## 验收标准

- 根目录执行一次 `pnpm install --frozen-lockfile` 可以安装全部依赖。
- 仓库只保留根 `pnpm-lock.yaml`。
- `pnpm -r` 可以识别全部 workspace 包。
- `pnpm dev` 可以启动前端、后端和 contracts 监听。
- `pnpm build`、`pnpm test`、`pnpm typecheck`、`pnpm lint` 和 `pnpm clean` 均可用。
- `pnpm format:check` 通过。
- 前端测试、类型检查和生产构建通过。
- 后端测试、类型检查和生产构建通过。
- 健康检查响应和现有错误响应结构不变。
- GitHub Actions 的格式、lint、类型、测试和构建门禁通过。
- README 中的安装、启动、测试和验证命令与仓库实际结构一致。

## 风险与回滚

主要风险：

- 目录移动会造成相对路径、脚本和环境文件引用遗漏。
- Turborepo 缓存配置错误可能让任务跳过必要构建。
- workspace 提升依赖可能暴露未声明的隐式依赖。
- ESLint 首次接入可能发现大量历史问题。

控制方式：

- 按三个提交拆分，每一步都执行对应检查。
- CI 使用冻结锁文件和关闭远程缓存的完整验证流程。
- 首次 lint 只阻塞确定性问题，不为通过检查而降低类型约束。
- 迁移提交保留清晰差异，发生问题时可按提交顺序回滚。

本设计不包含数据库迁移或不可逆数据变更，回滚不涉及数据恢复。
