# 🚀 KiChao Movie Site - Quick Start Guide

## ⚡ Fastest Setup Method

### Step 1: Copy & Run the Setup Script

Copy this entire command and run it in your terminal:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/yourusername/kichao/main/setup.sh | bash
```

### OR - Manual Setup

If the above doesn't work, follow these steps:

#### 1. Copy the Setup Script
```bash
# Create setup script
cat > setup.sh << 'EOF'
[PASTE THE ENTIRE setup.sh CONTENT HERE]
EOF

# Make it executable
chmod +x setup.sh

# Run it
./setup.sh
```

#### 2. Quick Commands (Copy-Paste Ready)

**Environment Setup:**
```bash
# Create .env.local
cat > .env.local << 'EOF'
DATABASE_URL="file:./prisma/custom.db"
ADMIN_PASSWORD="your_secure_password_here"
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key_here"
EOF
```

**Install & Run:**
```bash
# One command setup
npm install && npm run db:generate && npm run db:push && npm run dev
```

**Docker Setup:**
```bash
# Start with Docker
docker-compose up -d
```

## 🎯 Ultra-Quick Start (5 Minutes)

### Option A: Development Mode
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:generate && npm run db:push

# 3. Start development server
npm run dev

# 4. Access your site
# Main: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### Option B: Production Mode
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:generate && npm run db:push

# 3. Build for production
npm run build

# 4. Start production server
npm start

# 5. Access your site
# Main: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### Option C: Docker (Recommended for Production)
```bash
# 1. Start with Docker
docker-compose up -d

# 2. Access your site
# Main: http://localhost:3000
# Admin: http://localhost:3000/admin

# 3. View logs
docker-compose logs -f
```

## 🔑 Important Information

### Default Admin Password
- **Default**: `admin123`
- **Location**: Check `.env.local` after setup
- **Action**: CHANGE IMMEDIATELY in production

### Essential Files Created
- `setup.sh` - Complete setup script
- `start.sh` - Development server
- `start-prod.sh` - Production server
- `backup.sh` - Database backup
- `update.sh` - Project update
- `docker-compose.yml` - Docker configuration
- `Dockerfile` - Docker build file

### Environment Variables
```env
DATABASE_URL="file:./prisma/custom.db"
ADMIN_PASSWORD="your_secure_password"
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"
```

## 🚀 Deployment Commands

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Railway
```bash
# Connect to Railway and deploy
# Railway auto-detects Next.js
```

## 📋 Post-Setup Checklist

- [ ] **Change admin password** from default
- [ ] **Get TMDB API key** (optional)
- [ ] **Test all features** work
- [ ] **Verify admin panel** access
- [ ] **Test mobile responsiveness**
- [ ] **Set up HTTPS** (production)
- [ ] **Configure backup** strategy
- [ ] **Set up monitoring**

## 🎬 Access Your Site

### Development
- **Main Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Password**: Check `.env.local` file

### Production
- **Main Site**: https://your-domain.com
- **Admin Panel**: https://your-domain.com/admin
- **Password**: Your secure admin password

## 🆘 Troubleshooting

### Common Issues
```bash
# Port already in use
lsof -i :3000
kill -9 <PID>

# Permission issues
chmod +x setup.sh
./setup.sh

# Database issues
rm -f prisma/custom.db
npm run db:push
```

### Reset Everything
```bash
# Complete reset
rm -rf .next node_modules prisma/custom.db
npm install
npm run db:generate
npm run db:push
npm run dev
```

## 📞 Support

If you encounter issues:
1. Check the complete deployment guide: `COMPLETE_DEPLOYMENT_GUIDE.md`
2. Run the setup script again: `./setup.sh`
3. Check logs: `tail -f dev.log`
4. Verify environment variables: `cat .env.local`

---

**🎉 You're all set! Your KiChao movie site is ready to use!**