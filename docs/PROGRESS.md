# TaskFlow 项目进度与恢复说明

## 文档用途

本文档用于快速恢复项目上下文。新的 Codex 会话、未来的自己或协作者在开始修改前，应先阅读：

1. `AGENTS.md`
2. 本文档
3. `docs/requirements/README.md`
4. `docs/superpowers/specs/2026-09-23-taskflow-design.md`
5. 当前任务对应的 `docs/superpowers/plans/2026-09-23-taskflow-implementation.md` 章节

本文档记录“已经做了什么、为什么这样做、当前处于什么状态、下一步从哪里继续”。

## 当前快照

| 项目         | 当前状态                                          |
| ------------ | ------------------------------------------------- |
| 日期         | 2026-09-23                                        |
| Git 分支     | `main`                                            |
| 最新提交     | `956df91 chore: 初始化 TaskFlow 前端工程`         |
| 远端状态     | `main` 领先 `origin/main` 1 个提交                |
| 工作区       | 干净                                              |
| 根目录工具链 | 已启用 Prettier、cspell、EditorConfig、Git hooks  |
| 后端         | 尚未初始化，`server/` 目录不存在                  |
| 前端         | 已初始化，可开发、测试、类型检查和构建            |
| 需求与设计   | 已完成第一版基线                                  |
| 交互原型     | 已完成 HTML 原型和桌面截图                        |
| CI 实施计划  | 已写入任务 19，尚未创建真实 GitHub Actions 工作流 |

当前本地 Node.js 为 `v18.20.8`，项目计划要求 Node.js 20 或更高版本。当前前端依赖选择同时兼容 Node.js 18 和 20，最终 CI 仍应使用 Node.js 20。

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
- 根目录只承载跨仓库工具，不引入 npm workspace，`client` 和 `server` 仍保持独立安装。

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
- 前端独立 `package.json`、锁文件和 `.env.example`。

关键文件：

- `client/package.json`
- `client/vite.config.ts`
- `client/src/main.ts`
- `client/src/App.vue`
- `client/src/router/index.ts`
- `client/src/views/HomeView.vue`
- `client/src/styles/base.css`
- `client/tests/app-shell.test.ts`

为什么这样做：

- 先建立稳定的前端入口和插件顺序，后续认证、项目和任务页面可以直接挂接。
- 前端依赖独立安装，保持与后端解耦。
- Element Plus 固定为 `2.11.8`，Vite 使用 5.x，避免初始化阶段引入 Node.js 版本不兼容。
- 任务 5 已先完成，但没有加入依赖后端 API 的认证和业务逻辑。

## 当前可运行命令

### 根目录

```bash
npm install
npm run format
npm run format:check
npm run commit:check
```

提交信息检查：

```bash
printf 'feat: 增加示例功能\n' | npm run commit:message
```

### 前端

```bash
cd client
npm install
npm run dev
npm run test:run
npm run typecheck
npm run build
```

默认开发地址为 `http://127.0.0.1:5173/`。如果端口被占用，Vite 会自动选择下一个可用端口。

## 已验证结果

- 前端应用外壳测试通过。
- `vue-tsc` 类型检查通过。
- Vite 生产构建通过。
- 无头浏览器可以渲染 `TaskFlow` 和“前端基础工程已就绪”。
- Prettier、cspell 和暂存区校验通过。
- `pre-commit` 和 `commit-msg` 已在真实提交中执行。

## 已知限制与风险

- `server/` 尚未创建，真实 API 不存在。
- 根目录构建工具与前端依赖均兼容当前 Node.js 18，但最终 CI 仍按计划使用 Node.js 20。
- Element Plus 当前在入口全量安装，生产构建有单个 JS 包超过 500 kB 的提示；后续可按路由和组件做按需加载。
- GitHub Actions 目前只有实施计划中的任务 19，真实 `.github/workflows/ci.yml` 尚未创建。
- 原型 HTML 与 Vue 页面是两个阶段，原型不是最终组件实现。
- 当前 `main` 尚未推送。

## 下一阶段推荐顺序

前端任务 5 已完成，但后端尚未开始。为避免认证页面依赖不存在的 API，下一步仍应回到实施计划任务 1：

1. 任务 1：搭建后端基础与健康检查。
2. 任务 2：统一错误处理、请求 ID 和日志。
3. 任务 3：Prisma 数据模型、迁移、测试数据库和种子数据。
4. 任务 4：注册、登录和 JWT 鉴权 API。
5. 任务 6：登录、注册、Token 和路由守卫。

每个任务继续按以下顺序推进：

1. 写失败测试。
2. 确认失败原因正确。
3. 写最小实现。
4. 确认测试通过。
5. 运行类型检查。
6. 运行 `npm run format`。
7. 暂存后运行 `npm run commit:check`。
8. 阅读完整暂存差异，修正不合适的文案或注释。
9. 使用中文提交信息提交。

## 下次 AI 恢复提示

可以把下面这段直接发给新的 Codex 会话：

```text
请先阅读 AGENTS.md、docs/PROGRESS.md、docs/requirements/README.md、
docs/superpowers/specs/2026-09-23-taskflow-design.md，
以及 docs/superpowers/plans/2026-09-23-taskflow-implementation.md 中“任务 1”的内容。

检查 git status 和最近提交，确认工作区状态。当前前端任务 5 已完成，
但 server 尚未初始化。请从实施计划任务 1 开始，先写失败测试，再实现最小代码，
遵守中文 JSDoc、Vue 模板注释、业务注释和中文提交规范。
不要重复已完成的设计、需求、原型和前端初始化工作。
```

## 恢复时先做检查

```bash
git status --short --branch
git log -3 --oneline
npm run format:check
cd client
npm run test:run
npm run typecheck
```

若上述状态与本文档不一致，以仓库实际状态为准，并先更新本文档再继续开发。
