#!/bin/bash

# Exit on any error
set -e

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop first."
        echo "   On macOS, run: open -a Docker"
        exit 1
    fi
}

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

echo "🔄 Starting backend update process..."

# Check if Docker is running first
echo "🐳 Checking Docker service..."
check_docker

# Stop existing processes
echo "📥 Stopping existing processes..."
kill_port 3000
kill_port 3001

# Stop any running containers
echo "🛑 Stopping Docker containers..."
docker-compose down 2>/dev/null || echo "No containers to stop"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating a basic one..."
    cat > .env << EOL
USER_TABLE=Users
PORT=3001
NODE_ENV=development
EOL
fi

# Install dependencies and build
echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building backend..."
npm run build

# Start in Docker
echo "🚀 Starting backend in Docker..."
if ! docker-compose up --build -d; then
    echo "❌ Failed to start Docker containers. Check the error above."
    exit 1
fi

# Verify container is running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Container failed to start properly."
    echo "Showing logs:"
    docker-compose logs
    exit 1
fi

echo "✅ Backend update complete!"
echo "Backend running on http://localhost:3001"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
