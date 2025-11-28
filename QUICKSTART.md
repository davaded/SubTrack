# 🚀 SubTrack 快速部署指南（新手向）

> 从零开始，10分钟部署你的订阅管理系统

---

## 📋 你需要什么

### 必需条件
- ✅ 一台服务器（云服务器或本地服务器）
  - 推荐：阿里云、腾讯云、AWS、DigitalOcean 等
  - 最低配置：1核 1GB RAM
  - 系统：Ubuntu 20.04+ 或 CentOS 7+
- ✅ SSH 连接工具（Windows 用 PuTTY/Xshell，Mac/Linux 用终端）
- ✅ 10-15 分钟时间

### 可选条件
- 域名（如果没有也可以用 IP 地址访问）
- 邮箱服务（用于提醒功能）

---

## 🎯 部署流程概览

```
第一步：连接服务器
  ↓
第二步：安装 Docker
  ↓
第三步：下载项目
  ↓
第四步：配置参数
  ↓
第五步：启动服务
  ↓
第六步：访问应用
  ↓
完成！🎉
```

---

## 第一步：连接到你的服务器

### Windows 用户

**使用 PuTTY 或 Xshell：**
1. 打开软件
2. 输入服务器 IP 地址
3. 端口填 `22`
4. 点击连接
5. 输入用户名（通常是 `root`）
6. 输入密码

### Mac/Linux 用户

打开终端，执行：
```bash
ssh root@your-server-ip
# 输入密码
```

**连接成功后，你会看到命令行提示符，例如：**
```bash
root@server:~#
```

---

## 第二步：安装 Docker

### 方法 1：一键安装脚本（推荐）

**复制以下命令，粘贴到服务器终端，按回车：**

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 验证安装

```bash
docker --version
docker-compose --version
```

**应该看到类似输出：**
```
Docker version 24.0.7, build afdd53b
Docker Compose version v2.23.0
```

✅ **看到版本号就说明安装成功了！**

---

## 第三步：下载项目

```bash
# 1. 确保在 root 用户的主目录
cd ~

# 2. 下载项目
git clone https://github.com/davaded/SubTrack.git

# 3. 进入项目目录
cd SubTrack

# 4. 确认文件已下载
ls -la
```

**应该看到项目文件，包括：**
- `docker-compose.prod.yml` ✅
- `.env.example` ✅
- `README.md` ✅
- 等等

---

## 第四步：配置环境变量

### 4.1 复制配置模板

```bash
cp .env.example .env
```

### 4.2 生成安全密钥

```bash
# 生成数据库密码
echo "POSTGRES_PASSWORD=$(openssl rand -base64 16)"

# 生成 JWT 密钥
echo "JWT_SECRET=$(openssl rand -base64 32)"
```

**记下这两个生成的值！**

### 4.3 编辑配置文件

```bash
nano .env
```

**必须修改以下内容：**

```bash
# 数据库密码（粘贴刚才生成的）
POSTGRES_PASSWORD="刚才生成的数据库密码"

# JWT 密钥（粘贴刚才生成的）
JWT_SECRET="刚才生成的JWT密钥"

# 默认管理员账号（首次登录用，之后要改密码）
DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASSWORD="admin123456"
DEFAULT_ADMIN_NAME="System Administrator"
```

**可选配置（只在需要邮件/通知提醒时配置）：**

```bash
# 应用访问地址（用于邮件和通知消息中的链接）
# 如果不使用邮件/钉钉/飞书通知，不需要配置这一项
# NEXT_PUBLIC_APP_URL="http://你的服务器IP:3000"

# 邮件通知（可选）
# RESEND_API_KEY="re_xxxxxxxxxxxx"
# EMAIL_FROM="SubTrack <noreply@yourdomain.com>"

# 钉钉通知（可选）
# DINGTALK_WEBHOOK="https://oapi.dingtalk.com/robot/send?access_token=xxx"
# DINGTALK_SECRET="SECxxxxxxxxx"

# 飞书通知（可选）
# FEISHU_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
# FEISHU_SECRET="xxxxxxxxx"
```

**保存文件：**
- 按 `Ctrl + X`
- 按 `Y`（Yes）
- 按 `Enter`（确认）

**最小配置示例（不使用通知功能）：**
```bash
POSTGRES_PASSWORD="Xk9mP3vN2QwR5tY8"
JWT_SECRET="a7B9c2D4e6F8h1J3k5L7m9N0p2Q4r6S8t0U2v4W6x8Y0z2A4"
DEFAULT_ADMIN_EMAIL="admin@mycompany.com"
DEFAULT_ADMIN_PASSWORD="MySecurePass123"
DEFAULT_ADMIN_NAME="Admin"
```

**完整配置示例（使用邮件通知）：**
```bash
POSTGRES_PASSWORD="Xk9mP3vN2QwR5tY8"
JWT_SECRET="a7B9c2D4e6F8h1J3k5L7m9N0p2Q4r6S8t0U2v4W6x8Y0z2A4"
DEFAULT_ADMIN_EMAIL="admin@mycompany.com"
DEFAULT_ADMIN_PASSWORD="MySecurePass123"
DEFAULT_ADMIN_NAME="Admin"

# 通知功能（可选）
NEXT_PUBLIC_APP_URL="http://123.45.67.89:3000"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="SubTrack <noreply@mycompany.com>"
```

---

## 第五步：启动服务

### 💡 两种部署方式

你可以选择以下两种方式之一：

#### 方式 A：使用预构建镜像（推荐）⭐

