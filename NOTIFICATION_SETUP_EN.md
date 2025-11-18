# Notification Channels Setup Guide

SubTrack supports three notification channels that can be used individually or in combination:
- ✅ Email (Resend)
- ✅ DingTalk Bot
- ✅ Feishu/Lark Bot

---

## 📧 Email Notification (Resend)

See [REMINDER_SETUP_EN.md](./REMINDER_SETUP_EN.md) for detailed configuration

**Best For:**
- Personal use
- Need long-term record keeping
- Formal notifications

---

## 🔔 DingTalk Bot Configuration

### Step 1: Create DingTalk Bot

1. **Open DingTalk Group**
   - Create a new group (or use existing)
   - Suggested name: "SubTrack Reminders"

2. **Add Custom Bot**
   - Group Settings → Smart Group Assistant → Add Bot
   - Select "Custom" bot
   - Enter bot name: SubTrack
   - Upload bot avatar (optional)

3. **Configure Security Settings** (choose one)

   **Option A: Sign (Recommended✅)**
   - Check "Sign"
   - System will generate a Secret (format: `SECxxxxx`)
   - **Copy and save this Secret**

   **Option B: Custom Keywords**
   - Check "Custom Keywords"
   - Add keyword: `SubTrack`
   - Messages must contain this keyword

   **Option C: IP Address**
   - Check "IP Address"
   - Add your server's outbound IP
   - Not recommended (IP may change)

4. **Complete and Copy Webhook**
   - Click "Finish"
   - Copy Webhook URL (format: `https://oapi.dingtalk.com/robot/send?access_token=xxx`)

### Step 2: Configure Environment Variables

Add to your `.env` file:

```bash
# DingTalk Webhook URL (required)
DINGTALK_WEBHOOK="https://oapi.dingtalk.com/robot/send?access_token=your_token_here"

# DingTalk Sign Secret (required if using sign)
DINGTALK_SECRET="SECxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Step 3: Test

1. Restart application
2. Manually trigger webhook or wait for scheduled task
3. Check if DingTalk group receives message

### DingTalk Message Format

```markdown
### 📋 Subscription Renewal Reminder

Hi John,

The following subscriptions are due for renewal:

---

#### 🔴 Urgent (Within 3 Days)

- **Netflix** - $30.00 - Renewing tomorrow

#### 🟠 Soon (Within 7 Days)

- **ChatGPT** - $20.00 - Renewing in 5 days
- **Spotify** - $15.00 - Renewing in 6 days

---

