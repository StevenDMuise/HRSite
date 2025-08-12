#!/bin/bash

# Get the current directory and project root
BACKEND_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$BACKEND_DIR/.." && pwd )"

echo "🔄 Starting complete system update..."

# Run backend update
echo "⚙️  Updating backend..."
cd "$BACKEND_DIR"
./update-backend.sh

# Run frontend update
echo "🎨 Updating frontend..."
cd "$PROJECT_ROOT/frontend"
./update-frontend.sh

echo "✅ System update complete!"
echo "Backend running on http://localhost:3001"
echo "Frontend running on http://localhost:8080"
