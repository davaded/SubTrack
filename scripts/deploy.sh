#!/bin/bash
# SubTrack 自动部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始部署 SubTrack..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 拉取最新代码
echo -e "${YELLOW}📥 拉取最新代码...${NC}"
git pull origin $(git branch --show-current)

# 2. 停止现有容器
echo -e "${YELLOW}🛑 停止现有容器...${NC}"
docker-compose down

# 3. 构建新镜像
echo -e "${YELLOW}🏗️  构建新镜像...${NC}"
docker-compose build --no-cache

# 4. 启动服务（包含自动迁移）
echo -e "${YELLOW}▶️  启动服务...${NC}"
docker-compose up -d

# 5. 等待服务就绪
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 5

# 6. 检查服务状态
echo -e "${YELLOW}🔍 检查服务状态...${NC}"
docker-compose ps

# 7. 查看最近日志
echo -e "${YELLOW}📋 最近日志：${NC}"
docker-compose logs --tail=20 web

# 8. 健康检查
echo -e "${YELLOW}🏥 执行健康检查...${NC}"
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 部署成功！应用运行正常${NC}"
    echo -e "${GREEN}🌐 访问地址: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ 健康检查失败，请查看日志${NC}"
    docker-compose logs web
    exit 1
fi

echo -e "${GREEN}🎉 部署完成！${NC}"
