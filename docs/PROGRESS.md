# TaskFlow 项目进度与恢复说明

## 文档用途

本文档用于快速恢复项目上下文。新的 Codex 会话、未来的自己或协作者在开始修改前，应先阅读：

1. `AGENTS.md`
2. 本文档
3. `docs/requirements/README.md`
4. `docs/superpowers/specs/2026-09-23-taskflow-design.md`
5. `docs/architecture/framework-roadmap.md`
6. 当前任务对应的 `docs/superpowers/plans/2026-09-23-taskflow-implementation.md` 章节

本文档记录“已经做了什么、为什么这样做、当前处于什么状态、下一步从哪里继续”。

## 当前快照

| 项目         | 当前状态                                                |
| ------------ | ------------------------------------------------------- |
| 日期         | 2026-09-24                                              |
| Git 分支     | `main`                                                  |
| Task 3 基线  | `2596a4a fix: 修复共享契约审查问题`                     |
| 远端状态     | 本地 `main` 领先 `origin/main`，待统一同步              |
| 工作区       | Task 3 已完成本地验收，提交状态以 Git 历史为准          |
| 仓库结构     | pnpm workspace，包含 apps 和 packages 包                |
| 根目录工具链 | Turborepo、ESLint、Prettier、cspell、Git hooks          |
| 质量门禁     | 已增加 GitHub Actions，覆盖格式、lint、类型、测试和构建 |
| 后端         | 基础工程、健康检查、统一错误处理和请求 ID 已完成        |
| 前端         | 已初始化，可开发、测试、类型检查和构建                  |
| 需求与设计   | 已完成第一版基线                                        |
| 交互原型     | 已完成 HTML 原型和桌面截图                              |

当前本地 Node.js 为 `v22.22.3`，pnpm 为 `v10.17.0`，与 `.nvmrc` 和 CI 配置一致。

## 已完成内容

### 1. 设计、需求和实施基线

已完成：

- 项目设计文档和设计决策。
- 60 条带编号的功能需求。
- 用户流程、权限矩阵、页面状态和响应式要求。
- API 与数据契约、错误码和删除规则。
- 验收与测试追踪矩阵。
- 19 个纵向功能切片任务的中文实施计划。

关键文件：

- `docs/superpowers/specs/2026-09-23-taskflow-design.md`
- `docs/requirements/01-product-requirements.md`
- `docs/requirements/02-user-flows-and-permissions.md`
- `docs/requirements/03-functional-specification.md`
- `docs/requirements/04-api-and-data-contracts.md`
- `docs/requirements/05-acceptance-and-test-matrix.md`
- `docs/superpowers/plans/2026-09-23-taskflow-implementation.md`

为什么这样做：

- 这是新项目，没有现成代码可供推断，因此先固定范围、接口和权限，避免边写边猜。
- 需求编号可以连接功能、接口、测试和验收，后续修改时有稳定引用。
- 采用纵向功能切片，每个任务都要求测试、类型检查和提交，避免把前后端联调推迟到最后。

### 2. 高保真桌面原型

已完成：

- 登录、看板、项目列表、项目详情、成员、项目设置和任务详情视图。
- 搜索、筛选、标签页、弹窗、任务跳转和退出等交互。
- `任务`与`成员`菜单独立激活状态。
- “我的项目”能够切换项目名称、描述、面包屑和激活状态。
- 1440 x 900、1920 x 1080 两组桌面截图。

关键文件：

- `docs/product/prototypes/taskflow-prototype.html`
- `docs/product/screenshots/dashboard-1440x900.png`
- `docs/product/screenshots/dashboard-1920x1080.png`
- `docs/product/screenshots/project-detail-1440x900.png`
- `docs/product/screenshots/project-detail-1920x1080.png`

为什么这样做：

- 使用可交互 HTML 确认信息层级和操作路径，比纯图片更容易落到 Vue 组件。
- 原型按 Element Plus 的桌面密度和状态色设计，降低后续返工。
- 先验证两种桌面尺寸，避免把明显的布局问题带到实现阶段。

### 3. 仓库级自动格式化

已完成：

