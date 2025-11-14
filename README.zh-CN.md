# SubTrack - 订阅管理系统

一个现代化的 Web 应用，帮助你在一个地方管理和追踪所有订阅服务。

## ✨ 功能特性

### 核心功能
- **用户认证**：基于 JWT 的安全注册和登录
- **订阅管理**：添加、编辑和删除订阅，包含详细信息
- **账单追踪**：基于各种计费周期自动计算下次续费日期
- **续费提醒**：获取即将续费订阅的通知
- **统计仪表板**：查看月度/年度支出和订阅分析
- **分类管理**：按分类组织订阅（娱乐、工作等）
- **多货币支持**：支持人民币、美元、欧元或英镑

### 用户界面
- 清新现代的设计，采用自定义配色方案
- 响应式布局，适配桌面、平板和移动设备
- 侧边栏导航（桌面端）和底部导航（移动端）
- 实时搜索和筛选功能
- 带状态指示器的可视化订阅卡片
- 完整的中文界面

## 🛠 技术栈

### 前端
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI 组件**: 基于 shadcn/ui 的自定义组件
- **状态管理**: Zustand
- **图标**: Lucide React
- **日期处理**: Day.js
- **图表**: Recharts

### 后端
- **运行时**: Node.js 18+
- **API**: Next.js API Routes
- **数据库**: PostgreSQL 14+
- **ORM**: Prisma
- **认证**: JWT + bcrypt
- **验证**: Zod

## 🚀 快速开始

### 环境要求
- Node.js 18 或更高版本
- PostgreSQL 14 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd SubTrack
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**

   创建 `.env` 文件：
   ```env
   # 数据库
   DATABASE_URL="postgresql://user:password@localhost:5432/subscriptions"

   # JWT 密钥（生成一个随机安全字符串）
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # 应用地址
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Node 环境
   NODE_ENV="development"
   ```

4. **设置数据库**

   确保 PostgreSQL 正在运行，然后创建数据库：
   ```bash
   createdb subscriptions
   ```

   运行 Prisma 迁移：
   ```bash
   npx prisma migrate dev
   ```

   生成 Prisma Client：
   ```bash
   npx prisma generate
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

   在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 首次设置

1. **创建账户**
   - 访问 `/register` 页面
   - 输入邮箱、密码和可选的姓名
   - 将自动登录

2. **添加第一个订阅**
   - 在仪表板点击"添加订阅"
   - 填写订阅详情：
     - 名称（如 "Netflix"）
     - 金额和货币
     - 计费周期（每月、每季度等）
     - 首次计费日期
     - 分类（可选）
     - 提醒设置

3. **查看仪表板**
   - 查看月度和年度支出概览
   - 查看即将续费的订阅
   - 追踪活跃订阅

### 管理订阅

**添加订阅**：点击"添加订阅"按钮 → 填写表单 → 保存

**编辑订阅**：点击订阅卡片 → "编辑"按钮 → 更新详情 → 保存

**删除订阅**：点击订阅卡片 → "删除"按钮 → 确认

**搜索与筛选**：在订阅页面使用搜索栏和分类筛选

### 计费周期说明

- **每月**：每月续费
- **每季度**：每 3 个月续费
- **每半年**：每 6 个月续费
- **每年**：每年续费
- **自定义**：自定义天数的续费周期

系统会根据首次计费日期和选择的周期自动计算下次续费日期。

## 📱 响应式设计

- **桌面端**（≥1024px）：侧边栏导航 + 完整功能
- **平板**（768px-1023px）：优化的布局
- **移动端**（<768px）：底部导航栏 + 移动优化界面

## 📊 页面说明

### 首页 (Dashboard)
- 月度/年度支出统计卡片
- 活跃订阅数量
- 即将续费的订阅列表
- 快速添加订阅入口

### 订阅管理
- 所有订阅列表展示
- 搜索和分类筛选
- 订阅详情页
- 添加/编辑订阅表单

### 统计分析
- 支出总览卡片
- 按分类的饼图展示
- 月度/年度对比柱状图
- 分类详情列表和进度条

### 设置
- 个人信息管理
- 密码修改
- 默认货币设置
- 通知偏好（即将推出）

## 🎨 配色方案

应用采用温暖友好的配色：

- **背景色**: `#fffffe` - 主背景
- **标题色**: `#33272a` - 深棕色
- **副标题**: `#594a4e` - 中棕色
- **卡片背景**: `#faeee7` - 淡粉色
- **高亮色**: `#ff8ba7` - 粉红色
- **次要色**: `#ffc6c7` - 淡粉色
- **第三色**: `#c3f0ca` - 绿色

