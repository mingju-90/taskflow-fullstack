# TaskFlow API 与数据契约

## 1. 通用约定

- API 根路径：`/api/v1`
- 请求和响应：`application/json`，附件上传除外
- 认证头：`Authorization: Bearer <token>`
- 成功响应：`{ code: "OK", message: string, data: unknown, requestId: string }`
- 失败响应：`{ code: string, message: string, details: unknown, requestId: string }`
- 分页数据：`{ items: T[], page: number, pageSize: number, total: number }`
- 时间字段：ISO 8601 字符串，服务端按 UTC 存储
- ID：字符串，第一版由 Prisma 默认生成

成功示例：

```json
{
  "code": "OK",
  "message": "success",
  "data": {
    "id": "usr_01",
    "username": "alice"
  },
  "requestId": "2a733c49-36f0-4ca6-bf72-8c78dd056ac2"
}
```

失败示例：

```json
{
  "code": "VALIDATION_ERROR",
  "message": "请求参数不合法",
  "details": [
    {
      "path": ["email"],
      "message": "邮箱格式不正确"
    }
  ],
  "requestId": "2a733c49-36f0-4ca6-bf72-8c78dd056ac2"
}
```

## 2. 数据模型

### 2.1 User

| 字段           | 类型     | 约束                          |
| -------------- | -------- | ----------------------------- |
| `id`           | string   | 主键                          |
| `username`     | string   | 唯一，3 到 20 字符            |
| `email`        | string   | 唯一，合法邮箱，最多 254 字符 |
| `passwordHash` | string   | 仅服务端使用                  |
| `createdAt`    | DateTime | 自动创建                      |
| `updatedAt`    | DateTime | 自动更新                      |

公开用户对象不包含 `passwordHash`。

### 2.2 Project

| 字段          | 类型     | 约束           |
| ------------- | -------- | -------------- |
| `id`          | string   | 主键           |
| `name`        | string   | 1 到 80 字符   |
| `description` | string   | 0 到 1000 字符 |
| `createdAt`   | DateTime | 自动创建       |
| `updatedAt`   | DateTime | 自动更新       |

### 2.3 ProjectMember

| 字段        | 类型              | 约束     |
| ----------- | ----------------- | -------- |
| `id`        | string            | 主键     |
| `projectId` | string            | 外键     |
| `userId`    | string            | 外键     |
| `role`      | `OWNER \| MEMBER` | 固定角色 |
| `createdAt` | DateTime          | 自动创建 |

`projectId + userId` 为组合唯一约束。

### 2.4 Task

| 字段          | 类型                          | 约束           |
| ------------- | ----------------------------- | -------------- |
| `id`          | string                        | 主键           |
| `projectId`   | string                        | 外键           |
| `title`       | string                        | 1 到 120 字符  |
| `description` | string                        | 0 到 5000 字符 |
| `status`      | `TODO \| IN_PROGRESS \| DONE` | 默认 `TODO`    |
| `priority`    | `LOW \| MEDIUM \| HIGH`       | 默认 `MEDIUM`  |
| `assigneeId`  | string \| null                | 必须是项目成员 |
| `creatorId`   | string                        | 外键           |
| `dueDate`     | DateTime \| null              | 可为空         |
| `createdAt`   | DateTime                      | 自动创建       |
| `updatedAt`   | DateTime                      | 自动更新       |

### 2.5 Comment

| 字段        | 类型     | 约束           |
| ----------- | -------- | -------------- |
| `id`        | string   | 主键           |
| `taskId`    | string   | 外键           |
| `authorId`  | string   | 外键           |
| `content`   | string   | 1 到 2000 字符 |
| `createdAt` | DateTime | 自动创建       |
| `updatedAt` | DateTime | 自动更新       |

### 2.6 Attachment

| 字段           | 类型     | 约束            |
| -------------- | -------- | --------------- |
| `id`           | string   | 主键            |
| `taskId`       | string   | 外键            |
| `uploaderId`   | string   | 外键            |
| `originalName` | string   | 原始文件名      |
| `storedName`   | string   | 随机文件名      |
| `mimeType`     | string   | 允许列表内 MIME |
| `size`         | number   | 0 到 5 MB       |
| `createdAt`    | DateTime | 自动创建        |

### 2.7 删除关系

