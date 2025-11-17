# 邮件提醒功能配置指南

本系统使用 **Resend + cron-job.org** 实现自动邮件提醒功能。

## 📋 功能说明

- ✅ 每天自动检查所有用户的即将到期订阅
- ✅ 根据用户设置的"提前提醒天数"发送邮件
- ✅ 邮件按紧急程度分组（紧急、即将到期、普通）
- ✅ 支持中英文邮件模板
- ✅ 美观的 HTML 邮件样式
- ✅ 防止重复发送

---

## 🚀 快速开始

### 第一步：注册 Resend 并获取 API Key

1. 访问 [Resend.com](https://resend.com)
2. 注册账号（免费）
3. 创建 API Key：
   - 进入 Dashboard → API Keys
   - 点击 "Create API Key"
   - 复制生成的 Key（格式：`re_xxxxxxxxxxxx`）

4. 配置发件邮箱：
   - **方案 A（推荐）**：使用自己的域名
     - 进入 Dashboard → Domains
     - 添加你的域名（如 `yourdomain.com`）
     - 按照提示配置 DNS 记录
     - 验证通过后可以使用 `noreply@yourdomain.com`

   - **方案 B（测试）**：使用 Resend 提供的测试域名
     - 只能发送到你自己验证的邮箱
     - 适合开发测试
     - 使用 `onboarding@resend.dev`

### 第二步：配置环境变量

在项目根目录的 `.env` 文件中添加：

```bash
# Resend API Key
RESEND_API_KEY="re_your_actual_api_key_here"

# 发件邮箱地址
EMAIL_FROM="SubTrack <noreply@yourdomain.com>"

# Webhook 安全密钥（随机字符串）
WEBHOOK_SECRET="your-random-secure-secret-change-this"

# 应用 URL（用于邮件中的链接）
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**生成随机 Webhook Secret：**
```bash
# 方法 1：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 方法 2：使用 OpenSSL
openssl rand -hex 32

# 方法 3：在线生成
# 访问 https://www.random.org/strings/
```

### 第三步：测试邮件功能

1. 确保你有一些活跃的订阅数据
2. 使用以下方式测试：

**方法 A：使用 API 测试端点**
```bash
# 发送测试邮件给当前登录用户
curl -X POST http://localhost:3000/api/reminders/test \
  -H "Cookie: token=your_jwt_token"
```

**方法 B：使用浏览器**
- 登录系统
- 在浏览器控制台执行：
```javascript
fetch('/api/reminders/test', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

3. 检查邮箱，应该能收到测试邮件

### 第四步：设置定时任务（cron-job.org）

1. 访问 [cron-job.org](https://cron-job.org)
2. 注册账号（免费）
3. 创建 Cron Job：
   - **Title**: SubTrack Reminder Check
   - **URL**: `https://yourdomain.com/api/reminders/check`
   - **Schedule**:
     - 选择 "Every day"
     - 时间：`08:00`（每天早上8点）
     - 时区：选择你的时区
   - **Request method**: POST
   - **Custom headers**:
     ```
     x-webhook-secret: your-webhook-secret-from-env
     ```

4. 启用并保存

5. 测试执行：
   - 在 cron-job.org 面板中点击 "Run now"
   - 查看执行日志
   - 检查用户邮箱

---

## 📧 邮件模板示例

用户会收到如下格式的邮件：

```
主题：【SubTrack】订阅续费提醒 - 3 个订阅即将续费

你好 张三,

以下订阅即将续费：

🔴 紧急（3天内）
  • Netflix - ¥30.00 - 明天续费

🟠 即将到期（7天内）
  • ChatGPT - $20.00 - 5天后续费
  • Spotify - ¥15.00 - 6天后续费

[查看详情 按钮]

---
SubTrack 订阅管理系统
不想接收邮件提醒？前往设置
```

---

## 🔧 高级配置

### 修改邮件发送时间

在 cron-job.org 中修改 Schedule 设置：
- 每天早上 8:00：`0 8 * * *`
- 每天晚上 8:00：`0 20 * * *`
- 每天早晚各一次：创建两个 Cron Job

### 修改提醒逻辑

编辑 `app/api/reminders/check/route.ts`：

```typescript
// 当前逻辑：在提醒天数范围内才发送
const needsReminder = sub.daysUntilRenewal >= 0 &&
                     sub.daysUntilRenewal <= sub.remindDaysBefore

// 修改为：每天都发送所有即将到期的（7天内）
const needsReminder = sub.daysUntilRenewal >= 0 &&
                     sub.daysUntilRenewal <= 7
```

### 自定义邮件模板

编辑 `lib/email/templates.ts`：
- 修改颜色、样式
- 添加更多信息
- 修改文案

---

## 🐛 故障排查

### 1. 邮件发送失败

**检查 Resend API Key：**
```bash
# 测试 API Key 是否有效
curl https://api.resend.com/emails \
  -H "Authorization: Bearer re_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your@email.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

**常见错误：**
- `Authentication failed`: API Key 错误或已过期
- `Domain not verified`: 域名未验证（使用自定义域名时）
- `Invalid from address`: 发件地址格式错误

### 2. Webhook 调用失败

**检查 Webhook Secret：**
```bash
# 手动测试 webhook
curl -X POST https://yourdomain.com/api/reminders/check \
  -H "x-webhook-secret: your-webhook-secret"
```

**返回 401 Unauthorized：**
- 检查 Header 中的 secret 是否与 `.env` 中的 `WEBHOOK_SECRET` 一致

### 3. 没有收到邮件

**可能原因：**
1. 邮件进入垃圾箱 → 检查垃圾邮件文件夹
2. 没有符合条件的订阅 → 检查订阅的 `remindDaysBefore` 设置
3. 用户邮箱错误 → 检查数据库中的用户邮箱
4. Resend 配额用完 → 检查 Resend Dashboard

**查看发送日志：**
- 登录 Resend Dashboard → Emails
- 查看发送状态（Sent / Bounced / Delivered）

---

## 💡 最佳实践

1. **测试环境**：
   - 先在测试环境配置
   - 使用测试邮箱验证
   - 确认无误后再部署到生产环境

2. **监控**：
   - 定期检查 cron-job.org 执行日志
   - 监控 Resend 发送统计
   - 设置 Cron Job 执行失败通知

3. **邮件内容**：
   - 保持简洁明了
   - 提供清晰的行动按钮
   - 包含取消订阅选项

4. **频率控制**：
   - 建议每天只发送一次
   - 避免打扰用户

---

## 📊 成本估算

### Resend 免费额度
- **每月 3,000 封邮件**
- **每天 100 封邮件**

**举例：**
- 100 个用户，每人平均 5 个订阅
- 假设每天有 20% 的订阅需要提醒
- 每天发送：100 × 20% = 20 封邮件
- 每月发送：20 × 30 = 600 封邮件
- ✅ 完全在免费额度内

### cron-job.org
- ✅ 完全免费
- 无限制执行次数

---

## 🔐 安全建议

1. **保护 API Keys**：
   - 不要将 `.env` 文件提交到 Git
   - 使用环境变量管理敏感信息
   - 定期轮换 API Key

2. **Webhook 安全**：
   - 使用强随机 Secret
   - 仅在必要时暴露 webhook 端点
   - 监控异常调用

3. **邮件安全**：
   - 配置 SPF/DKIM/DMARC 记录
   - 使用 HTTPS 链接
   - 避免在邮件中包含敏感信息

---

## 📞 需要帮助？

- Resend 文档：https://resend.com/docs
- cron-job.org 文档：https://cron-job.org/en/documentation/
- 项目问题：提交 GitHub Issue

---

## 🎉 完成！

配置完成后，系统会：
1. ✅ 每天自动检查所有用户的订阅
2. ✅ 向有即将到期订阅的用户发送邮件
3. ✅ 按紧急程度智能分组
4. ✅ 提供直达链接方便用户查看

用户体验流程：
```
用户添加订阅 → 设置提前提醒天数 →
系统每天检查 → 符合条件时发送邮件 →
用户收到邮件 → 点击查看详情 → 管理订阅
```
