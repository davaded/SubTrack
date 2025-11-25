# 🔐 SubTrack 管理员功能指南

## 📋 目录

- [功能概述](#功能概述)
- [初次部署](#初次部署)
- [默认管理员登录](#默认管理员登录)
- [用户管理](#用户管理)
- [系统设置](#系统设置)
- [API 文档](#api-文档)

---

## 功能概述

SubTrack 现在支持完整的用户管理和权限系统：

### ✨ 核心功能

- 👤 **用户角色**：管理员 (admin) 和普通用户 (user)
- 🔒 **用户状态**：待审批 (pending)、已激活 (active)、已暂停 (suspended)
- ⚙️ **注册模式**：
  - 🟢 **开放注册 (open)**：用户注册后自动激活
  - 🟡 **需要审批 (approval)**：用户注册后需管理员审批
  - 🔴 **关闭注册 (closed)**：完全禁止新用户注册
- 📊 **用户管理**：审批、暂停、激活、删除用户
- 📈 **统计数据**：用户总数、待审批数量、活跃用户等

---

## 初次部署

### 1. 配置默认管理员

在 `.env` 文件中配置（可选，如不配置则使用默认值）：

```bash
# 默认管理员账号
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=admin123456
DEFAULT_ADMIN_NAME=System Administrator
```

### 2. 部署应用

```bash
# 使用 Docker Compose
docker-compose up -d

# 或本地开发
npm run build
npm start
```

### 3. 初始化系统

部署后，系统会自动创建默认管理员和系统设置。

**手动初始化（如需要）：**

```bash
# 方式 1：调用 API
curl -X POST http://localhost:3000/api/init

# 方式 2：检查状态
curl http://localhost:3000/api/init
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "adminExists": true,
    "settingsExist": true,
    "initialized": true
  }
}
```

---

## 默认管理员登录

### 首次登录

1. 访问：`http://your-domain.com/login`
2. 使用默认凭证登录：
   - 邮箱：`admin@example.com`（或你配置的邮箱）
   - 密码：`admin123456`（或你配置的密码）

### ⚠️ 重要：首次登录后必须修改密码

由于安全原因，默认管理员账号的 `mustChangePassword` 字段为 `true`。

建议在首次登录后立即：
1. 修改邮箱地址
2. 修改密码
3. 修改显示名称

---

## 用户管理

### 查看所有用户

**API 端点：** `GET /api/admin/users`

**查询参数：**
- `status`: 筛选状态（pending | active | suspended）
- `role`: 筛选角色（user | admin）
- `search`: 搜索邮箱或姓名

**示例：**

```bash
# 获取所有用户
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users

# 获取待审批用户
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users?status=pending

# 搜索用户
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users?search=john
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 2,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "status": "pending",
        "createdAt": "2025-11-25T10:00:00.000Z",
        "_count": {
          "subscriptions": 3
        }
      }
    ],
    "stats": {
      "total": 10,
      "pending": 2,
      "active": 7,
      "suspended": 1,
      "admins": 1
    }
  }
}
```

### 审批用户

**API 端点：** `PATCH /api/admin/users/[id]/approve`

```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users/2/approve
```

### 暂停用户

**API 端点：** `PATCH /api/admin/users/[id]/suspend`

```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users/2/suspend
```

### 激活用户

**API 端点：** `PATCH /api/admin/users/[id]/activate`

```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users/2/activate
```

### 删除用户

**API 端点：** `DELETE /api/admin/users/[id]`

⚠️ **注意：** 删除用户会同时删除该用户的所有订阅记录（级联删除）

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users/2
```

---

## 系统设置

### 获取系统设置

**API 端点：** `GET /api/admin/settings`

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/settings
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "registrationMode": "approval",
    "siteName": "SubTrack",
    "maxUsersLimit": null,
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  }
}
```

### 更新系统设置

**API 端点：** `PATCH /api/admin/settings`

```bash
# 切换注册模式为开放注册
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"registrationMode": "open"}' \
  http://localhost:3000/api/admin/settings

# 设置用户数量限制
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"maxUsersLimit": 100}' \
  http://localhost:3000/api/admin/settings

# 修改站点名称
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"siteName": "My Subscription Tracker"}' \
  http://localhost:3000/api/admin/settings
```

---

## API 文档

### 认证

所有管理员 API 都需要：
1. 用户已登录（有效的 JWT token）
2. 用户角色为 `admin`
3. 用户状态为 `active`

**请求头：**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

或使用 Cookie（自动）：
```
Cookie: token=YOUR_JWT_TOKEN
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required"
  }
}
```

**常见错误码：**
- `UNAUTHORIZED` (401): 未登录
- `FORBIDDEN` (403): 无权限（非管理员或账号未激活）
- `NOT_FOUND` (404): 资源不存在
- `VALIDATION_ERROR` (400): 请求参数错误

### 完整 API 列表

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/admin/users` | 获取用户列表 |
| GET | `/api/admin/users/[id]` | 获取用户详情 |
| DELETE | `/api/admin/users/[id]` | 删除用户 |
| PATCH | `/api/admin/users/[id]/approve` | 审批用户 |
| PATCH | `/api/admin/users/[id]/suspend` | 暂停用户 |
| PATCH | `/api/admin/users/[id]/activate` | 激活用户 |
| GET | `/api/admin/settings` | 获取系统设置 |
| PATCH | `/api/admin/settings` | 更新系统设置 |
| GET | `/api/init` | 检查初始化状态 |
| POST | `/api/init` | 手动初始化系统 |

---

## 常见问题

### Q: 如何重置管理员密码？

A: 目前需要直接修改数据库：

```sql
-- 使用 bcrypt 哈希后的密码
UPDATE users
SET password = '$2b$10$...'
WHERE email = 'admin@example.com';
```

或者删除管理员账号，重新部署后会自动创建。

### Q: 可以有多个管理员吗？

A: 可以！直接在数据库中将用户的 `role` 改为 `admin`：

```sql
UPDATE users
SET role = 'admin', status = 'active'
WHERE id = 2;
```

### Q: 如何备份用户数据？

A: 使用 PostgreSQL 的备份命令：

```bash
docker exec subtrack-db pg_dump -U postgres subtrack > backup.sql
```

### Q: 注册模式在哪里设置？

A: 使用 `PATCH /api/admin/settings` API 修改 `registrationMode` 字段：
- `open`: 开放注册
- `approval`: 需要审批（默认）
- `closed`: 关闭注册

---

## 安全建议

1. ✅ **立即修改默认管理员密码**
2. ✅ **不要在代码中硬编码管理员凭证**
3. ✅ **使用强密码**
4. ✅ **定期审查用户列表**
5. ✅ **定期备份数据库**
6. ✅ **使用 HTTPS**
7. ✅ **保护 .env 文件**（已在 .gitignore 中）

---

## 下一步计划

未来可能添加的功能：

- [ ] 管理员前端 UI（`/admin` 页面）
- [ ] 审计日志（记录所有管理操作）
- [ ] 邮件通知（用户审批通过/拒绝）
- [ ] 批量操作
- [ ] 更细粒度的权限控制
- [ ] 双因素认证（2FA）

---

需要帮助？提交 Issue: https://github.com/davaded/SubTrack/issues
