# SubTrack 快速开始指南

## 5 分钟快速部署

### 前置要求

确保你已经安装：
- Node.js 18+
- PostgreSQL 14+

### 步骤 1：安装项目

```bash
# 克隆项目
git clone <your-repo-url>
cd SubTrack

# 安装依赖
npm install
```

### 步骤 2：配置数据库

```bash
# 创建数据库
createdb subscriptions

# 或者使用 psql
psql -U postgres
CREATE DATABASE subscriptions;
\q
```

### 步骤 3：配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/subscriptions"
JWT_SECRET="请修改为随机生成的安全密钥"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**生成安全的 JWT 密钥：**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 步骤 4：初始化数据库

```bash
# 运行数据库迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate
```

### 步骤 5：启动应用

```bash
npm run dev
```

访问 http://localhost:3000 🎉

---

## 首次使用

### 1. 注册账号

访问 http://localhost:3000/register

- 输入邮箱
- 设置密码（至少 6 位）
- 可选：输入姓名
- 点击"注册"

### 2. 添加第一个订阅

1. 登录后自动跳转到首页
2. 点击右上角"添加订阅"按钮
3. 填写订阅信息：
   - **名称**：如 "Netflix"
   - **金额**：30.00
   - **货币**：CNY
   - **计费周期**：每月
   - **首次计费日期**：选择日期
   - **分类**：娱乐（可选）
4. 点击"创建订阅"

### 3. 查看统计

点击左侧"统计分析"，查看：
- 月度/年度总支出
- 分类支出占比（饼图）
- 支出对比（柱状图）

---

## 常见问题

### Q: 数据库连接失败？

**A:** 检查以下几点：
1. PostgreSQL 服务是否运行：`sudo service postgresql status`
2. 数据库是否存在：`psql -l | grep subscriptions`
3. `.env` 文件中的用户名和密码是否正确

### Q: npm install 失败？

**A:** 尝试：
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### Q: Prisma migrate 失败？

**A:** 确保：
1. 数据库已创建
2. 数据库用户有足够权限
3. 尝试：`npx prisma migrate reset`（会清空数据）

### Q: 页面显示空白？

**A:** 检查：
1. 浏览器控制台是否有错误
2. 是否已运行 `npx prisma generate`
3. 尝试重启开发服务器

---

## 生产环境部署

### 使用 Vercel（最简单）

1. 推送代码到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入项目
4. 添加环境变量
5. 部署！

**推荐数据库：**
- Vercel Postgres（简单，但付费）
- [Supabase](https://supabase.com)（免费额度）
- [Railway](https://railway.app)（免费额度）

### 使用 Docker（即将推出）

```bash
# 敬请期待
docker-compose up -d
```

---

## 下一步

- 📖 阅读完整 [README.zh-CN.md](README.zh-CN.md)
- 🎨 自定义配色方案
- 📊 添加更多订阅
- 💡 查看 [Issues](https://github.com/your-repo/issues) 了解新功能

---

## 需要帮助？

- 💬 提交 [Issue](https://github.com/your-repo/issues)
- 📧 发送邮件到 support@example.com
- 📚 查看文档

祝你使用愉快！✨