- Prettier 统一格式化。
- EditorConfig 统一换行、字符集和缩进。
- VS Code 保存时自动格式化。
- 全仓 `format` 和 `format:check` 脚本。
- Markdown、Vue、TypeScript、JSON、CSS、HTML 和 YAML 使用同一规则。

关键文件：

- `package.json`
- `.prettierrc.json`
- `.prettierignore`
- `.editorconfig`
- `.vscode/settings.json`
- `.vscode/extensions.json`

为什么这样做：

- 减少格式差异对代码审查的干扰。
- 让编辑器、本地脚本和后续 CI 使用同一标准。
- 根目录统一承载 workspace 工具，`apps/client` 和 `apps/server` 共用根依赖图和锁文件。

### 4. 项目级 AI 协作规范

已完成：

- 中文沟通、中文 UI 文案和中文提交摘要。
- JavaScript/TypeScript JSDoc 规则。
- Vue 模板区块注释规则。
- 权限、事务、校验、文件生命周期和错误恢复的业务注释规则。
- 中文 Pull Request 模板和提交模板。

关键文件：

- `AGENTS.md`
- `.gitmessage`
- `.github/pull_request_template.md`

为什么这样做：

- 新 AI 会话可以直接读取项目规则，不再依赖用户重复说明。
- 注释重点放在业务原因、约束和边界条件，而不是逐行复述代码。
- 中文提交和 PR 模板让历史记录更容易被本人回看。

### 5. 提交前自动校验

已完成：

- 提交前检查暂存区与工作区是否一致。
- Prettier、cspell 和 `git diff --check`。
- 常见中文和英文错别字。
- 合并冲突标记、`debugger`、测试 `.only` 和 TODO。
- 疑似密码、Token、API Key 和私钥。
- 明显不专业或不合适的表达。
- 提交信息格式和中文摘要校验。

关键文件：

- `.githooks/pre-commit`
- `.githooks/commit-msg`
- `scripts/setup-git-hooks.mjs`
- `scripts/validate-staged.mjs`
- `scripts/validate-commit-message.mjs`
- `.cspell.json`

为什么这样做：

- 确定性检查可以阻止明显问题进入历史，不依赖每次都由 AI 自觉发现。
- 钩子同时覆盖 AI 和人工提交，避免手动提交绕过规则。
- 中文语义是否得体仍由 AI 在提交前阅读完整暂存差异，脚本负责机械检查。

### 6. 前端初始化

已完成：

- Vue 3、TypeScript、Vite 基础工程。
- Vue Router、Pinia、Axios 和 Element Plus 入口接入。
- 应用根组件、基础路由、全局样式和工程状态首页。
- 应用外壳组件测试。
- 前端独立 `package.json` 和 `.env.example`，依赖由根 workspace 统一管理。

关键文件：

- `apps/client/package.json`
- `apps/client/vite.config.ts`
- `apps/client/src/main.ts`
- `apps/client/src/App.vue`
- `apps/client/src/router/index.ts`
- `apps/client/src/views/HomeView.vue`
- `apps/client/src/styles/base.css`
- `apps/client/tests/app-shell.test.ts`

为什么这样做：

- 先建立稳定的前端入口和插件顺序，后续认证、项目和任务页面可以直接挂接。
- 前端依赖独立安装，保持与后端解耦。
- Element Plus 固定为 `2.11.8`，Vite 使用 5.x，避免初始化阶段引入 Node.js 版本不兼容。
- 任务 5 已先完成，但没有加入依赖后端 API 的认证和业务逻辑。

### 7. 后端基础与健康检查

已完成：

- `apps/server` workspace 包。
- TypeScript 开发、构建、测试和类型检查脚本。
- 环境变量校验、Express 基础中间件和统一应用工厂。
- `GET /api/v1/health` 健康检查接口。
- 健康检查集成测试、类型检查和生产构建验证。

关键文件：

- `apps/server/package.json`
- `apps/server/tsconfig.json`
- `apps/server/tsconfig.build.json`
- `apps/server/vitest.config.mts`
- `apps/server/.env.example`
- `apps/server/src/config/env.ts`
- `apps/server/src/app.ts`
- `apps/server/src/server.ts`
- `apps/server/src/routes/health.route.ts`
- `apps/server/tests/health.test.ts`

