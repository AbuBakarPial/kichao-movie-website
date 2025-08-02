# KiChao Movie Download Site - Complete Setup Guide

## Table of Contents
1. [Getting the Project Code](#getting-the-project-code)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## Getting the Project Code

### Method 1: Download Current Directory (Recommended)
The project is already complete in the current directory `/home/z/my-project`. To get the code:

1. **Create a compressed archive:**
   ```bash
   cd /home/z
   tar -czf kichao-movie-site.tar.gz my-project/
   ```

2. **Download the file** using your preferred method (SCP, SFTP, or download link if available)

3. **Extract on your local machine:**
   ```bash
   tar -xzf kichao-movie-site.tar.gz
   cd my-project
   ```

### Method 2: Copy Files Individually
If you prefer to copy specific files, the main project structure is:

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main homepage
│   │   ├── admin/page.tsx    # Admin panel
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── loading-screen.tsx # Loading screen
│   │   ├── header.tsx        # Navigation header
│   │   ├── movie-card.tsx    # Movie display cards
│   │   ├── featured-slider.tsx # Featured movies slider
│   │   ├── visitor-count.tsx  # Visitor counter
│   │   ├── tmdb-search.tsx   # TMDB integration
│   │   └── ui/               # Shadcn UI components
│   ├── lib/
│   │   ├── db.ts             # Database connection
│   │   ├── socket.ts         # Socket.io setup
│   │   └── utils.ts          # Utility functions
│   └── hooks/
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── server.ts                # Custom server
```

---

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git (optional)

### Step 1: Install Dependencies
```bash
cd my-project
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Database
DATABASE_URL="file:./dev.db"

# TMDB API (optional for movie posters)
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"

# Admin Password
ADMIN_PASSWORD="admin123"
```

### Step 3: Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.

---

## Database Setup

### Database Technology
- **ORM**: Prisma
- **Database**: SQLite (for development) / PostgreSQL (for production)
- **Schema**: Located in `prisma/schema.prisma`

### Current Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Movie {
  id            String   @id @default(cuid())
  title         String
  poster_path   String
  category      String
  download_link String
  featured      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Visitor {
  id        String   @id @default(cuid())
  count     Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Database Operations

#### Development (SQLite)
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# View database
npm run db:studio

# Reset database
npm run db:reset
```

#### Production (PostgreSQL)
1. **Set up PostgreSQL database:**
   - Use cloud providers like Supabase, Railway, or Vercel Postgres
   - Or self-hosted PostgreSQL

2. **Update environment variables:**
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

3. **Run migrations:**
   ```bash
   # Generate migration
   npx prisma migrate dev --name init
   
   # Deploy to production
   npx prisma migrate deploy
   ```

### Database Seeding
Create sample data with:
```bash
npm run db:seed
```

---

## Vercel Deployment

### Step 1: Push to GitHub
1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: KiChao movie site"
   ```

2. **Create GitHub repository:**
   - Go to GitHub.com
   - Create new repository named "kichao-movie-site"

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/your-username/kichao-movie-site.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

#### Method A: Through GitHub Integration (Recommended)
1. **Sign up for Vercel** at [vercel.com](https://vercel.com)
2. **Import project:**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure environment variables:**
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_key"
   ADMIN_PASSWORD="your_secure_password"
   ```

4. **Deploy:**
   - Vercel will automatically detect Next.js
   - Click "Deploy"

#### Method B: Vercel CLI
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login and deploy:**
   ```bash
   vercel login
   vercel --prod
   ```

### Step 3: Set Up Production Database

#### Option 1: Vercel Postgres (Easiest)
1. **In Vercel dashboard:**
   - Go to your project
   - Click "Storage" tab
   - "Create Database"
   - Choose "Postgres"

2. **Get connection string:**
   - Vercel will provide `DATABASE_URL`
   - Add to environment variables

3. **Run migrations:**
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Run database migrations
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

#### Option 2: Supabase
1. **Create Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Get connection string:**
   - Project Settings > Database
   - Copy "URI" connection string

3. **Set environment variable:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
   ```

#### Option 3: Railway
1. **Create Railway project:**
   - Go to [railway.app](https://railway.app)
   - Create new project

2. **Add PostgreSQL service:**
   - Click "+ Add Service"
   - Choose "PostgreSQL"

3. **Get connection string from Railway dashboard**

### Step 4: Deploy Database Schema
```bash
# Install Prisma CLI globally
npm install -g prisma

# Push schema to production database
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate deploy
```

### Step 5: Seed Production Database (Optional)
If you want sample data in production:
```bash
# Run seed script in production
npx tsx seed.js
```

---

## Environment Variables

### Required Variables
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# TMDB API (optional)
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"

# Admin Authentication
ADMIN_PASSWORD="your_secure_admin_password"
```

### Optional Variables
```env
# Node Environment
NODE_ENV="production"

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### How to Set in Vercel
1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add each variable with its value

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
**Problem:** `Can't reach database server`
**Solution:**
- Check `DATABASE_URL` format
- Ensure database is accessible
- Verify firewall settings

#### 2. Build Errors on Vercel
**Problem:** Build fails during deployment
**Solution:**
- Check `npm run build` locally first
- Ensure all dependencies are in `package.json`
- Check TypeScript errors

#### 3. Prisma Issues
**Problem:** Prisma client not generated
**Solution:**
```bash
npm run db:generate
npm run db:push
```

#### 4. Static File Issues
**Problem:** Images or static files not loading
**Solution:**
- Ensure files are in `public/` directory
- Check file paths are correct

#### 5. Environment Variables Not Loading
**Problem:** `process.env` variables undefined
**Solution:**
- Variables prefixed with `NEXT_PUBLIC_` are available in browser
- Server-only variables don't need the prefix
- Restart development server after changing `.env` files

### Useful Commands

#### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
```

#### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open database browser
npm run db:seed      # Seed database with sample data
```

#### Production
```bash
npx prisma migrate deploy  # Deploy migrations to production
npx prisma db seed         # Seed production database
```

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Summary

1. **Get Code**: Download from current directory or set up Git repository
2. **Local Setup**: Install dependencies, set up environment variables, configure database
3. **Database**: Use SQLite for development, PostgreSQL for production
4. **Vercel Deploy**: Push to GitHub, import to Vercel, set up production database
5. **Environment Variables**: Configure all required variables in Vercel dashboard

Your KiChao movie download site will be live and ready to use!