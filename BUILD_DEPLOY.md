# 🏗️ SubTrack 构建与部署指南

## 📋 目录

- [方案 1：服务器直接构建](#方案-1服务器直接构建)
- [方案 2：本地构建并推送镜像](#方案-2本地构建并推送镜像)
- [方案 3：GitHub Actions 自动化](#方案-3github-actions-自动化)

---

## 方案 1：服务器直接构建

### 特点
- ✅ 简单直接，适合小型项目
- ✅ 不需要额外的 Docker Registry
- ❌ 服务器需要足够的资源（CPU/内存）
- ❌ 构建时间较长（5-10分钟）

### 步骤

#### 1. 使用默认构建（占位符）

```bash
# 直接使用 docker-compose（最简单）
cd ~/SubTrack
git pull origin main
docker-compose down
docker-compose up -d --build
```

**说明：** 构建时使用占位符 DATABASE_URL，运行时使用真实配置。

#### 2. 使用自定义构建参数

```bash
# 使用自定义配置文件构建
docker-compose -f docker-compose.build.yml up -d --build
```

**优点：** 构建时使用真实的环境变量。

---

## 方案 2：本地构建并推送镜像

### 特点
- ✅ 服务器部署快速（只需拉取镜像）
- ✅ 本地构建，不占用服务器资源
- ✅ 可以预先测试镜像
- ❌ 需要 Docker Registry（Docker Hub/GitHub Container Registry）
- ❌ 需要配置认证

### 步骤

#### A. 使用 Docker Hub

**1. 注册 Docker Hub 账号**
- 访问：https://hub.docker.com/
- 注册并创建仓库：`username/subtrack`

**2. 本地登录**

```bash
docker login
# 输入用户名和密码
```

**3. 修改构建脚本**

编辑 `scripts/build-and-push.sh`：

```bash
USERNAME="your-dockerhub-username"  # 改成你的用户名
```

**4. 构建并推送**

```bash
# 给脚本执行权限
chmod +x scripts/build-and-push.sh

# 执行构建和推送
./scripts/build-and-push.sh
```

**5. 服务器上拉取并运行**

```bash
# 修改 docker-compose.yml，使用远程镜像
version: '3.8'

services:
  web:
    image: your-username/subtrack:latest  # 使用远程镜像
    # 移除 build 部分
    container_name: subtrack-web
    # ... 其他配置不变
```

```bash
# 拉取并启动
docker-compose pull
docker-compose up -d
```

#### B. 使用 GitHub Container Registry (推荐)

**优点：** 与 GitHub 集成，私有镜像免费。

**1. 创建 Personal Access Token**

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. 勾选 `write:packages` 和 `read:packages`
4. 生成并保存 token

**2. 本地登录 GHCR**

```bash
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

**3. 构建并推送**

```bash
# 设置变量
export GITHUB_USERNAME="your-github-username"
export IMAGE_NAME="subtrack"
export VERSION="latest"

# 构建
docker build -t ghcr.io/${GITHUB_USERNAME}/${IMAGE_NAME}:${VERSION} .

# 推送
docker push ghcr.io/${GITHUB_USERNAME}/${IMAGE_NAME}:${VERSION}
```

**4. 服务器上配置**

```bash
# 登录 GHCR
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 修改 docker-compose.yml
services:
  web:
    image: ghcr.io/your-github-username/subtrack:latest
```

```bash
# 拉取并启动
docker-compose pull
docker-compose up -d
```

---

## 方案 3：GitHub Actions 自动化

### 特点
- ✅ 全自动化，代码推送即构建
- ✅ 自动推送到 GitHub Container Registry
- ✅ 支持多环境部署
- ✅ 构建缓存，速度快
- ❌ 需要配置 GitHub Actions

### 步骤

**1. 创建 GitHub Actions 工作流**

创建 `.github/workflows/docker-build.yml`：

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
```

**2. 推送代码触发构建**

```bash
git add .github/workflows/docker-build.yml
git commit -m "Add Docker build workflow"
git push origin main
```

**3. 查看构建状态**

访问：https://github.com/your-username/SubTrack/actions

**4. 服务器使用镜像**

```bash
# 登录 GHCR
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# docker-compose.yml
services:
  web:
    image: ghcr.io/your-username/subtrack:latest

# 部署
docker-compose pull
docker-compose up -d
```

---

## 📊 方案对比总结

| 特性 | 方案1: 服务器构建 | 方案2: 预构建镜像 | 方案3: CI/CD |
|------|-----------------|-----------------|--------------|
| **部署速度** | 慢 (5-10分钟) | 快 (1-2分钟) | 快 (1-2分钟) |
| **服务器资源** | 高 | 低 | 低 |
| **配置复杂度** | 低 | 中 | 高 |
| **适合场景** | 小项目 | 中大项目 | 团队协作 |
| **成本** | 免费 | Registry费用 | 免费(GitHub) |

---

## 🎯 推荐选择

### 个人项目
→ **方案 1**（服务器直接构建）

### 小团队
→ **方案 2**（Docker Hub 或 GHCR）

### 企业/团队
→ **方案 3**（GitHub Actions + GHCR）

---

## 💡 快速开始

### 最简单方式（推荐新手）

```bash
cd ~/SubTrack
git pull origin main
docker-compose down
docker-compose up -d --build
```

### 本地预构建（推荐测试后再部署）

```bash
# 本地构建
./scripts/local-build.sh

# 测试
docker run -d -p 3000:3000 --env-file .env subtrack:local

# 推送到 GitHub Container Registry
docker tag subtrack:local ghcr.io/your-username/subtrack:latest
docker push ghcr.io/your-username/subtrack:latest

# 服务器拉取
docker pull ghcr.io/your-username/subtrack:latest
docker-compose up -d
```

---

## 🔧 故障排查

### 构建失败

```bash
# 查看详细日志
docker-compose build --no-cache --progress=plain

# 清理缓存重试
docker system prune -a
docker-compose build --no-cache
```

### 镜像推送失败

```bash
# 检查登录状态
docker info | grep Username

# 重新登录
docker logout
docker login ghcr.io
```

### 服务器拉取失败

```bash
# 检查认证
cat ~/.docker/config.json

# 手动拉取测试
docker pull ghcr.io/your-username/subtrack:latest
```

---

有问题？查看主文档：[README.md](./README.md) | [DEPLOY.md](./DEPLOY.md)
