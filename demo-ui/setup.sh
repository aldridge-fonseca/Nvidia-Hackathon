#!/bin/bash

# CrisisVision Demo UI - Quick Build Script

echo "🚀 Setting up CrisisVision Demo UI..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the demo-ui directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Build the project
echo "🔨 Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""

echo "🎉 Setup complete! You can now:"
echo ""
echo "  Run in development mode:"
echo "    npm run dev"
echo ""
echo "  Run in production mode:"
echo "    npm start"
echo ""
echo "  Build Docker image:"
echo "    docker build -t crisisvision-demo ."
echo ""
echo "  Run with Docker:"
echo "    docker run -p 3000:3000 crisisvision-demo"
echo ""
echo "Visit http://localhost:3000 to see your demo!"
