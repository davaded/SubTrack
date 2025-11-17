# 通知渠道配置指南

SubTrack 支持三种通知渠道，可以单独使用或组合使用：
- ✅ 邮件（Resend）
- ✅ 钉钉群机器人
- ✅ 飞书群机器人

---

## 📧 邮件通知（Resend）

详细配置请参考 [REMINDER_SETUP.md](./REMINDER_SETUP.md)

**适合场景：**
- 个人使用
- 需要长期保存记录
- 正式通知

---

## 🔔 钉钉群机器人配置

### 第一步：创建钉钉群机器人

1. **打开钉钉群**
   - 创建一个新群（或使用现有群）
   - 建议命名：「SubTrack 订阅提醒」

2. **添加自定义机器人**
   - 群设置 → 智能群助手 → 添加机器人
   - 选择"自定义"机器人
   - 输入机器人名称：SubTrack
   - 上传机器人头像（可选）

3. **配置安全设置**（三选一）

   **方式 A：加签（推荐✅）**
   - 勾选"加签"
   - 系统会生成一个 Secret（格式：`SECxxxxx`）
   - **复制保存这个 Secret**

   **方式 B：自定义关键词**
   - 勾选"自定义关键词"
   - 添加关键词：`SubTrack`
   - 消息中必须包含这个关键词才能发送

   **方式 C：IP 地址**
   - 勾选"IP地址（段）"
   - 添加服务器的出口 IP
   - 不推荐（IP 可能变化）

4. **完成并复制 Webhook**
   - 点击"完成"
   - 复制 Webhook URL（格式：`https://oapi.dingtalk.com/robot/send?access_token=xxx`）

### 第二步：配置环境变量

在 `.env` 文件中添加：

```bash
# 钉钉 Webhook URL（必需）
DINGTALK_WEBHOOK="https://oapi.dingtalk.com/robot/send?access_token=your_token_here"

# 钉钉加签密钥（如果使用加签，必需）
DINGTALK_SECRET="SECxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 第三步：测试

1. 重启应用
2. 手动触发 webhook 或等待定时任务
3. 检查钉钉群是否收到消息

### 钉钉消息效果

```markdown
### 📋 订阅续费提醒

张三 你好，

以下订阅即将续费：

---

#### 🔴 紧急（3天内）

- **Netflix** - ¥30.00 - 明天续费

#### 🟠 即将到期（7天内）

- **ChatGPT** - $20.00 - 5天后续费
- **Spotify** - ¥15.00 - 6天后续费

---

