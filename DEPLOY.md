# 🚀 SubTrack 一键部署指南

## 最简部署（1 分钟）

```bash
# 克隆代码
git clone https://github.com/davaded/SubTrack.git
cd SubTrack

# 一键启动
docker-compose up -d
```

就这么简单！访问 `http://your-server-ip:3000`

---

## 推荐配置（生产环境）

### 1. 创建 .env 文件（可选）

如果你想自定义配置，创建 `.env` 文件：

```bash
# JWT 密钥（强烈建议修改）
JWT_SECRET=your-super-secret-key-here

# Webhook 密钥（用于定时任务）
WEBHOOK_SECRET=your-webhook-secret

# 邮件通知（可选）
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=SubTrack <noreply@yourdomain.com>

# 钉钉通知（可选）
DINGTALK_WEBHOOK=https://oapi.dingtalk.com/robot/send?access_token=xxx
DINGTALK_SECRET=SECxxxxxxxxxxx

# 飞书通知（可选）
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
FEISHU_SECRET=xxxxxxxxxxxxxxx
```

**生成安全密钥：**

```bash
# 生成 JWT_SECRET
openssl rand -hex 32

# 生成 WEBHOOK_SECRET
openssl rand -hex 32
```

### 2. 启动服务

```bash
docker-compose up -d
```

### 3. 查看日志

```bash
# 查看所有日志
docker-compose logs

# 查看应用日志
docker-compose logs web

# 实时日志
docker-compose logs -f web
```

---

## 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

数据库迁移会自动执行，无需手动操作！

---

## 常用命令

```bash
# 停止服务
docker-compose down

# 停止并删除数据（谨慎！）
docker-compose down -v

# 重启服务
docker-compose restart

# 查看容器状态
docker-compose ps

# 进入数据库
docker exec -it subtrack-db psql -U postgres -d subtrack
```

---

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker-compose logs web

# 检查端口占用
netstat -tulpn | grep 3000
```

### 数据库连接失败

```bash
# 检查数据库容器
docker-compose ps db

# 测试数据库连接
docker exec subtrack-db pg_isready -U postgres
```

### 迁移失败

```bash
# 查看迁移状态
docker exec subtrack-web npx prisma migrate status

# 手动应用迁移
docker exec subtrack-web npx prisma migrate deploy
```

---

## 配置说明

### 不需要配置 DATABASE_URL

`DATABASE_URL` 已在 `docker-compose.yml` 中配置，用于容器间通信。

你只需要关注：
- ✅ `JWT_SECRET` - 用户认证密钥（生产环境必改）
- ⚠️ `WEBHOOK_SECRET` - 定时任务密钥（可选）
- 📧 通知配置 - 根据需要配置

### 端口配置

默认端口：`3000`

如需修改，编辑 `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # 外部访问 8080，内部仍是 3000
```

---

## 安全建议

1. ⚠️ **生产环境必须修改 JWT_SECRET**
2. 🔒 修改默认数据库密码（docker-compose.yml）
3. 🌐 使用 Nginx 反向代理 + HTTPS
4. 🔥 配置防火墙规则
5. 💾 定期备份数据库

---

## 数据备份

```bash
# 备份数据库
docker exec subtrack-db pg_dump -U postgres subtrack > backup.sql

# 恢复数据库
docker exec -i subtrack-db psql -U postgres subtrack < backup.sql
```

---

有问题？提交 Issue: https://github.com/davaded/SubTrack/issues
