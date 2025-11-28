# 🚀 GitHub Container Registry 部署指南

## 📋 概述

使用 GitHub Actions 自动构建 Docker 镜像并发布到 GitHub Container Registry (GHCR)。

### 优势
- ✅ 完全自动化 - 代码推送即构建
- ✅ 免费使用 - 公开和私有仓库都免费
- ✅ 快速部署 - 服务器只需拉取镜像
- ✅ 版本管理 - 支持多种标签策略
- ✅ 多平台支持 - amd64 和 arm64

---

## 🔧 配置步骤

### 第 1 步：配置 GitHub Actions

**已完成！** 工作流文件已创建：`.github/workflows/docker-publish.yml`

**触发条件：**
- 推送到 `main` 分支 → 构建并发布 `latest` 标签
- 推送版本标签 (如 `v1.0.0`) → 构建并发布版本标签
- Pull Request → 仅构建测试，不发布

---

### 第 2 步：推送代码触发首次构建

```bash
# 提交 GitHub Actions 配置
git add .github/workflows/docker-publish.yml
git add docker-compose.prod.yml
git commit -m "Add GitHub Actions Docker build workflow"
git push origin main
```

**查看构建状态：**
访问：https://github.com/你的用户名/SubTrack/actions

**预期结果：**
```
✅ Checkout repository
✅ Set up Docker Buildx
✅ Log in to GitHub Container Registry
✅ Extract Docker metadata
✅ Build and push Docker image
   - ghcr.io/你的用户名/subtrack:latest
   - ghcr.io/你的用户名/subtrack:main
```

---

### 第 3 步：设置镜像访问权限

#### 如果是公开镜像（推荐）

1. 访问：https://github.com/你的用户名/SubTrack/pkgs/container/subtrack
2. 点击 **Package settings**
3. 滚动到 **Danger Zone**
4. 点击 **Change visibility** → 选择 **Public**
5. 确认更改

**好处：** 服务器拉取镜像不需要认证。

#### 如果是私有镜像

服务器需要认证才能拉取。

---

### 第 4 步：服务器部署

#### A. 使用公开镜像（无需认证）

```bash
# 1. 进入项目目录
cd ~/SubTrack

# 2. 设置 GitHub 用户名（使用项目作者的用户名）
export GITHUB_USERNAME=davaded

# 3. 使用生产配置文件部署
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

**📌 说明：**
- 这里使用 `GITHUB_USERNAME=davaded` 是因为预构建镜像发布在作者的 GitHub Container Registry
- 所有用户都从 `ghcr.io/davaded/subtrack:latest` 拉取相同的公开镜像
- 如果你 fork 了项目并自己配置了 GitHub Actions，请使用你自己的用户名

#### B. 使用私有镜像（需要认证）

**1. 创建 Personal Access Token (PAT)**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. 勾选权限：
   - ✅ `read:packages` - 拉取镜像
   - ✅ `write:packages` - 推送镜像（可选）
5. 生成并保存 token

**2. 服务器登录 GHCR**

```bash
# 方式 1：交互式登录
docker login ghcr.io
Username: your-github-username
Password: ghp_xxxxxxxxxxxxxxxxxxxx  # 你的 PAT

# 方式 2：命令行登录
echo ghp_xxxxxxxxxxxxxxxxxxxx | docker login ghcr.io -u your-github-username --password-stdin
```

**3. 拉取并运行**

```bash
export GITHUB_USERNAME=your-github-username
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔄 日常开发流程

### 开发新功能

```bash
# 1. 本地开发和测试
git checkout -b feature/new-feature
# ... 开发代码 ...

# 2. 提交并推送
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. 创建 Pull Request
# → GitHub Actions 会自动构建测试（不发布）

# 4. 合并到 main
# → 自动构建并发布 latest 镜像
```

### 部署到服务器

```bash
# 服务器上执行
cd ~/SubTrack
export GITHUB_USERNAME=your-github-username

# 拉取最新镜像
docker-compose -f docker-compose.prod.yml pull

# 重启服务
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f web
```

---

## 🏷️ 版本标签管理

### 发布版本

