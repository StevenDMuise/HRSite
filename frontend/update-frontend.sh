#!/bin/bash

# Function to check if a port is in use
check_port() {
    lsof -i:$1 >/dev/null 2>&1
    return $?
}

# Function to kill process on a specific port
kill_port() {
    echo "Stopping process on port $1..."
    lsof -ti:$1 | xargs kill -9 2>/dev/null || echo "No process running on port $1"
}

echo "🔄 Starting frontend update process..."

# Stop existing processes
echo "📥 Stopping existing processes..."
kill_port 8080

# Install dependencies and build
echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building frontend..."
npm run build

# Start development server
echo "🚀 Starting frontend..."
npm run dev

echo "✅ Frontend running on http://localhost:8080"
