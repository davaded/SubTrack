#!/bin/bash
# Local build script with custom build arguments

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🏗️  Building SubTrack Docker Image Locally${NC}"
echo ""

# Load .env if exists
if [ -f .env ]; then
    echo -e "${YELLOW}📦 Loading .env file...${NC}"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Build with build arguments
echo -e "${YELLOW}🔨 Building image...${NC}"
docker build \
    --build-arg DATABASE_URL="${DATABASE_URL:-postgresql://placeholder:placeholder@localhost:5432/placeholder}" \
    --build-arg JWT_SECRET="${JWT_SECRET:-build-secret}" \
    --build-arg NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}" \
    -t subtrack:local \
    .

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Image built: subtrack:local${NC}"
    echo ""
    echo "To run:"
    echo "  docker-compose up -d"
    echo ""
    echo "Or manually:"
    echo "  docker run -d -p 3000:3000 --env-file .env subtrack:local"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
