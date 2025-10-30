#!/bin/bash

echo "🚀 CrisisVision Backend - Quick Start"
echo "======================================"
echo ""

if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your NVIDIA_API_KEY"
    echo "   Get your key from: https://build.nvidia.com/"
    echo ""
    read -p "Press Enter after you've added your API key to .env..."
fi

source .env

if [ -z "$NVIDIA_API_KEY" ] || [ "$NVIDIA_API_KEY" = "your_nvidia_api_key_here" ]; then
    echo "❌ NVIDIA_API_KEY not set in .env file"
    echo "   Please edit .env and add your actual API key"
    exit 1
fi

echo "✅ Environment configured"
echo ""

echo "🐳 Building Docker containers..."
docker-compose build

echo ""
echo "🚀 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🔍 Checking service health..."

services=("orchestrator:8000" "weather:8001" "maps:8002" "news:8003" "social:8004" "resource:8005")

for service in "${services[@]}"; do
    name="${service%:*}"
    port="${service#*:}"
    
    if curl -s -f "http://localhost:$port/health" > /dev/null; then
        echo "✅ $name (port $port) - healthy"
    else
        echo "❌ $name (port $port) - not responding"
    fi
done

echo ""
echo "🎉 CrisisVision Backend is ready!"
echo ""
echo "📚 Available endpoints:"
echo "   - Orchestrator API: http://localhost:8000"
echo "   - API Documentation: http://localhost:8000/docs"
echo "   - Weather MCP: http://localhost:8001"
echo "   - Maps MCP: http://localhost:8002"
echo "   - News MCP: http://localhost:8003"
echo "   - Social MCP: http://localhost:8004"
echo "   - Resource MCP: http://localhost:8005"
echo ""
echo "🧪 Test the system:"
echo "   curl http://localhost:8000/test -X POST \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"scenario\": \"Fire alarm\", \"location\": \"Library\", \"emergency_type\": \"fire\"}'"
echo ""
echo "📖 See TESTING.md for more test commands"
echo ""
echo "🛑 To stop all services: docker-compose down"
echo "📋 To view logs: docker-compose logs -f"
