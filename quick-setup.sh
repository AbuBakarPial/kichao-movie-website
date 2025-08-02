#!/bin/bash

# KiChao Movie Site - Quick Setup Script
# This script helps you quickly set up the project for deployment

echo "🎬 KiChao Movie Site - Quick Setup Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Create project archive
echo "📦 Creating project archive..."
cd /home/z
tar -czf kichao-movie-site-complete.tar.gz my-project/
echo "✅ Archive created: /home/z/kichao-movie-site-complete.tar.gz"

# Show project info
echo ""
echo "📋 Project Information:"
echo "======================"
echo "📁 Project Location: /home/z/my-project"
echo "📦 Archive File: /home/z/kichao-movie-site-complete.tar.gz"
echo "🌐 Local URL: http://localhost:3000"
echo "🔧 Admin Panel: http://localhost:3000/admin"
echo "👤 Admin Password: admin123"

# Show file structure
echo ""
echo "📂 Project Structure:"
echo "====================="
echo "my-project/"
echo "├── src/"
echo "│   ├── app/              # Next.js app directory"
echo "│   ├── components/       # React components"
echo "│   ├── lib/             # Utilities and database"
echo "│   └── hooks/           # Custom React hooks"
echo "├── prisma/              # Database schema"
echo "├── public/              # Static assets"
echo "├── package.json         # Dependencies and scripts"
echo "├── next.config.ts       # Next.js configuration"
echo "├── tailwind.config.ts   # Tailwind CSS configuration"
echo "├── tsconfig.json        # TypeScript configuration"
echo "└── server.ts            # Custom server with Socket.io"

# Show setup commands
echo ""
echo "🚀 Quick Setup Commands:"
echo "========================"
echo ""
echo "1. Extract the archive:"
echo "   tar -xzf kichao-movie-site-complete.tar.gz"
echo "   cd my-project"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Set up environment:"
echo "   cp .env.local.example .env.local"
echo "   # Edit .env.local with your settings"
echo ""
echo "4. Set up database:"
echo "   npm run db:generate"
echo "   npm run db:push"
echo "   npm run db:seed      # Optional: add sample data"
echo ""
echo "5. Start development server:"
echo "   npm run dev"
echo ""
echo "🌐 Your site will be available at: http://localhost:3000"

# Show deployment info
echo ""
echo "🚀 Deployment Guide:"
echo "==================="
echo ""
echo "For Vercel deployment:"
echo "1. Push to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git remote add origin https://github.com/your-username/kichao-movie-site.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set environment variables:"
echo "     DATABASE_URL=postgresql://..."
echo "     NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key"
echo "     ADMIN_PASSWORD=your_secure_password"
echo ""
echo "3. Set up production database:"
echo "   - Use Vercel Postgres, Supabase, or Railway"
echo "   - Run: npx prisma migrate deploy"
echo ""

echo "✅ Setup complete! Check the PROJECT_SETUP_GUIDE.md file for detailed instructions."
echo "📄 Full guide available at: /home/z/my-project/PROJECT_SETUP_GUIDE.md"