## 📁 项目结构

```
SubTrack/
├── app/                      # Next.js 应用目录
│   ├── (dashboard)/         # 受保护的仪表板路由
│   │   ├── page.tsx         # 首页仪表板
│   │   ├── subscriptions/   # 订阅页面
│   │   ├── statistics/      # 统计页面
│   │   └── settings/        # 设置页面
│   ├── api/                 # API 路由
│   │   ├── auth/           # 认证端点
│   │   └── subscriptions/  # 订阅端点
│   ├── login/              # 登录页面
│   ├── register/           # 注册页面
│   ├── globals.css         # 全局样式
│   └── layout.tsx          # 根布局
├── components/             # React 组件
│   ├── layout/            # 布局组件
│   ├── subscription/      # 订阅组件
│   └── ui/                # UI 组件
├── hooks/                 # 自定义 React Hooks
├── lib/                   # 工具库
│   ├── auth.ts           # 认证工具
│   ├── date-utils.ts     # 日期计算工具
│   ├── prisma.ts         # Prisma 客户端
│   └── validations.ts    # Zod 验证模式
├── prisma/               # 数据库模式
│   └── schema.prisma
├── store/                # Zustand 状态存储
└── public/               # 静态文件
```

## 🔌 API 文档

### 认证 API

- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户

### 订阅 API

- `GET /api/subscriptions` - 列出所有订阅（支持筛选）
- `POST /api/subscriptions` - 创建新订阅
- `GET /api/subscriptions/[id]` - 获取订阅详情
- `PUT /api/subscriptions/[id]` - 更新订阅
- `DELETE /api/subscriptions/[id]` - 删除订阅
- `GET /api/subscriptions/stats` - 获取统计数据
- `GET /api/subscriptions/upcoming` - 获取即将续费的订阅

## 🚀 部署

### 方式 1：Vercel 部署（推荐）

1. **推送代码到 GitHub**

2. **部署到 Vercel**

   [![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new)

3. **在 Vercel 面板添加环境变量**：
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

4. **选择数据库**：
   - **Vercel Postgres**（付费，集成方便）
   - **Supabase**（有免费额度）

### 方式 2：自托管

使用 Ubuntu 服务器 + PostgreSQL + Nginx + PM2 进行自托管。

详细步骤请参考主 README.md 中的部署指南。

## 🗄️ 数据库模式

### Users 表
- id, email (唯一), password (加密), name, defaultCurrency
- 时间戳: createdAt, updatedAt

### Subscriptions 表
- id, userId (外键), name, amount, currency
- billingCycle, customCycleDays, firstBillingDate, nextBillingDate
- category, websiteUrl, logoUrl, notes
- remindDaysBefore, isActive
- 时间戳: createdAt, updatedAt

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

MIT 许可证 - 可自由用于个人或商业用途。

## 💡 路线图

计划中的未来功能：
- [ ] 续费邮件通知
- [ ] 数据导出（CSV/PDF）
- [ ] 从 CSV 导入数据
- [ ] 日历视图
- [ ] 支出趋势和分析
- [ ] 多语言支持
- [ ] 移动应用（React Native）
- [ ] 家庭共享订阅

## 🆘 支持

如果遇到问题或有疑问：
1. 查看文档
2. 搜索现有 issues
3. 创建新 issue 并提供详细信息

---

使用 ❤️ 和 Next.js、TypeScript、PostgreSQL 构建
