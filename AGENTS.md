# TaskFlow 项目 AI 协作规范

本文件适用于整个仓库。任何 Codex 会话在读取、修改、测试或提交代码前，都必须优先遵循本规范。

开始任务前还必须阅读 `docs/PROGRESS.md`，以当前仓库快照、已完成事项、已知限制和下一阶段顺序为准，避免重复实现或回到旧状态。

## 默认语言

- 除用户明确要求其他语言外，所有说明、计划、进度、代码审查和最终答复使用中文。
- UI 文案、文档、测试描述、Pull Request、Issue 和提交正文使用中文。
- 代码标识符、API 字段、枚举值、包名、命令和文件名保持英文，不为了“中文化”重命名。
- 提交类型前缀保留 `feat`、`fix`、`docs`、`test` 等英文约定，冒号后的摘要和正文使用中文。

## 依赖管理

- 下载、安装、新增和更新依赖统一使用 pnpm，不运行 `npm install`、`npm update`、`yarn add` 等包管理器命令。
- 根目录执行 `pnpm install` 安装整个 workspace 的依赖；仓库只保留根目录 `pnpm-lock.yaml`，不创建子包锁文件。
- 根目录开发依赖使用 `pnpm add -Dw <package>`，更新使用 `pnpm update -Dw <package>`。
- `apps/client` 依赖使用 `pnpm --filter @taskflow/client add <package>` 或 `pnpm --filter @taskflow/client add -D <package>` 管理。
- `apps/server` 依赖使用 `pnpm --filter @taskflow/server add <package>` 或 `pnpm --filter @taskflow/server add -D <package>` 管理。
- `packages/config` 和 `packages/contracts` 使用对应的 `pnpm --filter` 命令管理，不进入包目录单独安装。
- 依赖变更必须通过 pnpm 同步更新根目录 `pnpm-lock.yaml`，不得手动编辑锁文件。

## AI 修改代码时的默认行为

Codex 新增或修改业务代码时，必须同步检查注释，而不是等用户再次要求：

1. 新增导出函数、类和公共类型时，补充或更新 JSDoc。
2. 新增 Vue 页面或复杂组件区块时，添加模板结构注释。
3. 修改权限、事务、校验、文件生命周期或错误恢复逻辑时，添加业务规则注释。
4. 修改行为后，删除或更新已经失真的旧注释。
5. 注释只解释意图、约束和原因，不逐行复述代码。

如果用户明确要求“不改注释”或“保留现有注释”，以用户当次要求为准。

## JavaScript 与 TypeScript JSDoc

### 必须添加 JSDoc 的场景

- 导出的函数、异步函数、类、组合函数和复杂常量。
- 包含业务规则、权限判断或副作用的服务函数。
- 调用方不容易从名称判断输入、返回值或异常行为的函数。
- Vue `script setup` 中被页面、组件或测试复用的工具函数。

### JSDoc 内容要求

- 使用中文描述职责和关键业务约束。
- 参数和返回值使用 `@param`、`@returns`。
- 可能抛出稳定业务错误时使用 `@throws`。
- 参数对象可以描述关键字段；字段类型优先通过 TypeScript 类型表达。
- 一行即可说明清楚的简单函数使用单行 JSDoc，不强制展开所有标签。

示例：

```ts
/**
 * 校验当前用户是否为项目成员。
 *
 * @param projectId 项目 ID
 * @param userId 当前登录用户 ID
 * @returns 项目成员关系和角色
 * @throws {AppError} 用户不是项目成员时抛出 PROJECT_MEMBER_REQUIRED
 */
export async function requireProjectMember(projectId: string, userId: string) {
  // 实现省略
}
```

### 不建议添加 JSDoc 的场景

- 名称和类型已经完全表达行为的简单 getter。
- 只返回字面量或直接映射字段的纯函数。
- 测试中的单个断言辅助函数，除非其行为不直观。
- 自动生成文件、第三方类型声明和复制的库代码。

## Vue 模板注释

新增 Vue 页面或复杂组件时，为以下区块添加中文注释：

- 页面标题和主操作区。
- 搜索、筛选和分页区域。
- 表格、看板和统计区域。
- 表单弹窗中的复杂字段组。
- 评论区、附件区和权限相关操作区。
- 根据权限或状态渲染的 `v-if` / `v-else` 分支。

