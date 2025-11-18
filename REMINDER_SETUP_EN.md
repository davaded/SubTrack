# Email Reminder Setup Guide

This system uses **Resend + cron-job.org** to implement automatic email reminder functionality.

## 📋 Features

- ✅ Automatically check all users' upcoming subscriptions daily
- ✅ Send emails based on user-configured "remind days before"
- ✅ Group emails by urgency (urgent, soon, upcoming)
- ✅ Support Chinese and English email templates
- ✅ Beautiful HTML email design
- ✅ Prevent duplicate sends

---

## 🚀 Quick Start

### Step 1: Register Resend and Get API Key

1. Visit [Resend.com](https://resend.com)
2. Sign up for an account (free)
3. Create API Key:
   - Go to Dashboard → API Keys
   - Click "Create API Key"
   - Copy the generated key (format: `re_xxxxxxxxxxxx`)

4. Configure sender email:
   - **Option A (Recommended)**: Use your own domain
     - Go to Dashboard → Domains
     - Add your domain (e.g., `yourdomain.com`)
     - Configure DNS records as instructed
     - After verification, you can use `noreply@yourdomain.com`

   - **Option B (Testing)**: Use Resend's test domain
     - Can only send to your verified email
     - Suitable for development testing
     - Uses `onboarding@resend.dev`

### Step 2: Configure Environment Variables

Add to your `.env` file in the project root:

```bash
# Resend API Key
RESEND_API_KEY="re_your_actual_api_key_here"

# Sender email address
EMAIL_FROM="SubTrack <noreply@yourdomain.com>"

# Webhook security secret (random string)
WEBHOOK_SECRET="your-random-secure-secret-change-this"

# Application URL (for links in emails)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**Generate random Webhook Secret:**
```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 32

# Method 3: Online generator
# Visit https://www.random.org/strings/
```

### Step 3: Test Email Functionality

1. Make sure you have some active subscription data
2. Test using one of these methods:

**Method A: Using API test endpoint**
```bash
# Send test email to current logged-in user
curl -X POST http://localhost:3000/api/reminders/test \
  -H "Cookie: token=your_jwt_token"
```

**Method B: Using browser**
- Log into the system
- Execute in browser console:
```javascript
fetch('/api/reminders/test', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

3. Check your email inbox for the test email

### Step 4: Set Up Cron Job (cron-job.org)

1. Visit [cron-job.org](https://cron-job.org)
2. Sign up for an account (free)
3. Create a Cron Job:
   - **Title**: SubTrack Reminder Check
   - **URL**: `https://yourdomain.com/api/reminders/check`
   - **Schedule**:
     - Select "Every day"
     - Time: `08:00` (8 AM daily)
     - Timezone: Select your timezone
   - **Request method**: POST
   - **Custom headers**:
     ```
     x-webhook-secret: your-webhook-secret-from-env
     ```

4. Enable and save

5. Test execution:
   - Click "Run now" in the cron-job.org panel
   - Check execution logs
   - Verify user emails

---

## 📧 Email Template Example

Users will receive emails in this format:

```
Subject: 【SubTrack】Subscription Renewal Reminder - 3 subscription(s) due

Hi John,

The following subscriptions are due for renewal:

🔴 Urgent (Within 3 Days)
  • Netflix - $30.00 - Renewing tomorrow

🟠 Soon (Within 7 Days)
  • ChatGPT - $20.00 - Renewing in 5 days
  • Spotify - $15.00 - Renewing in 6 days

[View Details Button]

---
SubTrack Subscription Manager
Don't want to receive email reminders? Go to Settings
```

---

## 🔧 Advanced Configuration

### Change Email Send Time

Modify the Schedule setting in cron-job.org:
- Daily 8:00 AM: `0 8 * * *`
- Daily 8:00 PM: `0 20 * * *`
- Twice daily: Create two Cron Jobs

### Modify Reminder Logic

Edit `app/api/reminders/check/route.ts`:

```typescript
// Current logic: Only send within reminder days range
const needsReminder = sub.daysUntilRenewal >= 0 &&
                     sub.daysUntilRenewal <= sub.remindDaysBefore

// Modify to: Send all upcoming (within 7 days) daily
const needsReminder = sub.daysUntilRenewal >= 0 &&
                     sub.daysUntilRenewal <= 7
```

### Customize Email Template

Edit `lib/email/templates.ts`:
- Modify colors and styles
- Add more information
- Change wording

---

## 🐛 Troubleshooting

### 1. Email Send Failure

**Check Resend API Key:**
```bash
# Test if API Key is valid
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

**Common Errors:**
- `Authentication failed`: API Key is wrong or expired
- `Domain not verified`: Domain not verified (when using custom domain)
- `Invalid from address`: Sender address format error

### 2. Webhook Call Failure

**Check Webhook Secret:**
```bash
# Manually test webhook
curl -X POST https://yourdomain.com/api/reminders/check \
  -H "x-webhook-secret: your-webhook-secret"
```

**Returns 401 Unauthorized:**
- Check if the secret in Header matches `WEBHOOK_SECRET` in `.env`

### 3. No Email Received

**Possible Reasons:**
1. Email went to spam → Check spam folder
2. No qualifying subscriptions → Check subscription `remindDaysBefore` settings
3. Wrong user email → Check email in database
4. Resend quota exhausted → Check Resend Dashboard

**View Send Logs:**
- Log into Resend Dashboard → Emails
- Check send status (Sent / Bounced / Delivered)

---

## 💡 Best Practices

1. **Testing Environment**:
   - Configure in test environment first
   - Verify with test email
   - Deploy to production after confirmation

2. **Monitoring**:
   - Regularly check cron-job.org execution logs
   - Monitor Resend sending statistics
   - Set up Cron Job failure notifications

3. **Email Content**:
   - Keep it concise and clear
   - Provide clear call-to-action buttons
   - Include unsubscribe option

4. **Frequency Control**:
   - Recommend sending only once daily
   - Avoid disturbing users

---

## 📊 Cost Estimation

### Resend Free Tier
- **3,000 emails per month**
- **100 emails per day**

**Example:**
- 100 users, average 5 subscriptions each
- Assume 20% of subscriptions need reminders daily
- Daily sends: 100 × 20% = 20 emails
- Monthly sends: 20 × 30 = 600 emails
- ✅ Well within free tier

### cron-job.org
- ✅ Completely free
- Unlimited executions

---

## 🔐 Security Recommendations

1. **Protect API Keys**:
   - Don't commit `.env` file to Git
   - Use environment variables for sensitive info
   - Regularly rotate API Keys

2. **Webhook Security**:
   - Use strong random Secret
   - Only expose webhook endpoint when necessary
   - Monitor abnormal calls

3. **Email Security**:
   - Configure SPF/DKIM/DMARC records
   - Use HTTPS links
   - Avoid including sensitive info in emails

---

## 📞 Need Help?

- Resend Documentation: https://resend.com/docs
- cron-job.org Documentation: https://cron-job.org/en/documentation/
- Project Issues: Submit GitHub Issue

---

## 🎉 Done!

After configuration is complete, the system will:
1. ✅ Automatically check all users' subscriptions daily
2. ✅ Send emails to users with upcoming renewals
3. ✅ Intelligently group by urgency
4. ✅ Provide direct links for easy access

User experience flow:
```
User adds subscription → Sets remind days before →
System checks daily → Sends email when qualified →
User receives email → Clicks to view details → Manages subscription
```
