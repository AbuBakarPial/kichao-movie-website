# KiChao Movie Download Site - Complete Deployment Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Production Deployment Options](#production-deployment-options)
   - [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
   - [Netlify Deployment](#netlify-deployment)
   - [Railway Deployment](#railway-deployment)
   - [Self-Hosted Docker Deployment](#self-hosted-docker-deployment)
   - [Traditional VPS Deployment](#traditional-vps-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Admin Panel Setup](#admin-panel-setup)
8. [Security Configuration](#security-configuration)
9. [Performance Optimization](#performance-optimization)
10. [Monitoring and Analytics](#monitoring-and-analytics)
11. [Backup and Recovery](#backup-and-recovery)
12. [Troubleshooting](#troubleshooting)
13. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Project Overview

KiChao is a modern, glassmorphic movie download site built with:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Prisma ORM** with SQLite database
- **shadcn/ui** components
- **Socket.IO** for real-time features
- **Framer Motion** for animations

### Key Features
- Movie browsing and downloading
- Admin panel for content management
- TMDB API integration for movie metadata
- Visitor counter
- Responsive design
- Real-time features
- Glassmorphic UI design

---

## Prerequisites

### System Requirements
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher
- **Git**: For version control
- **Database**: SQLite (included)

### Accounts Needed
- **GitHub**: For code hosting (required for most deployment platforms)
- **Deployment Platform**: Vercel/Netlify/Railway account
- **TMDB API**: Optional, for movie metadata (https://www.themoviedb.org/settings/api)

### Local Development Tools
```bash
# Check Node.js version
node --version  # Should be 18.0+

# Check npm version
npm --version   # Should be 8.0+

# Check Git
git --version
```

---

## Local Development Setup

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <your-repository-url>
cd kichao

# Install dependencies
npm install
```

### Step 2: Environment Configuration
Create a `.env.local` file:
```env
# Database
DATABASE_URL="file:./prisma/custom.db"

# TMDB API (optional)
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key_here"

# Admin Password
ADMIN_PASSWORD="your_secure_password_here"
```

### Step 3: Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Verify database setup
ls -la prisma/
```

### Step 4: Run Development Server
```bash
# Start development server
npm run dev

# Access the application
# Main site: http://localhost:3000
# Admin panel: http://localhost:3000/admin
```

### Step 5: Test the Application
1. Visit `http://localhost:3000` to see the main site
2. Visit `http://localhost:3000/admin` and log in with your admin password
3. Test adding/editing movies
4. Verify all features work correctly

---

## Production Deployment Options

### Vercel Deployment (Recommended)

#### Step 1: Prepare for Deployment
```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit: KiChao movie site"

# Create GitHub repository and connect
git remote add origin https://github.com/yourusername/kichao.git
git branch -M main
git push -u origin main
```

#### Step 2: Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Select your GitHub repository
5. Configure project settings:

#### Step 3: Environment Variables
In Vercel dashboard, add these environment variables:
```env
# Database
DATABASE_URL="file:./dev.db"

# TMDB API (optional)
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"

# Admin Password
ADMIN_PASSWORD="your_secure_production_password"
```

#### Step 4: Build Configuration
Vercel will automatically detect Next.js and use these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Step 5: Deploy
Click "Deploy" and wait for deployment to complete.

#### Step 6: Post-Deployment Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.production

# Setup database on production
vercel run npm run db:push
```

### Netlify Deployment

#### Step 1: Build Configuration
Create `netlify.toml` file:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Step 2: Netlify Setup
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set environment variables in Netlify dashboard
4. Deploy

#### Step 3: Environment Variables
Add these in Netlify dashboard:
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"
ADMIN_PASSWORD="your_secure_password"
```

### Railway Deployment

#### Step 1: Railway Setup
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Railway will automatically detect Next.js

#### Step 2: Environment Variables
Add in Railway dashboard:
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"
ADMIN_PASSWORD="your_secure_password"
```

#### Step 3: Deploy
Railway will automatically deploy on every push to main branch.

### Self-Hosted Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
USER nextjs

# Start the application
CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'

services:
  kichao:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./dev.db
      - ADMIN_PASSWORD=your_secure_password
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

#### Step 3: Build and Run
```bash
# Create data directory
mkdir -p data

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

### Traditional VPS Deployment

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd kichao

# Install dependencies
npm install
```

#### Step 2: Environment Setup
```bash
# Create production environment file
cp .env.local .env.production

# Edit environment variables
nano .env.production
```

#### Step 3: Database Setup
```bash
# Setup database
npm run db:generate
npm run db:push
```

#### Step 4: Build and Start
```bash
# Build application
npm run build

# Start with PM2
pm2 start server.ts --name kichao

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Step 5: Nginx Configuration
```nginx
# /etc/nginx/sites-available/kichao
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kichao /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Environment Configuration

### Required Environment Variables

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Admin Security
ADMIN_PASSWORD="your_very_secure_password_here"

# Optional: TMDB API for Movie Metadata
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key_here"

# Optional: Analytics (if using)
NEXT_PUBLIC_GA_ID="your_google_analytics_id"
```

### Security Best Practices
1. **Never commit `.env.local` to Git**
2. **Use strong passwords** (minimum 12 characters, mix of upper/lower/numbers/symbols)
3. **Rotate API keys** regularly
4. **Use different passwords** for development and production

### Platform-Specific Configuration

#### Vercel Environment Variables
- Go to Project → Settings → Environment Variables
- Add all required variables
- Select appropriate environments (Production, Preview, Development)

#### Netlify Environment Variables
- Go to Site settings → Build & deploy → Environment
- Add variables in "Environment variables" section
- Check "Deploy context" for each variable

#### Railway Environment Variables
- Go to Project → Variables
- Add all required variables
- Railway will automatically inject them

---

## Database Setup

### SQLite Configuration
The application uses SQLite by default. Here's how to manage it:

#### Development Database
```bash
# Location: ./prisma/custom.db

# View database schema
npx prisma db show

# Reset database (warning: deletes all data)
npx prisma migrate reset

# Seed database with sample data
# Note: Create a seed script if needed
```

#### Production Database
For production, consider these options:

##### Option 1: SQLite (Simple)
```env
DATABASE_URL="file:./dev.db"
```

##### Option 2: PostgreSQL (Scalable)
```env
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

##### Option 3: MySQL (Alternative)
```env
DATABASE_URL="mysql://username:password@hostname:port/database"
```

### Database Migration Strategy
```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Apply migration to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Database Backup Strategy
```bash
# SQLite backup
cp prisma/custom.db backup/custom_$(date +%Y%m%d).db

# Automated backup script (backup.sh)
#!/bin/bash
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
cp prisma/custom.db "$BACKUP_DIR/custom_$(date +%Y%m%d_%H%M%S).db"
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
```

---

## Admin Panel Setup

### Access Information
- **URL**: `https://your-domain.com/admin`
- **Default Password**: `admin123` (CHANGE THIS IMMEDIATELY)

### Security Configuration
Update the admin password in your code:

```typescript
// src/app/admin/page.tsx
const handleLogin = () => {
  if (password === process.env.ADMIN_PASSWORD) {
    setIsAuthenticated(true)
    localStorage.setItem('adminAuth', 'true')
    fetchMovies()
  } else {
    alert('Invalid password')
  }
}
```

### Admin Features
1. **Movie Management**: Add, edit, delete movies
2. **TMDB Integration**: Search and import movie data
3. **Featured Movies**: Mark movies as featured
4. **Category Management**: Organize movies by category
5. **Search and Filter**: Find movies quickly

### Best Practices
1. **Use strong passwords**
2. **Enable two-factor authentication** if possible
3. **Limit admin access** to specific IP addresses
4. **Regular security audits**
5. **Monitor admin login attempts**

---

## Security Configuration

### Essential Security Measures

#### 1. Change Default Password
```env
# In your environment variables
ADMIN_PASSWORD="your_strong_unique_password_123!"
```

#### 2. HTTPS Configuration
Most platforms (Vercel, Netlify) provide HTTPS automatically. For self-hosted:

```nginx
# Nginx SSL configuration
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

#### 3. Rate Limiting
Create middleware for rate limiting:
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Implement rate limiting logic here
  return NextResponse.next()
}
```

#### 4. Input Validation
```typescript
// Validate user inputs
const validateMovieInput = (data: any) => {
  const errors: string[] = []
  
  if (!data.title || data.title.length < 1) {
    errors.push('Title is required')
  }
  
  if (!data.download_link || !isValidUrl(data.download_link)) {
    errors.push('Valid download link is required')
  }
  
  return errors
}
```

#### 5. CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

### Security Headers
Add security headers to your application:
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}
```

---

## Performance Optimization

### Image Optimization
The application already uses Next.js Image component. Ensure:
```tsx
import Image from 'next/image'

<Image
  src={movie.poster_path}
  alt={movie.title}
  width={300}
  height={450}
  className="rounded-lg"
  priority // For above-the-fold images
/>
```

### Caching Strategy
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=30' },
        ],
      },
    ]
  },
}
```

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_movie_title ON Movie(title);
CREATE INDEX idx_movie_category ON Movie(category);
CREATE INDEX idx_movie_featured ON Movie(featured);
```

### Static Generation
For static pages, use:
```typescript
// src/app/page.tsx
export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  // Generate static paths for movies
}
```

### Bundle Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  }
}
```

---

## Monitoring and Analytics

### Built-in Visitor Counter
The application includes a visitor counter that tracks page views.

### Google Analytics Integration
```env
# Add to environment variables
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

```tsx
// src/components/Analytics.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Implement Google Analytics here
    }
  }, [pathname, searchParams])

  return null
}
```

### Error Tracking with Sentry
```bash
# Install Sentry
npm install @sentry/nextjs
```

```typescript
// src/app/sentry-client.tsx
'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function SentryClient() {
  useEffect(() => {
    Sentry.init({
      dsn: 'your_sentry_dsn',
    })
  }, [])

  return null
}
```

### Performance Monitoring
```typescript
// src/app/performance.tsx
'use client'

import { useEffect } from 'react'

export default function Performance() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Track Core Web Vitals
      const reportWebVitals = ({ name, value, id }) => {
        console.log(`${name}: ${value}`)
      }
      
      // Implement performance tracking
    }
  }, [])

  return null
}
```

---

## Backup and Recovery

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_FILE="prisma/custom.db"
BACKUP_FILE="$BACKUP_DIR/custom_$TIMESTAMP.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
cp $DB_FILE $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "*.db.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

### Recovery Procedure
```bash
# Stop the application
pm2 stop kichao