[View Details](https://your.com/subscriptions)
```

### Troubleshooting

**1. Message Send Failed**

Check error messages:
- `invalid timestamp`: Server time out of sync
- `sign not match`: Incorrect Secret
- `keywords not in content`: Missing required keyword

**2. No Message Received**

- Check if Webhook URL is correct
- Check if Secret is correct (if using sign)
- Check if bot is disabled
- View application logs for errors

---

## 🚀 Feishu/Lark Bot Configuration

### Step 1: Create Feishu Bot

1. **Open Feishu Group**
   - Create a new group (or use existing)
   - Suggested name: "SubTrack Reminders"

2. **Add Custom Bot**
   - Group Settings → Group Bots → Add Bot
   - Select "Custom Bot"
   - Enter bot name: SubTrack
   - Upload bot avatar (optional)

3. **Configure Security Settings** (optional)

   **Sign Verification (Recommended✅)**
   - Check "Sign Verification"
   - System will generate a Signing Secret
   - **Copy and save this secret**

4. **Complete and Copy Webhook**
   - Click "Finish"
   - Copy Webhook URL (format: `https://open.feishu.cn/open-apis/bot/v2/hook/xxx`)

### Step 2: Configure Environment Variables

Add to your `.env` file:

```bash
# Feishu Webhook URL (required)
FEISHU_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxx"

# Feishu Signing Secret (required if sign enabled)
FEISHU_SECRET="your_signing_secret_here"
```

### Step 3: Test

1. Restart application
2. Manually trigger webhook or wait for scheduled task
3. Check if Feishu group receives message

### Feishu Message Format

Feishu will receive a beautiful interactive card:

```
┌─────────────────────────────────────┐
│ 📋 Subscription Renewal Reminder    │
│     (3 subscription(s))              │
├─────────────────────────────────────┤
│                                     │
│ Hi John                             │
│                                     │
│ The following subscriptions are due:│
│                                     │
│ 🔴 Urgent (Within 3 Days)          │
│ • Netflix - $30.00 - Tomorrow      │
│                                     │
│ 🟠 Soon (Within 7 Days)            │
│ • ChatGPT - $20.00 - In 5 days    │
│ • Spotify - $15.00 - In 6 days    │
│                                     │
│      [ View Details ]  ← Clickable │
│                                     │
└─────────────────────────────────────┘
```

### Troubleshooting

**1. Message Send Failed**

Check error messages:
- `Invalid signature`: Incorrect signature
- `url not match`: Wrong Webhook URL
- `bot not found`: Bot has been deleted

**2. No Message Received**

- Check if Webhook URL is correct
- Check if signing secret is correct (if enabled)
- Check if bot was removed from group
- View application logs for errors

---

## 🎯 Recommended Combinations

### Option 1: Single Channel

**DingTalk Only:**
```bash
# Configure DingTalk only
DINGTALK_WEBHOOK="..."
DINGTALK_SECRET="..."
```

**Feishu Only:**
```bash
# Configure Feishu only
FEISHU_WEBHOOK="..."
FEISHU_SECRET="..."
```

**Email Only:**
```bash
# Configure Email only
RESEND_API_KEY="..."
EMAIL_FROM="..."
```

### Option 2: Dual Channel (Recommended)

**DingTalk + Email:**
```bash
# Instant notification + permanent archive
DINGTALK_WEBHOOK="..."
DINGTALK_SECRET="..."
RESEND_API_KEY="..."
EMAIL_FROM="..."
```

### Option 3: All Channels

**Email + DingTalk + Feishu:**
```bash
# Triple protection
RESEND_API_KEY="..."
EMAIL_FROM="..."
DINGTALK_WEBHOOK="..."
DINGTALK_SECRET="..."
FEISHU_WEBHOOK="..."
FEISHU_SECRET="..."
```

---

## 📊 Feature Comparison

| Feature | Email | DingTalk | Feishu |
|---------|-------|----------|--------|
| Cost | Free 3000/month | Completely Free | Completely Free |
| Instant | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Rich Text | HTML | Markdown | Interactive Card |
| Buttons | ✅ | ✅ | ✅ |
| @ Mentions | ❌ | ✅ | ✅ |
| Group Share | ❌ | ✅ | ✅ |
| Archive | ✅ Easy | ⚠️ May scroll away | ⚠️ May scroll away |
| Mobile Push | Depends on email | ✅ DingTalk push | ✅ Feishu push |

---

## 🔐 Security Recommendations

1. **Protect Keys**
   - Don't commit Webhook URLs and Secrets to Git
   - Use environment variables
   - Regularly rotate secrets

2. **Enable Signature Verification**
   - DingTalk: Use Sign
   - Feishu: Enable Sign Verification
   - Prevent unauthorized message sending

3. **Group Member Management**
   - Limit group members
   - Regularly review members
   - Don't use in public groups

---

## 💡 Advanced Tips

### DingTalk @ Specific Members

Modify `lib/notification/dingtalk.ts`:

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
      atMobiles: ['13800138000'], // Phone numbers
      isAtAll: false, // @ everyone
    },
  }),
})
```

### Feishu @ Specific Members

Add to message content: `<at user_id="ou_xxx">@John</at>`

---

## 📞 FAQ

**Q: Can I use DingTalk and Feishu at the same time?**
A: Yes! Configure both Webhooks, the system will send to both platforms.

**Q: Will DingTalk/Feishu failure affect email?**
A: No! Three channels are independent, one failure doesn't affect others.

**Q: How to disable a channel?**
A: Delete or comment out the corresponding environment variables.

**Q: Can I send to multiple DingTalk groups?**
A: Currently supports one group. For multiple groups, code modification needed to add loop sending.

**Q: Can I customize message format?**
A: Yes! Modify templates in `lib/notification/templates.ts`.

---

## 🎉 Done!

After configuration, the system will automatically send reminders to configured channels:
1. ✅ Daily scheduled check
2. ✅ Send to email (if configured)
3. ✅ Send to DingTalk group (if configured)
4. ✅ Send to Feishu group (if configured)

**Test Method:**
```bash
# Manually trigger reminder check
curl -X POST https://your-domain.com/api/reminders/check \
  -H "x-webhook-secret: your-secret"
```

**View Send Results:**
API returns statistics for each channel:
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
