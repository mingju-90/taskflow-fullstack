# TaskFlow 全栈练手项目设计

## 文档状态

- 日期：2026-09-23
- 状态：各设计部分已确认，等待用户复核完整文档
- 项目形态：单仓库，前后端两个独立目录
- 学习方式：用户主写，Codex 提供更多 Node.js 和后端支持
- 项目工作名：TaskFlow

## 目标

本项目用于系统学习 Vue 3 前端与 Node.js 后端如何组成一个完整应用。用户已有前端经验，因此重点不是重复学习页面开发，而是理解以下全栈链路：

- HTTP API 如何设计、调用和排错
- Express 中间件、路由、控制器和服务的职责
- JWT 认证、项目级授权和数据归属检查
- Prisma、SQLite、关系建模、迁移、事务和关联查询
- 参数校验、统一错误处理、结构化日志和文件上传
- API 集成测试、前端单元测试和端到端冒烟测试
- 前后端独立安装、开发、构建和运行

最终产物必须是一个可以本地运行、可以用于后续扩展、每段关键链路都能解释清楚的练手项目。

## 第一版范围

### 用户

- 用户注册、登录、退出和获取当前用户信息
- 注册字段为用户名、邮箱和密码
- 用户名长度为 3 到 20 个字符，邮箱必须合法，密码长度为 8 到 72 个字符
- 密码使用安全的哈希方式保存
- 用户通过邮箱和密码登录
- 退出登录由前端清除 Token 和用户状态，不需要额外的服务端接口
- 第一版不提供邮箱验证、找回密码、第三方登录和账号删除

### 项目与成员

- 用户创建项目
- 创建者自动成为项目 `OWNER`
- 项目负责人可以编辑项目、管理成员和删除项目
- 项目负责人可以通过邮箱或用户名添加已注册用户
- 项目成员可以查看项目、创建任务、编辑任务和发表评论
- 每个项目第一版只有一个 `OWNER`
- 创建项目和写入 `OWNER` 成员关系必须在同一个事务内完成
- 负责人不能被移除，且第一版不能主动退出项目
- 第一版不支持转让项目、邀请链接和未注册用户邀请

### 任务

- 任务属于一个项目
- 任务包含标题、描述、状态、优先级、负责人、创建人、截止时间和时间戳
- 状态为 `TODO | IN_PROGRESS | DONE`
- 优先级为 `LOW | MEDIUM | HIGH`
- 负责人可以为空
- 负责人必须是当前项目成员
- 任务列表支持搜索、状态筛选、优先级筛选、负责人筛选、截止时间筛选和分页

### 评论与附件

- 项目成员可以查看任务评论
- 项目成员可以给任务添加评论
- 评论作者和项目负责人可以删除评论
- 项目成员可以给任务上传附件
- 单文件大小限制为 5 MB
- 支持 PDF、PNG、JPEG 和纯文本文件
- 每个任务最多保留 20 个附件
- 附件必须经过后端权限检查后下载
- 上传者、任务创建人和项目负责人可以删除附件

### 看板

- 展示当前用户的任务总数
- 展示待处理、进行中和已完成任务数量
- 展示逾期任务数量
- 展示当前用户最近更新的项目
- 第一版使用统计卡片和进度条，不引入图表库

## 明确不在第一版范围内

- 多组织、多租户和自定义角色
- 邮箱验证、找回密码、第三方登录
- Refresh Token 和完整会话管理
- WebSocket、实时通知和消息推送
- Redis、消息队列和后台任务
- 对象存储、CDN 和云文件服务
- 微服务、Docker 集群和 Kubernetes
- 软删除、回收站和数据恢复
- 自定义工作流和任务状态

## 技术栈

### 前端

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios
- Element Plus

### 后端

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- JWT
- Zod
- Multer
- Vitest
- Supertest

### 测试

- Vitest + Supertest：后端 API 集成测试
- Vitest + Vue Test Utils：前端关键逻辑与组件测试
- Playwright：一条完整用户流程的冒烟测试

## 仓库结构

仓库根目录下只有两个独立应用目录。前后端分别拥有自己的 `package.json`、依赖、脚本、环境变量和构建配置。

```text
taskflow-fullstack/
├── client/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   ├── prisma/
│   ├── tests/
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── docs/
├── .gitignore
└── README.md
```