- 删除 `Project`：删除 `ProjectMember`、`Task`、`Comment`、`Attachment` 记录。
- 删除 `Task`：删除 `Comment`、`Attachment` 记录。
- 删除 `Comment`：只删除评论。
- 删除 `Attachment`：删除记录并尽力删除文件。
- 第一版不提供删除 `User`。

## 3. 认证 API

### `POST /auth/register`

请求：

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

响应 `201`：

```json
{
  "code": "OK",
  "message": "注册成功",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "usr_01",
      "username": "alice",
      "email": "alice@example.com",
      "createdAt": "2026-09-23T08:00:00.000Z",
      "updatedAt": "2026-09-23T08:00:00.000Z"
    }
  },
  "requestId": "..."
}
```

可能的错误：`VALIDATION_ERROR`、`EMAIL_ALREADY_EXISTS`、`USERNAME_ALREADY_EXISTS`。

### `POST /auth/login`

请求：

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

响应 `200` 与注册响应中的 `token` 和 `user` 结构一致。

可能的错误：`VALIDATION_ERROR`、`INVALID_CREDENTIALS`、`RATE_LIMITED`。

### `GET /auth/me`

需要认证。响应 `data` 为公开用户对象。

## 4. 项目与成员 API

### `GET /projects`

查询参数：

| 参数       | 类型              | 默认值 | 说明               |
| ---------- | ----------------- | ------ | ------------------ |
| `keyword`  | string            | 空     | 匹配项目名称或描述 |
| `role`     | `OWNER \| MEMBER` | 空     | 按当前用户角色筛选 |
| `page`     | number            | 1      | 从 1 开始          |
| `pageSize` | number            | 20     | 最大 100           |

列表中每项包含项目公开字段、当前用户角色和成员数量。

### `POST /projects`

请求：

```json
{
  "name": "产品重构",
  "description": "第一版任务协作项目"
}
```

响应 `201`，`data` 为项目详情。创建时必须同时写入当前用户 `OWNER` 成员关系。

### `GET /projects/:projectId`

需要项目成员。返回项目、成员列表和当前用户角色。

### `PATCH /projects/:projectId`

需要 `OWNER`。请求体可包含 `name`、`description`。

### `DELETE /projects/:projectId`

需要 `OWNER`。响应 `200`，`data` 为 `{ "deleted": true }`。

### `GET /projects/:projectId/members`

需要项目成员。返回成员用户公开信息和角色。

### `POST /projects/:projectId/members`

需要 `OWNER`。

请求：

```json
{
  "identifier": "bob@example.com"
}
```

`identifier` 可以是邮箱或用户名。响应 `201`，返回新成员关系。

### `DELETE /projects/:projectId/members/:userId`

需要 `OWNER`。目标必须是 `MEMBER`，成功响应 `{ "deleted": true }`。

## 5. 任务 API

### `GET /projects/:projectId/tasks`

需要项目成员。

查询参数：

| 参数         | 类型                          | 默认值 | 说明                     |
| ------------ | ----------------------------- | ------ | ------------------------ |
| `keyword`    | string                        | 空     | 匹配任务标题或描述       |
| `status`     | `TODO \| IN_PROGRESS \| DONE` | 空     | 状态筛选                 |
| `priority`   | `LOW \| MEDIUM \| HIGH`       | 空     | 优先级筛选               |
| `assigneeId` | string                        | 空     | 负责人筛选               |
| `dueBefore`  | ISO date                      | 空     | 截止时间早于或等于该时间 |
| `page`       | number                        | 1      | 从 1 开始                |
| `pageSize`   | number                        | 20     | 最大 100                 |

列表项至少包含任务核心字段、负责人摘要、创建人摘要和附件数量。

### `POST /projects/:projectId/tasks`

需要项目成员。

```json
{
  "title": "完成登录接口",
  "description": "实现注册、登录和当前用户信息",
  "status": "TODO",
  "priority": "HIGH",
  "assigneeId": "usr_02",
  "dueDate": "2026-09-30T16:00:00.000Z"
}
```

### `GET /tasks/:taskId`

需要任务所属项目的成员关系。包含任务核心字段、负责人、创建人、评论列表和附件列表。

### `PATCH /tasks/:taskId`

需要任务所属项目的成员关系。请求体中的字段都可选，未传字段不覆盖原值。

### `DELETE /tasks/:taskId`

普通成员只能删除自己创建的任务，`OWNER` 可以删除任意任务。成功响应 `{ "deleted": true }`。