为什么这样做：

- 先建立可独立启动、可测试的后端入口，后续错误处理、数据库和认证功能可以直接挂接。
- 环境变量在进程启动阶段完成校验，避免配置错误延迟到具体请求才暴露。
- Vitest 配置使用 `.mts`，兼容 CommonJS 生产构建和 ESM 配置加载。
- 任务 1 只实现健康检查，不提前引入 Prisma、认证或业务 API。

### 8. 统一错误处理和请求 ID

已完成：

- `AppError` 业务错误类型和统一成功响应工具。
- 每个请求通过 `randomUUID()` 生成唯一 `requestId`。
- `ROUTE_NOT_FOUND`、`VALIDATION_ERROR`、`INTERNAL_SERVER_ERROR` 统一响应。
- Zod 校验错误转换为字段级 `details`。
- 未知异常只记录服务端日志，不向客户端泄露堆栈或内部路径。
- 健康检查改用统一成功响应，错误处理和请求 ID 集成测试。

关键文件：

- `apps/server/src/lib/app-error.ts`
- `apps/server/src/lib/response.ts`
- `apps/server/src/middlewares/error-handler.ts`
- `apps/server/src/middlewares/not-found.ts`
- `apps/server/src/middlewares/request-context.ts`
- `apps/server/src/types/express.d.ts`
- `apps/server/src/app.ts`
- `apps/server/src/routes/health.route.ts`
- `apps/server/tests/error-handling.test.ts`
- `apps/server/tests/health.test.ts`

为什么这样做：

- 业务错误在 Service 层抛出 `AppError`，HTTP 序列化只由全局错误中间件处理。
- `requestId` 由请求上下文生成，可以在成功响应、错误响应和日志之间关联同一次请求。
- 未知异常响应不包含堆栈和内部路径，避免把服务端实现细节暴露给客户端。
- 当前日志使用临时 `console.error` 记录未知异常，任务 18 再替换为结构化日志。

### 9. 根目录联调启动脚本

已完成：

- 根目录新增 `pnpm dev` 脚本。
- 同时启动 Vite 前端和 Express 后端，并按 `Ctrl+C` 统一停止。
- 启动前检查 `apps/server/.env`，缺少环境配置时给出中文提示。
- Turbo 统一调度 contracts、前端和后端的开发任务。

关键文件：

- `package.json`
- `scripts/dev.mjs`
- `README.md`

为什么这样做：

- 开发时不需要分别打开两个终端和目录。
- 根脚本负责子进程生命周期，避免其中一个服务退出后另一个继续运行。
- 不额外引入进程管理依赖，使用 Node.js 标准库即可完成。

### 10. 框架建设路线图

已完成：

- 从工程框架角度整理 P0、P1、P2 待办。
- 明确 pnpm workspace、统一命令、CI、共享配置、接口契约和运行时建设顺序。
- 每个工作项记录实施原因、业务收益和可验证的完成标准。
- 将业务功能实现与框架建设范围分开。

关键文件：

- `docs/architecture/framework-roadmap.md`
- `README.md`

为什么这样做：

- 当前最大短板是工程平台能力，而不是业务页面数量。
- 在任务 3 的数据层开始前，先统一依赖、命令、CI 和共享边界，可以降低后续返工。
- 单独记录框架待办，避免与业务需求和实施计划混在一起。

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

## 当前可运行命令

### 根目录

```bash
corepack pnpm install
pnpm dev
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm clean
pnpm format
pnpm format:check
pnpm commit:check
```

提交信息检查：

```bash
printf 'feat: 增加示例功能\n' | pnpm commit:message
```

### 前端

```bash
pnpm --filter @taskflow/client dev
pnpm --filter @taskflow/client test
pnpm --filter @taskflow/client typecheck
pnpm --filter @taskflow/client build
```

默认开发地址为 `http://127.0.0.1:5173/`。如果端口被占用，Vite 会自动选择下一个可用端口。