模板注释说明区块职责，不描述 CSS 或逐项解释标签。示例：

```vue
<!-- 任务筛选区：关键字、状态、优先级、负责人和截止时间 -->
<TaskFilters v-model="filters" @change="handleFilterChange" />

<!-- 负责人操作：仅项目 OWNER 可以查看 -->
<MemberPanel v-if="canManageProject" :project="project" />
```

## 业务逻辑注释

以下代码必须添加简短中文注释，说明“为什么这样做”：

- 项目级权限和资源归属判断。
- JWT、Token、登录状态和敏感数据边界。
- Prisma 事务、级联删除和跨表一致性。
- 参数校验中的非直观范围或组合规则。
- 文件上传限制、随机文件名和文件与数据库的一致性。
- 错误码选择、降级策略和失败后不回滚的例外情况。
- 为兼容既有数据、第三方行为或浏览器限制而保留的特殊分支。

业务注释优先引用需求编号，便于回溯：

```ts
// 业务规则：FR-PROJ-009，项目负责人不能被移除。
if (membership.role === 'OWNER') {
  throw new AppError(409, 'OWNER_CANNOT_BE_REMOVED', '项目负责人不能被移除')
}
```

不要添加以下低价值注释：

```ts
// 定义变量
const projectId = request.params.projectId

// 返回结果
return response.json(result)
```

## 提交规范

- 提交信息使用中文摘要，格式为 `<type>: <中文简述>`。
- 提交正文说明背景、关键改动、验证命令和未完成事项。
- 一个提交只处理一个清晰目标，不混入无关格式化或重构。
- 提交前必须运行 `pnpm format:check`。
- 涉及代码时必须运行对应类型检查和测试。
- 不在提交信息中写“misc”“update”或无法判断内容的宽泛描述。

### 提交前暂存区校验

仓库通过 `.githooks/pre-commit` 自动校验暂存区。AI 和人工提交都必须执行以下流程：

1. 运行 `pnpm format`。
2. 使用 `git add` 暂存目标文件。
3. 运行 `pnpm commit:check`。
4. 逐段阅读 `git diff --cached`，检查中文文案语义、业务命名和上下文是否合适。
5. 修复问题后重新暂存，再次运行 `pnpm commit:check`。
6. 提交。

`pnpm commit:check` 会检查：

- 暂存区与工作区内容是否一致。
- Prettier 格式和 `git diff --check`。
- 常见英文拼写错误和中文错别字。
- 合并冲突标记、`debugger`、测试 `.only` 和未处理 TODO。
- 疑似硬编码密码、Token、API Key 和私钥。
- 明显不专业或不合适的表达。
- 通过 cspell 检查代码与配置文件中的英文拼写。

`commit-msg` 钩子会额外检查提交信息，要求英文类型前缀加中文摘要，例如：

```text
feat: 增加项目成员权限校验
```

禁止在未获得用户明确同意时使用 `git commit --no-verify` 绕过检查。确定性脚本无法判断中文语义是否得体，因此 AI 必须在提交前阅读完整暂存差异，并主动修正其中明显不合适、误导或与实际行为不符的内容。

推荐示例：

```text
feat: 增加项目成员权限校验

- 添加 OWNER 和 MEMBER 权限矩阵
- 覆盖非项目成员访问接口的集成测试
- 验证：pnpm test -- --run tests/projects.test.ts
```

```text
fix: 修复任务负责人校验遗漏
```

提交模板位于 `.gitmessage`。需要在当前机器启用时执行：

```bash
git config commit.template .gitmessage
```

## 文档与评审

- 需求变更同步更新 `docs/requirements/`、接口契约和测试矩阵。
- 行为变更同步更新实施计划或设计文档。
- Pull Request 使用仓库中文模板，列出关联需求、权限影响、验证结果和截图。
- 代码审查优先发现错误、回归、权限漏洞和缺失测试，再说明风格问题。

## 完成标准

一个任务只有同时满足以下条件才算完成：

- 行为符合需求编号和验收条件。
- 关键业务逻辑具备中文注释。
- 导出 API 具备必要 JSDoc。
- 复杂 Vue 模板区块具备结构注释。
- `pnpm format:check` 通过。
- 对应类型检查和测试通过。
- 提交信息使用中文并准确描述改动。
