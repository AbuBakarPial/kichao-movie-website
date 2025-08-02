#!/bin/bash

# =============================================================================
# KiChao Movie Download Site - Automated Setup Script
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

print_header() {
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}=====================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install $1 first."
        exit 1
    fi
}

# =============================================================================
# SYSTEM CHECKS
# =============================================================================

print_header "SYSTEM REQUIREMENTS CHECK"

print_info "Checking system requirements..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_success "Node.js $NODE_VERSION ✓"
    else
        print_error "Node.js version 18+ required. Found: $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION ✓"
else
    print_error "npm is not installed."
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_success "Git ✓"
else
    print_warning "Git is not installed. Some features may not work."
fi

# =============================================================================
# PROJECT SETUP
# =============================================================================

print_header "PROJECT SETUP"

print_info "Setting up KiChao movie site..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
print_info "Installing dependencies..."
npm install
print_success "Dependencies installed ✓"

# =============================================================================
# ENVIRONMENT CONFIGURATION
# =============================================================================

print_header "ENVIRONMENT CONFIGURATION"

print_info "Setting up environment variables..."

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local file..."
    
    # Generate secure random password
    SECURE_PASSWORD=$(openssl rand -base64 12 | tr -d '=+/' | cut -c1-16)
    
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="file:./prisma/custom.db"

# Admin Password (auto-generated secure password)
ADMIN_PASSWORD="$SECURE_PASSWORD"

# TMDB API (optional - get from https://www.themoviedb.org/settings/api)
# NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key_here"

# Analytics (optional)
# NEXT_PUBLIC_GA_ID="your_google_analytics_id"
EOF
    
    print_success "Environment file created ✓"
    print_warning "Your admin password is: $SECURE_PASSWORD"
    print_warning "Save this password in a secure location!"
else
    print_info ".env.local already exists, skipping creation."
fi

# =============================================================================
# DATABASE SETUP
# =============================================================================

print_header "DATABASE SETUP"

print_info "Setting up database..."

# Create prisma directory if it doesn't exist
mkdir -p prisma

# Generate Prisma client
print_info "Generating Prisma client..."
npm run db:generate
print_success "Prisma client generated ✓"

# Push database schema
print_info "Creating database..."
npm run db:push
print_success "Database created ✓"

# Check if database file exists
if [ -f "prisma/custom.db" ]; then
    print_success "Database file verified ✓"
else
    print_error "Database file not created. Please check the DATABASE_URL in .env.local"
    exit 1
fi

# =============================================================================
# BUILD VERIFICATION
# =============================================================================

print_header "BUILD VERIFICATION"

print_info "Testing build process..."

# Try to build the project
if npm run build; then
    print_success "Build successful ✓"
else
    print_error "Build failed. Please check the error messages above."
    exit 1
fi

# =============================================================================
# CREATE HELPER SCRIPTS
# =============================================================================

print_header "CREATING HELPER SCRIPTS"

# Create start script
cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting KiChao movie site..."
npm run dev
EOF
chmod +x start.sh
print_success "start.sh created ✓"

# Create production start script
cat > start-prod.sh << 'EOF'
#!/bin/bash
echo "Starting KiChao movie site in production mode..."
npm run build
npm start
EOF
chmod +x start-prod.sh
print_success "start-prod.sh created ✓"

# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
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
EOF
chmod +x backup.sh
print_success "backup.sh created ✓"

# Create update script
cat > update.sh << 'EOF'
#!/bin/bash
echo "Updating KiChao movie site..."

# Pull latest changes
git pull origin main

# Update dependencies
npm update

# Rebuild
npm run build

echo "Update completed!"
EOF
chmod +x update.sh
print_success "update.sh created ✓"

# Create Docker setup
cat > docker-compose.yml << 'EOF'
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
EOF
print_success "docker-compose.yml created ✓"

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

CMD ["npm", "start"]
EOF
print_success "Dockerfile created ✓"

# =============================================================================
# DEPLOYMENT GUIDES
# =============================================================================

print_header "DEPLOYMENT GUIDES"

# Create Vercel deployment script
cat > deploy-vercel.sh << 'EOF'
#!/bin/bash
echo "Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy to Vercel
vercel --prod

echo "Vercel deployment completed!"
EOF
chmod +x deploy-vercel.sh
print_success "deploy-vercel.sh created ✓"

# Create Netlify deployment script
cat > deploy-netlify.sh << 'EOF'
#!/bin/bash
echo "Deploying to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm i -g netlify-cli
fi

# Deploy to Netlify
netlify deploy --prod

echo "Netlify deployment completed!"
EOF
chmod +x deploy-netlify.sh
print_success "deploy-netlify.sh created ✓"

# =============================================================================
# COMPLETION SUMMARY
# =============================================================================

print_header "SETUP COMPLETED SUCCESSFULLY!"

echo -e "${GREEN}🎉 KiChao movie site setup completed!${NC}"
echo

echo -e "${BLUE}📋 NEXT STEPS:${NC}"
echo "1. ${YELLOW}Save your admin password${NC} (shown above)"
echo "2. ${YELLOW}Get TMDB API key${NC} (optional): https://www.themoviedb.org/settings/api"
echo "3. ${YELLOW}Start the development server${NC}: ./start.sh"
echo "4. ${YELLOW}Access the admin panel${NC}: http://localhost:3000/admin"
echo

echo -e "${BLUE}🚀 AVAILABLE COMMANDS:${NC}"
echo "  ${GREEN}./start.sh${NC}           - Start development server"
echo "  ${GREEN}./start-prod.sh${NC}       - Start production server"
echo "  ${GREEN}./backup.sh${NC}           - Backup database"
echo "  ${GREEN}./update.sh${NC}            - Update project"
echo "  ${GREEN}./deploy-vercel.sh${NC}     - Deploy to Vercel"
echo "  ${GREEN}./deploy-netlify.sh${NC}    - Deploy to Netlify"
echo

echo -e "${BLUE}🐳 DOCKER COMMANDS:${NC}"
echo "  ${GREEN}docker-compose up -d${NC}   - Start with Docker"
echo "  ${GREEN}docker-compose down${NC}     - Stop Docker"
echo

echo -e "${BLUE}📁 IMPORTANT FILES:${NC}"
echo "  ${GREEN}.env.local${NC}             - Environment variables"
echo "  ${GREEN}prisma/custom.db${NC}       - Database file"
echo "  ${GREEN}backup.sh${NC}              - Backup script"
echo "  ${GREEN}docker-compose.yml${NC}     - Docker configuration"
echo

echo -e "${YELLOW}⚠️  IMPORTANT SECURITY NOTES:${NC}"
echo "  • Change your admin password immediately"
echo "  • Never commit .env.local to Git"
echo "  • Use HTTPS in production"
echo "  • Keep regular backups"
echo "  • Monitor your site for security issues"
echo

echo -e "${BLUE}🌐 ACCESS URLS:${NC}"
echo "  ${GREEN}Main site:${NC}     http://localhost:3000"
echo "  ${GREEN}Admin panel:${NC}   http://localhost:3000/admin"
echo

echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${BLUE}Happy coding! 🎬${NC}"