### 后端

```bash
pnpm --filter @taskflow/server dev
pnpm --filter @taskflow/server test
pnpm --filter @taskflow/server typecheck
pnpm --filter @taskflow/server build
```

默认健康检查地址为 `http://127.0.0.1:3000/api/v1/health`。首次启动前需要根据 `apps/server/.env.example` 创建本地 `apps/server/.env`。

## 已验证结果

- 前端应用外壳测试通过。
- `vue-tsc` 类型检查通过。
- Vite 生产构建通过。
- 无头浏览器可以渲染 `TaskFlow` 和“前端基础工程已就绪”。
- 后端健康检查测试通过。
- 后端错误处理和请求 ID 测试通过。
- 后端 TypeScript 类型检查通过。
- 后端生产构建通过。
- Prettier、cspell 和暂存区校验通过。
- `pre-commit` 和 `commit-msg` 已在真实提交中执行。
- Task 3 冻结安装、格式、lint、类型检查、测试、构建和清理命令均通过。
- 根 `pnpm lint` 已消除 Vue 纯排版警告，4 个 workspace lint 任务全部通过。
- 根 `pnpm test` 运行 contracts、前端和后端共 11 个用例，全部通过；服务端测试需要本地监听权限。
- `pnpm dev` 实际启动 contracts watch、Vite 和 tsx watch，前端返回 TaskFlow HTML，健康检查返回 `code: "OK"`、`data.status: "ok"` 和 `requestId`。
- `Ctrl+C` 后本次启动的 workspace 进程全部退出，5173 和 3000 端口不再监听。

## 已知限制与风险

- 后端目前只有健康检查、统一错误处理和请求 ID，数据库、认证和业务 API 尚未实现。
- 结构化 HTTP 日志尚未实现，未知异常暂由 `console.error` 记录。
- Element Plus 当前在入口全量安装，生产构建有单个 JS 包超过 500 kB 的提示；后续可按路由和组件做按需加载。
- 尚未建立测试分层；Playwright 和端到端测试按后续任务接入。
- GitHub Actions 已声明质量门禁，但本次本地验收不能替代远端工作流运行结果。
- 原型 HTML 与 Vue 页面是两个阶段，原型不是最终组件实现。

## 下一阶段推荐顺序

Monorepo 工程升级 Task 1 至 Task 3、原任务 1、原任务 2 和前端任务 5 已完成。
下一步继续实现后端基础设施：

1. 框架 F-07、F-08：后端运行时生命周期、日志和错误分类。
2. 框架 F-10：测试分层和覆盖率策略。
3. 原实施计划任务 3：Prisma 数据模型、迁移、测试数据库和种子数据。
4. 原实施计划任务 4 及后续：认证和业务功能。

每个任务继续按以下顺序推进：

1. 写失败测试。
2. 确认失败原因正确。
3. 写最小实现。
4. 确认测试通过。
5. 运行类型检查。
6. 运行 `pnpm format`。
7. 暂存后运行 `pnpm commit:check`。
8. 阅读完整暂存差异，修正不合适的文案或注释。
9. 使用中文提交信息提交。

## 下次 AI 恢复提示

可以把下面这段直接发给新的 Codex 会话：

```text
请先阅读 AGENTS.md、docs/PROGRESS.md、docs/requirements/README.md、
docs/superpowers/specs/2026-09-23-taskflow-design.md，
以及 docs/superpowers/plans/2026-09-23-taskflow-implementation.md 中“任务 3”的内容。

检查 git status 和最近提交，确认工作区状态。Monorepo 工程升级 Task 1 至 Task 3、
原任务 1、原任务 2 和前端任务 5 已完成，请从原实施计划任务 3 开始，
先写失败测试，再实现最小代码，
遵守中文 JSDoc、Vue 模板注释、业务注释和中文提交规范。
不要重复已完成的设计、需求、原型、前端初始化、后端健康检查和错误处理工作。
```

## 恢复时先做检查

```bash
git status --short --branch
git log -3 --oneline
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
```

若上述状态与本文档不一致，以仓库实际状态为准，并先更新本文档再继续开发。