# Restore from backup
cp backups/custom_20231201_120000.db.gz ./backup.gz
gunzip backup.gz
cp backup prisma/custom.db

# Restart the application
pm2 start kichao
```

### Code Backup Strategy
```bash
# Regular Git commits
git add .
git commit -m "Regular backup commit"
git push origin main

# Create release tags
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Errors
```bash
# Check Node.js version
node --version  # Should be 18.0+

# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npm run lint
```

#### 2. Database Issues
```bash
# Check database file exists
ls -la prisma/custom.db

# Regenerate Prisma client
npm run db:generate

# Reset database
npm run db:reset
```

#### 3. Environment Variable Issues
```bash
# Verify environment variables
echo $DATABASE_URL
echo $ADMIN_PASSWORD

# Test database connection
npx prisma db push
```

#### 4. Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### 5. Permission Issues
```bash
# Fix file permissions
chmod 755 .
chmod 644 prisma/custom.db
```

### Debug Mode
Enable debug logging:
```env
DEBUG=*
NODE_ENV=development
```

### Log Files
Check application logs:
```bash
# Development logs
tail -f dev.log

# Production logs
tail -f server.log

# PM2 logs
pm2 logs kichao
```

---

## Post-Deployment Checklist

### Immediate Actions
- [ ] **Change admin password** from default
- [ ] **Verify all pages load correctly**
- [ ] **Test admin panel functionality**
- [ ] **Test movie upload/download features**
- [ ] **Verify database connectivity**
- [ ] **Check all environment variables**
- [ ] **Test responsive design on mobile**
- [ ] **Verify HTTPS is working**

