#!/bin/bash

# Lalon Shop Application Stop Script

echo "=== STOPPING LALON SHOP APPLICATION ==="
echo "Stopping at: $(date)"
echo ""

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(netstat -tlnp | grep ":$port " | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$pids" ]; then
        echo "🔄 Stopping processes on port $port: $pids"
        kill -9 $pids 2>/dev/null || true
        sleep 2
        
        # Verify port is free
        if netstat -tlnp | grep -q ":$port "; then
            echo "⚠️  Port $port still in use, force killing..."
            kill -9 $pids 2>/dev/null || true
            sleep 2
        fi
        
        if netstat -tlnp | grep -q ":$port "; then
            echo "❌ Failed to free port $port"
        else
            echo "✅ Port $port is now free"
        fi
    else
        echo "✅ Port $port is already free"
    fi
}

# Stop services
echo "1. Stopping Frontend (Port 2008)..."
kill_port 2008

echo ""
echo "2. Stopping Backend (Port 2004)..."
kill_port 2004

echo ""
echo "3. Cleaning up any remaining processes..."
pkill -f "next start -p 2008" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true

sleep 2

echo ""
echo "=== STOPPING COMPLETE ==="
echo "All Lalon Shop services have been stopped."
echo ""
echo "To restart: ./start-lalon.sh"

