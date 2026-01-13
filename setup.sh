#!/bin/bash

# PriceConverter Quick Start Script

echo "🚀 PriceConverter - Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build check
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Check the errors above."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Setup environment
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cp .env.example .env.local
    echo "✅ Created .env.local (update with your API keys if needed)"
else
    echo "⚠️  .env.local already exists (keeping current configuration)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. npm run dev    - Start development server (http://localhost:3000)"
echo "2. npm run build  - Production build"
echo "3. npm start      - Start production server"
echo ""
echo "📖 For more info, see README.md"
echo "🧪 For testing guide, see TESTING.md"
