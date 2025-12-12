#!/bin/bash

# MULTIVELAS Deployment Script
# This script helps deploy the MULTIVELAS system using Docker

set -e

echo "🚀 MULTIVELAS Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before proceeding${NC}"
        echo ""
        read -p "Press Enter to continue or Ctrl+C to exit and edit .env file..."
    else
        echo -e "${RED}❌ .env.example file not found${NC}"
        exit 1
    fi
fi

# Check backend .env
if [ ! -f multivelas-sistema/.env ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating from template...${NC}"
    if [ -f multivelas-sistema/.env.example ]; then
        cp multivelas-sistema/.env.example multivelas-sistema/.env
        echo -e "${GREEN}✓ Backend .env file created${NC}"
    fi
fi

# Check frontend .env
if [ ! -f multivelas-frontend/.env ]; then
    echo -e "${YELLOW}⚠️  Frontend .env file not found. Creating from template...${NC}"
    if [ -f multivelas-frontend/.env.example ]; then
        cp multivelas-frontend/.env.example multivelas-frontend/.env
        echo -e "${GREEN}✓ Frontend .env file created${NC}"
    fi
fi

echo ""
echo "Select deployment action:"
echo "1) Start services (docker-compose up)"
echo "2) Start services in background (docker-compose up -d)"
echo "3) Stop services (docker-compose down)"
echo "4) Restart services (docker-compose restart)"
echo "5) View logs (docker-compose logs)"
echo "6) Rebuild and start (docker-compose up --build)"
echo "7) Stop and remove volumes (WARNING: deletes data)"
echo "8) Exit"
echo ""

read -p "Enter choice [1-8]: " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 Starting services...${NC}"
        docker-compose up
        ;;
    2)
        echo -e "${GREEN}🚀 Starting services in background...${NC}"
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✓ Services started!${NC}"
        echo ""
        echo "Access the application at:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:4000"
        echo "  MongoDB:  localhost:27017"
        echo ""
        echo "View logs with: docker-compose logs -f"
        ;;
    3)
        echo -e "${YELLOW}⏹️  Stopping services...${NC}"
        docker-compose down
        echo -e "${GREEN}✓ Services stopped${NC}"
        ;;
    4)
        echo -e "${YELLOW}🔄 Restarting services...${NC}"
        docker-compose restart
        echo -e "${GREEN}✓ Services restarted${NC}"
        ;;
    5)
        echo -e "${GREEN}📋 Viewing logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    6)
        echo -e "${GREEN}🔨 Rebuilding and starting services...${NC}"
        docker-compose up --build
        ;;
    7)
        echo -e "${RED}⚠️  WARNING: This will delete all data!${NC}"
        read -p "Are you sure? Type 'yes' to confirm: " confirm
        if [ "$confirm" = "yes" ]; then
            docker-compose down -v
            echo -e "${GREEN}✓ Services stopped and volumes removed${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    8)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac
