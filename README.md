# Lalon Shop Application Management

This directory contains scripts to manage your Lalon Shop application.

## 📋 Available Scripts

### 🚀 `start-lalon.sh`
Starts both backend and frontend services:
- **Backend**: Node.js server on port 2004
- **Frontend**: Next.js application on port 2008
- Automatically kills existing processes
- Tests API endpoints
- Provides startup status

**Usage:**
```bash
./start-lalon.sh
```

### 🛑 `stop-lalon.sh`
Stops all Lalon Shop services:
- Kills processes on ports 2004 and 2008
- Cleans up any remaining processes
- Verifies ports are free

**Usage:**
```bash
./stop-lalon.sh
```

### 📊 `status-lalon.sh`
Checks the health of your application:
- Service status (running/stopped)
- HTTP response tests
- External URL accessibility
- System resources (disk, memory)
- Recent log entries

**Usage:**
```bash
./status-lalon.sh
```

## 🌐 Application URLs

- **Direct Frontend**: http://88.222.245.41:2008/
- **Domain Frontend**: https://www.lalonshopbd.com/
- **Backend API**: http://88.222.245.41:2004/api/v1/

## 📁 Application Structure

```
lalon source code/
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── backend.log         # Backend logs
├── lalon-shop-frontend/     # Next.js frontend
│   ├── package.json        # Frontend dependencies
│   └── frontend.log        # Frontend logs
├── admin-frontend/          # Admin panel (Vite/React)
└── scripts/                # Management scripts
    ├── start-lalon.sh      # Start services
    ├── stop-lalon.sh       # Stop services
    └── status-lalon.sh     # Check status
```

## 🔧 Common Issues & Solutions

### Port Already in Use
If you get `EADDRINUSE` errors:
```bash
./stop-lalon.sh    # Stop all services
./start-lalon.sh   # Restart services
```

### Services Not Responding
Check status and logs:
```bash
./status-lalon.sh  # Check overall health
tail -f backend/backend.log      # Monitor backend logs
tail -f lalon-shop-frontend/frontend.log  # Monitor frontend logs
```

### Database Connection Issues
- Check if MongoDB is running
- Verify database credentials in `backend/.env`

## 📝 Log Files

- **Backend**: `/root/lalon/lalon source code/backend/backend.log`
- **Frontend**: `/root/lalon/lalon source code/lalon-shop-frontend/frontend.log`

## 🚀 Quick Start

1. **Start the application:**
   ```bash
   ./start-lalon.sh
   ```

2. **Check status:**
   ```bash
   ./status-lalon.sh
   ```

3. **Access your site:**
   - Visit: https://www.lalonshopbd.com/
   - Or: http://88.222.245.41:2008/

4. **Stop when done:**
   ```bash
   ./stop-lalon.sh
   ```

## 🔄 Restart Process

To restart the entire application:
```bash
./stop-lalon.sh
sleep 3
./start-lalon.sh
```

---

**Note**: These scripts are designed to work with your specific Lalon Shop setup. They handle process management, port conflicts, and provide comprehensive status monitoring.

# lalonshop
