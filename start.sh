#!/bin/bash

# ROQ UI Interface Startup Script

echo "🚀 Starting ROQ UI Interface Server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists, if not copy from config.env
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env from config.env..."
    cp config.env .env
    echo "✅ Please edit .env file to configure your device type (2GE8FE, 4GE12FE, 4GE20FE)"
fi

# Start the server
echo "🌐 Starting server..."
echo "📱 Device type: $(grep DEVICE_TYPE .env | cut -d '=' -f2)"
echo "🔗 Access the interface at: http://localhost:$(grep PORT .env | cut -d '=' -f2)/common/main.html"
echo ""

npm start
