module.exports = {
  apps: [
    {
      name: 'lalon-backend',
      script: 'server.js',
      cwd: '/root/lalon/lalonbf/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 2004
      },
      error_file: '/root/lalon/lalonbf/backend/backend-error.log',
      out_file: '/root/lalon/lalonbf/backend/backend-out.log',
      log_file: '/root/lalon/lalonbf/backend/backend.log',
      time: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
      autorestart: true
    },
    {
      name: 'lalon-admin-frontend',
      script: 'npx',
      args: 'serve dist -s -p 5173',
      cwd: '/root/lalon/lalonbf/admin-frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5173
      },
      error_file: '/root/lalon/lalonbf/admin-frontend/admin-error.log',
      out_file: '/root/lalon/lalonbf/admin-frontend/admin-out.log',
      log_file: '/root/lalon/lalonbf/admin-frontend/admin.log',
      time: true,
      watch: false,
      max_memory_restart: '500M',
      restart_delay: 3000,
      autorestart: true
    },
    {
      name: 'lalon-shop-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/root/lalon/lalonbf/lalon-shop-frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 2008
      },
      error_file: '/root/lalon/lalonbf/lalon-shop-frontend/frontend-error.log',
      out_file: '/root/lalon/lalonbf/lalon-shop-frontend/frontend-out.log',
      log_file: '/root/lalon/lalonbf/lalon-shop-frontend/frontend.log',
      time: true,
      watch: false,
      max_memory_restart: '500M',
      restart_delay: 3000,
      autorestart: true
    }
  ]
};