### Security Actions
- [ ] **Implement rate limiting**
- [ ] **Add security headers**
- [ ] **Set up CORS properly**
- [ ] **Enable input validation**
- [ ] **Configure firewall rules**
- [ ] **Set up SSL certificates**
- [ ] **Implement backup strategy**

### Performance Actions
- [ ] **Enable image optimization**
- [ ] **Set up caching headers**
- [ ] **Optimize database queries**
- [ ] **Enable compression**
- [ ] **Set up CDN for static assets**
- [ ] **Monitor page load times**

### Monitoring Actions
- [ ] **Set up error tracking**
- [ ] **Configure analytics**
- [ ] **Set up uptime monitoring**
- [ ] **Configure alerts**
- [ ] **Set up log aggregation**
- [ ] **Monitor resource usage**

### Maintenance Actions
- [ ] **Set up automated backups**
- [ ] **Create update procedures**
- [ ] **Document recovery procedures**
- [ ] **Set up monitoring dashboards**
- [ ] **Create maintenance schedule**

### Final Verification
- [ ] **Test all user flows**
- [ ] **Verify admin functionality**
- [ ] **Check mobile responsiveness**
- [ ] **Test different browsers**
- [ ] **Verify SEO settings**
- [ ] **Check accessibility compliance**
- [ ] **Test load performance**

---

## Support and Maintenance

### Regular Maintenance Tasks
1. **Weekly**: Check logs, monitor performance, update dependencies
2. **Monthly**: Security updates, database optimization, backup verification
3. **Quarterly**: Major updates, security audit, performance review

### Update Procedures
```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Database maintenance
npx prisma db push
```

### Emergency Procedures
1. **Site Down**: Check logs, restart services, verify database
2. **Security Breach**: Change passwords, review logs, restore from backup
3. **Data Loss**: Restore from latest backup, verify data integrity

### Contact Information
- **Documentation**: Check this guide and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Community**: Join relevant Next.js and Prisma communities

---

## Conclusion

This comprehensive guide should help you successfully deploy and maintain the KiChao movie download website. Remember to:

1. **Always change default passwords**
2. **Keep regular backups**
3. **Monitor performance and security**
4. **Stay updated with dependencies**
5. **Test thoroughly before production deployment**

The application is now ready for production use and can handle real-world traffic with proper configuration and monitoring.

---

**License**: This project is for educational purposes. Ensure you have proper licenses for any content you distribute.

**Last Updated**: December 2023