第一版不使用 npm workspace。开发时需要分别启动前端和后端进程：

- `client` 默认运行在 Vite 开发端口
- `server` 默认监听 `http://localhost:3000`
- 前端 API 基础地址通过 `VITE_API_BASE_URL` 配置

## 后端架构

后端采用轻量分层结构：

```text
route -> controller -> service -> Prisma -> SQLite
```

职责边界：

- `route`：注册 HTTP 路径和中间件
- `controller`：读取请求、调用 Service、返回响应
- `service`：业务规则、资源归属和权限判断
- Prisma：数据访问和事务
- `middleware`：认证、校验、错误处理和请求上下文
- `schema`：Zod 请求参数结构
- `lib`：JWT、密码哈希、响应和命名文件等通用能力
- `config`：环境变量读取与启动校验

第一版不增加 repository 层，避免为简单 CRUD 引入无实际收益的抽象。

建议目录：

```text
server/src/
├── app.ts
├── server.ts
├── config/
├── controllers/
├── lib/
├── middlewares/
├── routes/
├── schemas/
├── services/
├── types/
└── utils/
```

`app.ts` 只负责创建 Express 应用，便于 Supertest 直接导入测试；`server.ts` 负责监听端口和处理进程退出。

## 数据模型

### User

- `id`：字符串主键
- `email`：唯一
- `username`：唯一
- `passwordHash`
- `createdAt`
- `updatedAt`

### Project

- `id`：字符串主键
- `name`
- `description`
- `createdAt`
- `updatedAt`

### ProjectMember

- `id`：字符串主键
- `projectId`
- `userId`
- `role`：`OWNER | MEMBER`
- `createdAt`
- 组合唯一约束：`projectId + userId`

项目创建者以 `OWNER` 身份写入此表。项目成员表同时承担项目归属和项目级角色判断。

### Task

- `id`：字符串主键
- `projectId`
- `title`
- `description`
- `status`
- `priority`
- `assigneeId`：可为空
- `creatorId`
- `dueDate`：可为空
- `createdAt`
- `updatedAt`

### Comment

- `id`：字符串主键
- `taskId`
- `authorId`
- `content`
- `createdAt`
- `updatedAt`

### Attachment

- `id`：字符串主键
- `taskId`
- `uploaderId`
- `originalName`
- `storedName`
- `mimeType`
- `size`
- `createdAt`

状态、优先级和角色使用字符串存储，由 TypeScript 联合类型和 Zod 限制合法值。这样可以减少 SQLite 与不同 Prisma 版本对枚举支持差异带来的影响。

### 索引与删除规则

- `ProjectMember` 为 `projectId`、`userId` 和组合唯一约束建立索引
- `Task` 为 `projectId`、`status`、`assigneeId` 和 `dueDate` 建立索引
- 删除项目时，在一个数据库事务中删除成员、任务、评论和附件记录
- 数据库事务成功后，尽力清理附件文件；文件清理失败只记录日志，不回滚数据库
- 删除任务时级联删除评论和附件记录
- 第一版不提供用户删除接口

## API 设计

所有接口使用 `/api/v1` 前缀。成功响应格式：

```json
{
  "code": "OK",
  "message": "success",
  "data": {},
  "requestId": "..."
}
```

分页响应中的 `data` 结构：

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 0
}
```

### 认证

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

认证采用 JWT，放入请求头：

```text
Authorization: Bearer <token>
```

第一版不实现 Refresh Token。JWT 有效期通过环境变量配置，默认 2 小时。前端将 Token 保存在 Pinia 状态中，并持久化到 `localStorage`。文档和代码中明确说明这是练手项目的简化方案，生产环境应评估更安全的会话与刷新策略。

### 项目

- `GET /projects`
- `POST /projects`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId`
- `DELETE /projects/:projectId`

### 项目成员

- `GET /projects/:projectId/members`
- `POST /projects/:projectId/members`
- `DELETE /projects/:projectId/members/:userId`

添加成员时接受请求体 `{ "identifier": "邮箱或用户名" }`。重复添加、用户不存在、移除负责人和操作者不是负责人时返回明确业务错误。

### 任务