## 6. 评论 API

### `GET /tasks/:taskId/comments`

需要项目成员。按 `createdAt` 正序返回分页结构，每项包含作者公开信息。

### `POST /tasks/:taskId/comments`

需要项目成员。

```json
{
  "content": "接口字段已对齐，可以开始实现。"
}
```

响应 `201`。

### `DELETE /comments/:commentId`

评论作者或项目 `OWNER` 可以删除。成功响应 `{ "deleted": true }`。

## 7. 附件 API

### `POST /tasks/:taskId/attachments`

需要项目成员。请求使用 `multipart/form-data`，文件字段名为 `file`。

允许的 MIME：

```text
application/pdf
image/png
image/jpeg
text/plain
```

响应 `201`，返回附件元数据。响应不包含服务器文件系统路径。

### `GET /attachments/:attachmentId/download`

需要附件所属任务的项目成员关系。成功时返回原始文件内容，并设置：

```text
Content-Type: <original mime type>
Content-Disposition: attachment; filename="<sanitized original name>"
```

### `DELETE /attachments/:attachmentId`

上传者、任务创建人或项目 `OWNER` 可以删除。成功响应 `{ "deleted": true }`。

## 8. 看板 API

### `GET /dashboard/summary`

需要登录。响应：

```json
{
  "code": "OK",
  "message": "success",
  "data": {
    "stats": {
      "total": 18,
      "todo": 7,
      "inProgress": 6,
      "done": 5,
      "overdue": 3
    },
    "recentProjects": []
  },
  "requestId": "..."
}
```

`recentProjects` 最多 5 项，按 `updatedAt` 降序排列。

## 9. 错误码

| HTTP | `code`                        | 场景                   |
| ---- | ----------------------------- | ---------------------- |
| 400  | `VALIDATION_ERROR`            | Zod 参数校验失败       |
| 400  | `ASSIGNEE_NOT_PROJECT_MEMBER` | 任务负责人不是项目成员 |
| 400  | `FILE_TOO_LARGE`              | 附件超过 5 MB          |
| 400  | `FILE_TYPE_NOT_ALLOWED`       | 附件类型不允许         |
| 400  | `ATTACHMENT_LIMIT_REACHED`    | 任务已有 20 个附件     |
| 401  | `UNAUTHORIZED`                | 未提供或无法解析 Token |
| 401  | `TOKEN_EXPIRED`               | Token 已过期           |
| 401  | `INVALID_CREDENTIALS`         | 登录邮箱或密码错误     |
| 403  | `FORBIDDEN`                   | 通用无权操作           |
| 403  | `PROJECT_MEMBER_REQUIRED`     | 当前用户不是项目成员   |
| 403  | `PROJECT_OWNER_REQUIRED`      | 需要项目负责人         |
| 403  | `TASK_DELETE_FORBIDDEN`       | 不能删除该任务         |
| 403  | `COMMENT_DELETE_FORBIDDEN`    | 不能删除该评论         |
| 403  | `ATTACHMENT_DELETE_FORBIDDEN` | 不能删除该附件         |
| 404  | `PROJECT_NOT_FOUND`           | 项目不存在             |
| 404  | `TASK_NOT_FOUND`              | 任务不存在             |
| 404  | `COMMENT_NOT_FOUND`           | 评论不存在             |
| 404  | `ATTACHMENT_NOT_FOUND`        | 附件不存在             |
| 404  | `ROUTE_NOT_FOUND`             | 路由不存在             |
| 409  | `EMAIL_ALREADY_EXISTS`        | 邮箱已注册             |
| 409  | `USERNAME_ALREADY_EXISTS`     | 用户名已注册           |
| 409  | `MEMBER_ALREADY_EXISTS`       | 用户已在项目中         |
| 409  | `OWNER_CANNOT_BE_REMOVED`     | 尝试移除项目负责人     |
| 429  | `RATE_LIMITED`                | 登录尝试过于频繁       |
| 500  | `INTERNAL_SERVER_ERROR`       | 未处理异常             |

## 10. 错误与日志要求

- 每个请求生成唯一 `requestId`。
- 开发环境记录请求方法、路径、状态码、耗时和 `requestId`。
- 未知错误记录完整堆栈，响应不包含堆栈或服务器路径。
- Zod 校验错误的 `details` 包含字段路径和中文消息。
- 文件系统错误不能泄露绝对路径。
