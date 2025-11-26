#!/bin/bash
# Build and push Docker image to registry

set -e

# Configuration
IMAGE_NAME="subtrack"
REGISTRY="docker.io"  # Change to your registry (docker.io, ghcr.io, etc.)
USERNAME="your-username"  # Change this
VERSION="latest"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 SubTrack Docker Build and Push${NC}"
echo ""

# Check if logged in to registry
echo -e "${YELLOW}📋 Checking Docker registry login...${NC}"
if ! docker info | grep -q "Username"; then
    echo -e "${RED}❌ Not logged in to Docker registry${NC}"
    echo "Please run: docker login ${REGISTRY}"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    echo -e "${YELLOW}📦 Loading environment variables from .env${NC}"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}⚠️  No .env file found, using defaults${NC}"
fi

# Build image
echo -e "${YELLOW}🏗️  Building Docker image...${NC}"
docker build \
    --build-arg DATABASE_URL="${DATABASE_URL:-postgresql://placeholder:placeholder@localhost:5432/placeholder}" \
    --build-arg JWT_SECRET="${JWT_SECRET:-build-secret}" \
    --build-arg NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}" \
    -t ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION} \
    -t ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S) \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Push image
echo ""
echo -e "${YELLOW}📤 Pushing image to registry...${NC}"
docker push ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}
docker push ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push successful!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Image published:${NC}"
    echo "   ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"
    echo ""
    echo -e "${YELLOW}📋 To use this image on your server:${NC}"
    echo "   docker pull ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"
    echo "   docker run -d -p 3000:3000 ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"
else
    echo -e "${RED}❌ Push failed${NC}"
    exit 1
fi