- `GET /projects/:projectId/tasks`
- `POST /projects/:projectId/tasks`
- `GET /tasks/:taskId`
- `PATCH /tasks/:taskId`
- `DELETE /tasks/:taskId`

任务列表支持：

- `page`
- `pageSize`
- `keyword`
- `status`
- `priority`
- `assigneeId`
- `dueBefore`

分页参数 `page` 从 1 开始，`pageSize` 默认 20，最大 100。

### 评论

- `GET /tasks/:taskId/comments`
- `POST /tasks/:taskId/comments`
- `DELETE /comments/:commentId`

### 附件

- `POST /tasks/:taskId/attachments`
- `GET /attachments/:attachmentId/download`
- `DELETE /attachments/:attachmentId`

附件下载不使用公开静态目录。服务端验证当前用户是任务所属项目成员后，再通过受控响应返回文件。

### 看板

- `GET /dashboard/summary`

## 认证与授权

- 未登录用户只能访问注册和登录接口
- 只有项目成员可以查看项目及其任务
- `OWNER` 可以修改项目、管理成员和删除项目
- `MEMBER` 可以创建和编辑任务，但不能管理成员
- 任务负责人必须是当前项目成员
- 普通成员只能删除自己创建的任务
- `OWNER` 可以删除项目内任意任务
- 评论作者和项目负责人可以删除评论
- 上传者、任务创建人和项目负责人可以删除附件

资源不存在和无权访问使用不同错误码。涉及其他用户数据时，服务端可以按安全策略统一返回无权访问，避免泄露资源是否存在。

## 错误处理

统一错误响应：

```json
{
  "code": "PROJECT_MEMBER_REQUIRED",
  "message": "你没有访问该项目",
  "details": null,
  "requestId": "..."
}
```

错误处理要求：

- Service 抛出带业务码和 HTTP 状态的 `AppError`
- 全局错误中间件统一序列化错误
- Zod 校验错误返回字段级 `details`
- 未匹配路由返回 `404 ROUTE_NOT_FOUND`
- 未知错误记录完整堆栈，但客户端不返回内部堆栈
- 每个请求生成 `requestId`
- 开发环境记录结构化 HTTP 日志

常见业务错误包括：

- `UNAUTHORIZED`
- `TOKEN_EXPIRED`
- `FORBIDDEN`
- `PROJECT_NOT_FOUND`
- `PROJECT_MEMBER_REQUIRED`
- `PROJECT_OWNER_REQUIRED`
- `MEMBER_ALREADY_EXISTS`
- `OWNER_CANNOT_BE_REMOVED`
- `TASK_NOT_FOUND`
- `ASSIGNEE_NOT_PROJECT_MEMBER`
- `COMMENT_NOT_FOUND`
- `ATTACHMENT_NOT_FOUND`
- `FILE_TOO_LARGE`
- `FILE_TYPE_NOT_ALLOWED`
- `VALIDATION_ERROR`

## 安全与环境

后端加入：

- CORS 白名单
- Helmet
- 请求体大小限制
- 登录接口限流
- 密码哈希
- 环境变量启动校验
- 上传文件类型和大小校验
- 文件名随机化
- 受控附件下载

服务端环境变量：

```text
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=replace-me
JWT_EXPIRES_IN=2h
UPLOAD_DIR=./uploads
CLIENT_ORIGIN=http://localhost:5173
```

前端环境变量：

