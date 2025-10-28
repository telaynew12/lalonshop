#!/bin/bash

# Lalon Shop Application Status Monitor
# This script checks the health of your application

echo "=== LALON SHOP APPLICATION STATUS ==="
echo "Checked at: $(date)"
echo ""

# Function to check service status
check_service() {
    local name=$1
    local port=$2
    local url=$3
    
    if netstat -tlnp | grep -q ":$port "; then
        echo "✅ $name is running on port $port"
        
        # Test HTTP response
        if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
            echo "✅ $name is responding to HTTP requests"
        else
            echo "⚠️  $name is running but not responding to HTTP requests"
        fi
    else
        echo "❌ $name is not running on port $port"
    fi
}

# Check services
echo "1. Service Status:"
check_service "Backend" "2004" "http://localhost:2004/api/v1/product/search?take=1&page=1"
echo ""
check_service "Frontend" "2008" "http://localhost:2008/"
echo ""

# Check external URLs
echo "2. External Access:"
if curl -s --max-time 10 "https://www.lalonshopbd.com/" > /dev/null 2>&1; then
    echo "✅ Domain (https://www.lalonshopbd.com/) is accessible"
else
    echo "❌ Domain (https://www.lalonshopbd.com/) is not accessible"
fi

if curl -s --max-time 10 "http://88.222.245.41:2008/" > /dev/null 2>&1; then
    echo "✅ Direct IP (http://88.222.245.41:2008/) is accessible"
else
    echo "❌ Direct IP (http://88.222.245.41:2008/) is not accessible"
fi
echo ""

# Check disk space
echo "3. System Resources:"
df -h / | tail -1 | awk '{print "💾 Disk Usage: " $5 " (" $3 "/" $2 ")"}'

# Check memory usage
free -h | grep Mem | awk '{print "🧠 Memory Usage: " $3 "/" $2}'
echo ""

# Check recent logs for errors
echo "4. Recent Logs:"
if [ -f "/root/lalon/lalon source code/backend/backend.log" ]; then
    echo "Backend logs (last 3 lines):"
    tail -3 "/root/lalon/lalon source code/backend/backend.log" | sed 's/^/  /'
fi

if [ -f "/root/lalon/lalon source code/lalon-shop-frontend/frontend.log" ]; then
    echo "Frontend logs (last 3 lines):"
    tail -3 "/root/lalon/lalon source code/lalon-shop-frontend/frontend.log" | sed 's/^/  /'
fi
echo ""

echo "=== STATUS CHECK COMPLETE ==="
echo "To restart services: ./start-lalon.sh"
echo "To stop services: ./stop-lalon.sh"