**优点：** 快速、简单，1-2 分钟完成
**缺点：** 依赖项目作者的镜像仓库

```bash
# 拉取预构建的 Docker 镜像并启动
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

**注：** 使用的是公开镜像 `ghcr.io/davaded/subtrack:latest`，所有用户都从这个地址拉取。

#### 方式 B：本地构建镜像

**优点：** 完全自主，不依赖他人
**缺点：** 需要 5-10 分钟构建时间

```bash
# 使用本地构建配置文件
docker-compose up -d --build
```

**启动需要 1-2 分钟（方式A）或 5-10 分钟（方式B），请耐心等待...**

### 5.3 查看启动状态

```bash
# 查看容器状态
docker-compose -f docker-compose.prod.yml ps
```

**正常运行应该看到：**
```
NAME                  STATUS
subtrack-web         Up 30 seconds
subtrack-db          Up 30 seconds
```

✅ **看到 "Up" 就说明启动成功了！**

### 5.4 查看应用日志（可选）

```bash
# 查看实时日志
docker-compose -f docker-compose.prod.yml logs -f web

# 按 Ctrl + C 停止查看日志
```

**看到类似输出说明启动成功：**
```
✅ Migrations complete!
🚀 Starting application...
Server running on http://0.0.0.0:3000
```

---

## 第六步：访问你的应用

### 6.1 打开浏览器

在浏览器中输入：
```
http://你的服务器IP:3000
```

**例如：** `http://123.45.67.89:3000`

### 6.2 首次登录

1. 点击右上角 **"登录"**
2. 输入你在 `.env` 中设置的管理员账号：
   - 邮箱：`admin@example.com`（或你自定义的）
   - 密码：`admin123456`（或你自定义的）
3. 点击 **"登录"**

### 6.3 修改管理员密码（重要！）

登录后立即修改密码：
1. 点击右上角头像
2. 选择 **"个人设置"** 或 **"修改密码"**
3. 输入新密码并保存

### 6.4 配置系统设置

1. 访问：`http://你的服务器IP:3000/admin/settings`
2. 选择注册模式：
   - **开放注册** - 任何人都可以注册
   - **需要审批** - 新用户需要你批准
   - **关闭注册** - 只有管理员可以创建用户
3. 保存设置

---

## 🎉 完成！开始使用

现在你可以：

1. **添加订阅**
   - 点击 "添加订阅"
   - 填写订阅信息（名称、金额、续费周期等）
   - 保存

2. **查看统计**
   - 仪表板显示月度/年度支出
   - 即将续费的订阅提醒

3. **管理用户**（管理员）
   - 访问 `/admin/users`
   - 批准/拒绝/禁用用户

---

## 🔧 常见问题

### Q: 无法访问 3000 端口？

**A: 开放防火墙端口**

```bash
# Ubuntu/Debian
sudo ufw allow 3000
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

**还要检查云服务商的安全组规则，确保 3000 端口对外开放。**

### Q: 容器启动失败？

**A: 查看错误日志**

```bash
docker-compose -f docker-compose.prod.yml logs
```

常见原因：
- 端口被占用 → 修改端口或停止占用端口的程序
- 内存不足 → 升级服务器配置
- 镜像拉取失败 → 检查网络连接

### Q: 忘记管理员密码？

**A: 重置数据库**

```bash
# 停止服务
docker-compose -f docker-compose.prod.yml down

# 删除数据库数据（会清空所有数据！）
docker volume rm subtrack_postgres_data

# 重新启动（会创建新的管理员账号）
docker-compose -f docker-compose.prod.yml up -d
```

### Q: 如何更新到新版本？

```bash
cd ~/SubTrack
git pull origin main
export GITHUB_USERNAME=davaded
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Q: 如何备份数据？

```bash
# 导出数据库
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres subtrack > backup.sql

# 下载到本地（在本地电脑执行）
scp root@your-server-ip:~/SubTrack/backup.sql ./
```

---

## 📚 进阶配置

### 配置域名和 SSL

如果你有域名，可以配置 Nginx 和 SSL 证书：

1. **安装 Nginx**
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

2. **创建 Nginx 配置**
```bash
sudo nano /etc/nginx/sites-available/subtrack
```

粘贴以下内容（修改域名）：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **启用配置**
```bash
sudo ln -s /etc/nginx/sites-available/subtrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **获取 SSL 证书**
```bash
sudo certbot --nginx -d your-domain.com
```

### 配置邮件提醒

编辑 `.env` 文件，添加 Resend API 密钥：
```bash
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="SubTrack <noreply@yourdomain.com>"
```

重启服务：
```bash
docker-compose -f docker-compose.prod.yml restart
```

---

## 🆘 需要帮助？

- **详细文档**：[GITHUB_DEPLOY.md](./GITHUB_DEPLOY.md)
- **管理员指南**：[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- **问题反馈**：https://github.com/davaded/SubTrack/issues

---

## ✅ 部署检查清单

完成以下步骤，确保部署成功：

- [ ] SSH 连接到服务器
- [ ] 安装 Docker 和 Docker Compose
- [ ] 下载 SubTrack 项目
- [ ] 配置 `.env` 文件
- [ ] 生成安全密钥
- [ ] 启动服务（docker-compose up -d）
- [ ] 开放防火墙端口（3000）
- [ ] 浏览器访问应用
- [ ] 管理员账号登录
- [ ] 修改默认密码
- [ ] 配置系统设置
- [ ] 添加第一个订阅测试

---

**恭喜！你已成功部署 SubTrack 🎉**

现在开始管理你的订阅服务吧！