```text
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

缺少必要环境变量时，服务端必须启动失败并给出明确提示。

## 前端结构

建议页面路由：

- `/login`
- `/register`
- `/dashboard`
- `/projects`
- `/projects/:projectId`
- `/projects/:projectId/tasks/:taskId`

主要布局：

- 认证布局：登录和注册
- 应用布局：侧边栏、顶部用户菜单和内容区

前端职责：

- Axios 实例统一添加 Token、解析响应和处理错误
- 路由守卫检查登录状态
- Pinia 管理认证状态和当前项目上下文
- 页面内维护分页、筛选和表单状态
- 使用权限组合函数判断按钮和操作是否可用
- 服务端仍是最终权限来源，前端权限判断只用于改善交互
- 页面覆盖加载中、空状态、错误重试和操作反馈

### 前端状态边界

- `auth` Store：Token、当前用户、登录和退出
- `project` Store：当前项目详情和成员，用于项目内页面
- 列表、筛选和表单数据尽量留在对应页面或组合函数中

## 测试策略

### 后端集成测试

使用 Vitest + Supertest，重点覆盖：

- 注册、登录、错误密码和当前用户
- 未登录访问受保护接口
- 项目创建和项目列表
- 非成员访问项目被拒绝
- `MEMBER` 管理成员被拒绝
- 添加重复成员
- 移除 `OWNER`
- 创建任务和参数校验
- 将非项目成员设为任务负责人
- 普通成员删除他人任务被拒绝
- 评论权限
- 附件大小、类型和下载权限
- 删除项目的级联行为

每个测试套件使用独立临时 SQLite 数据库，并在测试结束后删除。测试数据通过工厂函数创建，不在测试中复制大段初始化代码。

### 前端测试

使用 Vitest + Vue Test Utils，重点覆盖：

- Axios 请求拦截器添加 Token
- Axios 响应拦截器处理业务错误
- 认证 Store 的登录、恢复和退出
- 权限组合函数
- 任务筛选参数转换
- 关键表单的校验与提交行为

### 端到端冒烟测试

使用 Playwright 覆盖一条完整链路：

1. 注册用户
2. 登录
3. 创建项目
4. 创建任务
5. 修改任务状态
6. 添加评论
7. 退出登录

## 开发数据

Prisma Seed 创建：

- 两个测试用户
- 一个项目
- 一个 `OWNER` 和一个 `MEMBER`
- 不同状态、优先级和截止时间的任务
- 至少一条评论

Seed 使用幂等写入方式，重复执行不会产生重复数据。

## 学习与协作方式

用户负责主要代码实现，Codex 提供更多 Node.js 和后端支持。每个开发阶段按以下顺序推进：

1. 说明本阶段要解决的问题和学习目标
2. 给出后端调用链、接口契约和关键数据结构
3. 用户实现主要代码
4. Codex 提供 Node.js 概念解释、骨架建议、测试用例和排错支持
5. 运行类型检查与测试
6. Codex 审查实现并解释问题
7. 通过验收后进入下一阶段

建议按纵向功能切片推进：

1. 仓库、工具链、环境变量和基础健康检查
2. Prisma 模型、迁移、Seed 和错误框架
3. 注册、登录、JWT 和前端认证页
4. 项目列表、创建、详情和成员管理
5. 任务列表、筛选、分页和任务详情
6. 评论和附件
7. 看板和前端体验完善
8. API 集成测试、前端单元测试和 Playwright 冒烟测试
9. README、运行说明和代码审查

每个阶段都必须产生可运行、可测试的结果，不能把前后端联调全部推迟到最后。

## 验收标准

- `client` 和 `server` 可以分别安装、启动和构建
- 前后端 TypeScript 检查通过
- Prisma 迁移和 Seed 可以在空数据库上成功执行
- 后端集成测试通过
- 前端关键逻辑测试通过
- Playwright 冒烟测试通过
- `.env.example` 和启动文档齐全
- 未登录、越权、参数错误、文件错误和资源不存在都有明确处理
- UI 覆盖加载中、空状态、错误重试和操作成功反馈
- 删除项目后关联数据和附件按设计处理
- 用户能够根据 README 从零启动项目

## 已知限制与升级路径

- SQLite 适合本地学习，不适合多实例和高并发写入；后续可以切换 PostgreSQL
- JWT 加 `localStorage` 是练手简化方案；后续可以加入 Refresh Token 和 HttpOnly Cookie
- 本地文件存储不适合多实例和云部署；后续可以切换对象存储
- 固定 `OWNER | MEMBER` 角色足够第一版；后续可以升级为组织、角色和权限表
- 当前没有实时通知；后续可以利用 WebSocket 增加任务和评论通知

## 设计决策摘要

- 选择多用户加项目成员，而不是单用户或复杂 RBAC
- 选择学习优先，但按生产项目方式组织代码
- 选择 Express + TypeScript，暂时不使用 NestJS
- 选择 SQLite + Prisma，降低本地环境成本
- 选择一个仓库、`client` 和 `server` 两个独立目录
- 不使用 npm workspace，让前后端依赖和运行方式保持透明
- 用户主写代码，Codex 重点提供 Node.js 和后端支持