```bash
# 1. 打版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 2. GitHub Actions 自动构建并发布
# 会生成以下标签：
#   - ghcr.io/username/subtrack:latest
#   - ghcr.io/username/subtrack:v1.0.0
#   - ghcr.io/username/subtrack:1.0
#   - ghcr.io/username/subtrack:1
```

### 服务器使用特定版本

```bash
# 修改 docker-compose.prod.yml
services:
  web:
    image: ghcr.io/your-username/subtrack:v1.0.0  # 固定版本
```

---

## 📊 完整部署流程图

```
本地开发
  ↓
git push origin main
  ↓
GitHub Actions 触发
  ↓
构建 Docker 镜像
  ↓
推送到 GHCR
  ↓
服务器拉取镜像
  ↓
docker-compose up -d
  ↓
应用运行 ✅
```

---

## 🔍 监控和管理

### 查看已发布的镜像

访问：https://github.com/你的用户名?tab=packages

或者命令行：

```bash
# 使用 GitHub CLI
gh api /user/packages/container/subtrack/versions

# 使用 Docker
docker search ghcr.io/your-username/subtrack
```

### 删除旧镜像

1. 访问：https://github.com/你的用户名/SubTrack/pkgs/container/subtrack
2. 点击要删除的版本
3. Settings → Delete package version

---

## 🚀 一键部署脚本

创建 `server-deploy.sh`：

```bash
#!/bin/bash
set -e

GITHUB_USERNAME="your-github-username"  # 修改这里
PROJECT_DIR="$HOME/SubTrack"

echo "🚀 Deploying SubTrack from GitHub Container Registry..."

cd "$PROJECT_DIR"

# 拉取最新镜像
echo "📦 Pulling latest image..."
GITHUB_USERNAME=$GITHUB_USERNAME docker-compose -f docker-compose.prod.yml pull

# 停止旧容器
echo "🛑 Stopping old containers..."
docker-compose -f docker-compose.prod.yml down

# 启动新容器
echo "▶️  Starting new containers..."
GITHUB_USERNAME=$GITHUB_USERNAME docker-compose -f docker-compose.prod.yml up -d

# 等待服务启动
echo "⏳ Waiting for services..."
sleep 10

# 检查状态
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

# 查看日志
echo "📋 Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20 web

echo "✅ Deployment complete!"
echo "🌐 Application: http://$(curl -s ifconfig.me):3000"
```

使用：

```bash
chmod +x server-deploy.sh
./server-deploy.sh
```

---

## ❓ 常见问题

### Q: 构建失败怎么办？

**A:** 查看 GitHub Actions 日志：

1. 访问：https://github.com/你的用户名/SubTrack/actions
2. 点击失败的工作流
3. 查看详细错误信息

常见问题：
- Dockerfile 语法错误
- 依赖安装失败
- 权限不足

### Q: 服务器拉取镜像失败？

**A:** 检查认证：

```bash
# 检查登录状态
docker info | grep Username

# 重新登录
docker logout ghcr.io
docker login ghcr.io

# 测试拉取
docker pull ghcr.io/your-username/subtrack:latest
```

### Q: 如何回滚到旧版本？

**A:** 使用之前的标签：

```bash
# 修改 docker-compose.prod.yml
image: ghcr.io/your-username/subtrack:v1.0.0  # 旧版本

# 重新部署
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Q: 如何查看镜像构建历史？

**A:**

1. GitHub Actions: https://github.com/你的用户名/SubTrack/actions
2. Package versions: https://github.com/你的用户名/SubTrack/pkgs/container/subtrack

---

## 📈 最佳实践

### 1. 使用版本标签

```bash
# 发布稳定版本
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# 服务器使用固定版本
image: ghcr.io/username/subtrack:v1.0.0
```

### 2. 环境分离

```yaml
# dev
image: ghcr.io/username/subtrack:main

# prod
image: ghcr.io/username/subtrack:latest
# 或
image: ghcr.io/username/subtrack:v1.0.0
```

### 3. 定期清理

- 删除旧的、不用的镜像版本
- 保留最近 5-10 个版本
- 保留所有标记的版本

---

## 🎯 总结

**开发流程：**
```bash
git push origin main
→ GitHub Actions 自动构建
→ 推送到 GHCR
→ 服务器一键部署
```

**服务器部署：**
```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

**简单、快速、自动化！** 🚀

---

需要帮助？查看：
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GHCR 文档](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
