#!/bin/bash

# Lalon Shop Application Startup Script
# This script starts the backend and frontend services properly

echo "=== LALON SHOP APPLICATION STARTUP ==="
echo "Starting at: $(date)"
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if netstat -tlnp | grep -q ":$port "; then
        echo "❌ Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(netstat -tlnp | grep ":$port " | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$pids" ]; then
        echo "🔄 Killing processes on port $port: $pids"
        kill -9 $pids 2>/dev/null || true
        sleep 2
    fi
}

# Kill existing processes on our ports
echo "1. Cleaning up existing processes..."
kill_port 2004
kill_port 2008

# Wait a moment
sleep 3

# Check if ports are now free
if ! check_port 2004; then
    echo "❌ Failed to free port 2004"
    exit 1
fi

if ! check_port 2008; then
    echo "❌ Failed to free port 2008"
    exit 1
fi

# Start Backend
echo ""
echo "2. Starting Backend Server (Port 2004)..."
cd "/root/lalon/lalon source code/backend"
nohup npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 5

# Check if backend is running
if netstat -tlnp | grep -q ":2004 "; then
    echo "✅ Backend is running on port 2004"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start Frontend
echo ""
echo "3. Starting Frontend Server (Port 2008)..."
cd "/root/lalon/lalon source code/lalon-shop-frontend"
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 8

# Check if frontend is running
if netstat -tlnp | grep -q ":2008 "; then
    echo "✅ Frontend is running on port 2008"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

# Test API endpoints
echo ""
echo "4. Testing API endpoints..."
if curl -s "http://localhost:2004/api/v1/product/search?take=1&page=1" | grep -q "products"; then
    echo "✅ Backend API is responding"
else
    echo "⚠️  Backend API test failed"
fi

# Final status
echo ""
echo "=== STARTUP COMPLETE ==="
echo "Backend PID: $BACKEND_PID (Port 2004)"
echo "Frontend PID: $FRONTEND_PID (Port 2008)"
echo ""
echo "Access URLs:"
echo "  Direct Frontend: http://88.222.245.41:2008/"
echo "  Domain Frontend: https://www.lalonshopbd.com/"
echo "  Backend API: http://88.222.245.41:2004/api/v1/"
echo ""
echo "Logs:"
echo "  Backend: /root/lalon/lalon source code/backend/backend.log"
echo "  Frontend: /root/lalon/lalon source code/lalon-shop-frontend/frontend.log"

