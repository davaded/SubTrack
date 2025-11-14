# SubTrack - Subscription Management System

A modern web application to help you manage and track all your subscription services in one place.

## Features

### Core Features
- **User Authentication**: Secure registration and login with JWT-based authentication
- **Subscription Management**: Add, edit, and delete subscriptions with detailed information
- **Billing Tracking**: Automatic calculation of next billing dates based on various cycles
- **Renewal Reminders**: Get notified about upcoming subscription renewals
- **Statistics Dashboard**: View monthly/yearly spending and subscription analytics
- **Category Organization**: Organize subscriptions by categories (Entertainment, Productivity, etc.)
- **Multi-Currency Support**: Track subscriptions in CNY, USD, EUR, or GBP

### User Interface
- Clean and modern design with custom color scheme
- Responsive layout for desktop, tablet, and mobile devices
- Intuitive navigation with sidebar menu
- Real-time search and filtering
- Visual subscription cards with status indicators

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components based on shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: Day.js

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SubTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/subscriptions"

   # JWT Secret (generate a random secure string)
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Node Environment
   NODE_ENV="development"
   ```

4. **Set up the database**

   Make sure PostgreSQL is running, then create the database:
   ```bash
   createdb subscriptions
   ```

   Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

   Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First-Time Setup

1. **Create an Account**
   - Navigate to `/register`
   - Enter your email, password, and optional name
   - You'll be automatically logged in

2. **Add Your First Subscription**
   - Click "Add Subscription" on the dashboard
   - Fill in the subscription details:
     - Name (e.g., "Netflix")
     - Amount and currency
     - Billing cycle (monthly, quarterly, etc.)
     - First billing date
     - Category (optional)
     - Reminder settings

3. **View Your Dashboard**
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
- id, email (unique), password (hashed), name, defaultCurrency
- Timestamps: createdAt, updatedAt

### Subscriptions Table
- id, userId (FK), name, amount, currency
- billingCycle, customCycleDays, firstBillingDate, nextBillingDate
- category, websiteUrl, logoUrl, notes
- remindDaysBefore, isActive
- Timestamps: createdAt, updatedAt

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
