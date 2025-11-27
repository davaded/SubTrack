# SubTrack - Subscription Management System

[![Version](https://img.shields.io/github/v/release/davaded/SubTrack?label=version)](https://github.com/davaded/SubTrack/releases)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue)](https://github.com/davaded/SubTrack/pkgs/container/subtrack)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/davaded/SubTrack/docker-publish.yml?branch=main)](https://github.com/davaded/SubTrack/actions)

[简体中文](./README.zh-CN.md) | English | [🚀 Quick Start](./QUICKSTART.md)

A modern web application to help you manage and track all your subscription services in one place.

> **👉 New to SubTrack?** Check out our [Quick Start Guide](./QUICKSTART.md) for step-by-step deployment instructions!

## ✨ Features

### Core Features
- 📊 **Subscription Management**: Add, edit, and delete subscriptions with detailed information
- 💰 **Cost Tracking**: Automatic calculation of monthly/yearly spending
- 🔔 **Smart Reminders**: Multi-channel renewal reminders (Email/DingTalk/Feishu)
- 📈 **Statistics**: Spending trends and category analytics
- 🌍 **Multi-language**: Support Chinese and English
- 🎨 **Icon Support**: Automatically fetch subscription service icons
- 👥 **Admin System**: User management, registration control, and system settings

### Reminder System
- ✅ Email notifications (Resend)
- ✅ DingTalk group bot
- ✅ Feishu/Lark group bot
- ✅ Can be used in combination
- ✅ Group by urgency
- ✅ Custom remind days before

### Subscription Features
- 🔄 Multiple billing cycles (Monthly/Quarterly/Semi-annually/Annually/Custom)
- 💱 Multi-currency support (CNY/USD/EUR/GBP)
- 🏷️ Category management
- 🔗 Website links
- 📝 Notes
- ✅/❌ Active/Cancelled status

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SubTrack.git
cd SubTrack
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/subscriptions"
POSTGRES_PASSWORD="your-secure-password"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Default Admin Account
DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASSWORD="admin123456"
DEFAULT_ADMIN_NAME="System Administrator"

# Email Reminder (Optional)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="SubTrack <noreply@yourdomain.com>"

# DingTalk Notification (Optional)
DINGTALK_WEBHOOK="https://oapi.dingtalk.com/robot/send?access_token=xxx"
DINGTALK_SECRET="SECxxxxxxxxx"

# Feishu Notification (Optional)
FEISHU_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
FEISHU_SECRET="xxxxxxxxx"

# Webhook Secret
WEBHOOK_SECRET="random-string-here"
```

4. **Initialize database**
```bash
npx prisma migrate dev
```

5. **Start development server**
```bash
npm run dev
```

6. **Open application**
```
http://localhost:3000
```

---

## 📖 Documentation

### Deployment Guides
- [Docker Deployment (GitHub Container Registry)](./GITHUB_DEPLOY.md)
- [Build and Deployment Options](./BUILD_DEPLOY.md)
- [General Deployment Guide](./DEPLOY.md)

### Admin System
- [Admin System Guide](./ADMIN_GUIDE.md) - User management and system settings

### Reminder Configuration
- [Email Reminder Setup Guide](./REMINDER_SETUP_EN.md)
- [DingTalk/Feishu Notification Setup Guide](./NOTIFICATION_SETUP_EN.md)

### Chinese Documentation
- [邮件提醒配置指南](./REMINDER_SETUP.md)
- [钉钉/飞书通知配置指南](./NOTIFICATION_SETUP.md)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Date Handling**: Day.js
- **Charts**: Recharts
- **Form Validation**: Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt

### Notification Services
- **Email**: Resend
- **Instant Messaging**: DingTalk/Feishu Webhook
- **Cron Jobs**: cron-job.org

---

## 📁 Project Structure

```
SubTrack/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages
│   ├── (dashboard)/         # Dashboard pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── layout/              # Layout components
│   ├── subscription/        # Subscription components
│   └── ui/                  # Base UI components
├── lib/                     # Utilities
│   ├── auth/                # Auth utilities
│   ├── email/               # Email services
│   ├── notification/        # Notification services
│   ├── i18n/                # Internationalization
│   └── store/               # State management
├── prisma/                  # Database config
│   └── schema.prisma        # Data models
└── public/                  # Static assets
```

---

## 🔔 Notification Channels

### Email Notification
- Beautiful HTML template
- Grouped by urgency
- Clickable links

### DingTalk Notification
- Markdown format
- Support @mentions
- Group sharing

### Feishu Notification
- Interactive card
- With buttons
- Better visual design

**All channels can be used individually or in combination!**

---

## 🌍 Internationalization

Supported languages:
- 🇨🇳 Simplified Chinese
- 🇺🇸 English

How to switch:
- Language toggle button in top navigation
- Auto-save user preference

---

## 🚀 Deployment

### Docker (Recommended)

The easiest way to deploy SubTrack is using Docker with pre-built images from GitHub Container Registry.

#### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/davaded/SubTrack.git
cd SubTrack

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your settings

# 3. Deploy with Docker Compose
export GITHUB_USERNAME=davaded
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

#### Using Latest Release

```bash
# Pull the latest image
docker pull ghcr.io/davaded/subtrack:latest

# Or pull a specific version
docker pull ghcr.io/davaded/subtrack:v1.0.0
```

**📖 Detailed Guide**: See [GITHUB_DEPLOY.md](./GITHUB_DEPLOY.md) for complete Docker deployment instructions.

### Vercel

1. Fork this project
2. Import to Vercel
3. Configure environment variables
4. Deploy

### Self-Hosted (Manual)

1. Build project
```bash
npm run build
```

2. Start production server
```bash
npm start
```

3. Use PM2 for process management
```bash
pm2 start npm --name "subtrack" -- start
```

**📖 More Options**: See [BUILD_DEPLOY.md](./BUILD_DEPLOY.md) for all deployment methods.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details

---

## 💬 Contact

- Bug Reports: [GitHub Issues](https://github.com/yourusername/SubTrack/issues)
- Feature Requests: [GitHub Discussions](https://github.com/yourusername/SubTrack/discussions)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - ORM
- [Resend](https://resend.com/) - Email Service
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Zustand](https://github.com/pmndrs/zustand) - State Management

---

## ⭐ Star History

If this project helps you, please give it a Star ⭐

---

**Made with ❤️ by SubTrack Team**


## Usage

### First-Time Setup

1. **Admin Login**
   - After first deployment, a default admin account is automatically created
   - Login with the credentials from your `.env` file (DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD)
   - **Important**: Change the default password immediately after first login!

2. **Configure System Settings** (Admin Only)
   - Navigate to `/admin/settings`
   - Choose registration mode:
     - **Open**: Anyone can register
     - **Approval**: New users need admin approval
     - **Closed**: Registration disabled
   - Set site name and user limits

3. **Create User Account** (or approve registrations)
   - If registration is open, users can register at `/register`
   - If approval mode, admin can approve users at `/admin/users`

4. **Add Your First Subscription**
   - Click "Add Subscription" on the dashboard
   - Fill in the subscription details:
     - Name (e.g., "Netflix")
     - Amount and currency
     - Billing cycle (monthly, quarterly, etc.)
     - First billing date
     - Category (optional)
     - Reminder settings

5. **View Your Dashboard**
   - See overview of monthly and yearly costs
   - View upcoming renewals
   - Track active subscriptions

### Managing Subscriptions

**Add a Subscription**: Click "Add Subscription" button → Fill form → Save

**Edit a Subscription**: Click subscription card → "Edit" button → Update details → Save

**Delete a Subscription**: Click subscription card → "Delete" button → Confirm

**Search & Filter**: Use the search bar and category filter on the subscriptions page

### Understanding Billing Cycles

- **Monthly**: Renews every month
- **Quarterly**: Renews every 3 months
- **Semi-Annually**: Renews every 6 months
- **Annually**: Renews every year
- **Custom**: Set your own cycle in days

The system automatically calculates the next billing date based on your first billing date and chosen cycle.

## Project Structure

```
SubTrack/
├── app/                      # Next.js app directory
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── page.tsx         # Dashboard home
│   │   └── subscriptions/   # Subscription pages
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   └── subscriptions/  # Subscription endpoints
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── layout/            # Layout components
│   ├── subscription/      # Subscription components
│   └── ui/                # UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── date-utils.ts     # Date calculation utilities
│   ├── prisma.ts         # Prisma client
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema
│   └── schema.prisma
├── store/                # Zustand stores
└── public/               # Static files
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Subscriptions

- `GET /api/subscriptions` - List all subscriptions (with filters)
- `POST /api/subscriptions` - Create a new subscription
- `GET /api/subscriptions/[id]` - Get subscription details
- `PUT /api/subscriptions/[id]` - Update subscription
- `DELETE /api/subscriptions/[id]` - Delete subscription
- `GET /api/subscriptions/stats` - Get statistics
- `GET /api/subscriptions/upcoming` - Get upcoming renewals

## Deployment

### Option 1: Vercel (Recommended)

1. **Push your code to GitHub**

2. **Deploy to Vercel**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

3. **Add Environment Variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

4. **Choose Database**:
   - **Vercel Postgres** (paid, integrated)
   - **Supabase** (free tier available)

### Option 2: Self-Hosted

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions on self-hosting with:
- Ubuntu server
- PostgreSQL
- Nginx
- PM2

## Color Scheme

The application uses a warm, friendly color palette:

- **Background**: `#fffffe`
- **Headline**: `#33272a`
- **Sub-headline**: `#594a4e`
- **Card Background**: `#faeee7`
- **Highlight**: `#ff8ba7` (Pink)
- **Secondary**: `#ffc6c7` (Light Pink)
- **Tertiary**: `#c3f0ca` (Green)

## Database Schema

### Users Table
- **Core**: id, email (unique), password (hashed), name, defaultCurrency
- **Admin System**: role (user/admin), status (pending/active/suspended)
- **Approval**: approvedBy, approvedAt
- **Security**: mustChangePassword, lastLoginAt
- **Timestamps**: createdAt, updatedAt

### Subscriptions Table
- **Core**: id, userId (FK), name, amount, currency
- **Billing**: billingCycle, customCycleDays, firstBillingDate, nextBillingDate
- **Details**: category, websiteUrl, logoUrl, notes
- **Reminder**: remindDaysBefore, isActive
- **Timestamps**: createdAt, updatedAt

### System Settings Table
- **Config**: registrationMode (open/approval/closed), siteName, maxUsersLimit
- **Timestamps**: createdAt, updatedAt

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## Roadmap

Future features planned:
- [ ] Email notifications for renewals
- [ ] Data export (CSV/PDF)
- [ ] Data import from CSV
- [ ] Calendar view
- [ ] Spending trends and analytics
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Shared subscriptions for families

---

Built with ❤️ using Next.js, TypeScript, and PostgreSQL