[查看详情](https://your.com/subscriptions)
```

### 故障排查

**1. 消息发送失败**

检查错误信息：
- `invalid timestamp`: 服务器时间不同步
- `sign not match`: Secret 不正确
- `keywords not in content`: 未包含关键词

**2. 没有收到消息**

- 检查 Webhook URL 是否正确
- 检查 Secret 是否正确（如果使用加签）
- 检查机器人是否被禁用
- 查看应用日志中的错误信息

---

## 🚀 飞书群机器人配置

### 第一步：创建飞书群机器人

1. **打开飞书群**
   - 创建一个新群（或使用现有群）
   - 建议命名：「SubTrack 订阅提醒」

2. **添加自定义机器人**
   - 群设置 → 群机器人 → 添加机器人
   - 选择"自定义机器人"
   - 输入机器人名称：SubTrack
   - 上传机器人头像（可选）

3. **配置安全设置**（可选）

   **签名校验（推荐✅）**
   - 勾选"签名校验"
   - 系统会生成一个密钥（Signing Secret）
   - **复制保存这个密钥**

4. **完成并复制 Webhook**
   - 点击"完成"
   - 复制 Webhook URL（格式：`https://open.feishu.cn/open-apis/bot/v2/hook/xxx`）

### 第二步：配置环境变量

在 `.env` 文件中添加：

```bash
# 飞书 Webhook URL（必需）
FEISHU_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxx"

# 飞书签名密钥（如果启用签名，必需）
FEISHU_SECRET="your_signing_secret_here"
```

### 第三步：测试

1. 重启应用
2. 手动触发 webhook 或等待定时任务
3. 检查飞书群是否收到消息

### 飞书消息效果

飞书会收到一个漂亮的交互式卡片：

```
┌─────────────────────────────────────┐
│ 📋 订阅续费提醒 (3 个订阅)          │
├─────────────────────────────────────┤
│                                     │
│ 张三 你好                           │
│                                     │
│ 以下订阅即将续费：                   │
│                                     │
│ 🔴 紧急（3天内）                    │
│ • Netflix - ¥30.00 - 明天续费       │
│                                     │
│ 🟠 即将到期（7天内）                │
│ • ChatGPT - $20.00 - 5天后续费     │
│ • Spotify - ¥15.00 - 6天后续费     │
│                                     │
│        [ 查看详情 ]  ← 可点击按钮   │
│                                     │
└─────────────────────────────────────┘
```

### 故障排查

**1. 消息发送失败**

检查错误信息：
- `Invalid signature`: 签名不正确
- `url not match`: Webhook URL 错误
- `bot not found`: 机器人已被删除

**2. 没有收到消息**

- 检查 Webhook URL 是否正确
- 检查签名密钥是否正确（如果启用）
- 检查机器人是否被移出群聊
- 查看应用日志中的错误信息

---

## 🎯 组合使用建议

### 方案 1：只用一个渠道

**只用钉钉：**
```bash
# 仅配置钉钉
DINGTALK_WEBHOOK="..."
DINGTALK_SECRET="..."
```

**只用飞书：**
```bash
# 仅配置飞书
FEISHU_WEBHOOK="..."
FEISHU_SECRET="..."
```

**只用邮件：**
```bash
# 仅配置邮件
RESEND_API_KEY="..."
EMAIL_FROM="..."
```

### 方案 2：双通道（推荐）

**钉钉 + 邮件：**
```bash
# 即时通知 + 永久保存
DINGTALK_WEBHOOK="..."
DINGTALK_SECRET="..."
RESEND_API_KEY="..."
EMAIL_FROM="..."
```

### 方案 3：全渠道

**邮件 + 钉钉 + 飞书：**
```bash
# 三重保障
RESEND_API_KEY="..."
EMAIL_FROM="..."
DINGTALK_WEBHOOK="..."
DINGTALK_SECRET="..."
FEISHU_WEBHOOK="..."
FEISHU_SECRET="..."
```

---

## 📊 功能对比

| 功能 | 邮件 | 钉钉 | 飞书 |
|------|------|------|------|
| 成本 | 免费3000封/月 | 完全免费 | 完全免费 |
| 即时性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 富文本 | HTML | Markdown | 交互卡片 |
| 按钮 | ✅ | ✅ | ✅ |
| @人 | ❌ | ✅ | ✅ |
| 群共享 | ❌ | ✅ | ✅ |
| 消息归档 | ✅ 易查找 | ⚠️ 会刷掉 | ⚠️ 会刷掉 |
| 移动通知 | 取决于邮箱 | ✅ 钉钉通知 | ✅ 飞书通知 |

---

## 🔐 安全建议

1. **保护密钥**
   - 不要将 Webhook URL 和 Secret 提交到 Git
   - 使用环境变量管理
   - 定期轮换密钥

2. **启用签名验证**
   - 钉钉：使用加签
   - 飞书：启用签名校验
   - 防止他人恶意发送消息

3. **群成员管理**
   - 限制群成员数量
   - 定期检查群成员
   - 不要在公开群使用

---

## 💡 高级技巧

### 钉钉 @特定成员

修改 `lib/notification/dingtalk.ts`：

```typescript
await fetch(url, {
  method: 'POST',
  body: JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      title: message.title,
      text: message.text,
    },
    at: {
      atMobiles: ['13800138000'], // 手机号
      isAtAll: false, // 是否@所有人
    },
  }),
})
```

### 飞书 @特定成员

修改消息内容添加：`<at user_id="ou_xxx">@张三</at>`

---

## 📞 常见问题

**Q: 可以同时使用钉钉和飞书吗？**
A: 可以！配置两个 Webhook，系统会同时发送到两个平台。

**Q: 钉钉/飞书发送失败会影响邮件吗？**
A: 不会！三个渠道相互独立，一个失败不影响其他。

**Q: 如何关闭某个渠道？**
A: 删除或注释掉对应的环境变量即可。

**Q: 可以发送到多个钉钉群吗？**
A: 目前只支持一个群。如果需要多个群，需要修改代码添加循环发送。

**Q: 消息格式可以自定义吗？**
A: 可以！修改 `lib/notification/templates.ts` 中的模板。

---

## 🎉 完成！

配置完成后，系统会自动向配置的渠道发送提醒：
1. ✅ 每天定时检查
2. ✅ 向邮箱发送（如果配置）
3. ✅ 向钉钉群发送（如果配置）
4. ✅ 向飞书群发送（如果配置）

**测试方式：**
```bash
# 手动触发提醒检查
curl -X POST https://your-domain.com/api/reminders/check \
  -H "x-webhook-secret: your-secret"
```

**查看发送结果：**
API 会返回各渠道的发送统计：
```json
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "emailsSent": 8,
    "dingTalkSent": 10,
    "feishuSent": 10,
    "errors": []
  }
}
```
