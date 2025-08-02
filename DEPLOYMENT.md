# KiChao Movie Download Site - Deployment Guide

## Overview
KiChao is a modern, glassmorphic movie download site built with Next.js 14+, TypeScript, Tailwind CSS, and Prisma. This guide will help you deploy the application to production.

## Prerequisites
- Node.js 18+ installed
- Git installed
- Vercel account (for deployment)
- TMDB API key (for movie metadata)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# TMDB API (optional, for movie metadata)
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key_here"

# Admin Password (change this for production)
ADMIN_PASSWORD="your_secure_admin_password"
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run db:push
   ```

3. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Production Deployment

### Vercel Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/kichao.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`: `file:./dev.db` (for SQLite)
     - `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API key
     - `ADMIN_PASSWORD`: Your secure admin password
   - Click "Deploy"

3. **Post-deployment setup:**
   - After deployment, run the database setup:
     ```bash
     vercel env pull .env.production
     npm run db:push
     ```
   - Access your admin panel at `https://your-domain.com/admin`

### Alternative Deployment Options

#### Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Configure build command: `npm run build`
4. Configure publish directory: `.next`

#### Railway
1. Create a new Railway project
2. Connect your GitHub repository
3. Set environment variables
4. Railway will automatically deploy

#### Self-hosted (Docker)
1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t kichao .
   docker run -p 3000:3000 --env-file .env.local kichao
   ```

## Admin Panel

### Access
- URL: `https://your-domain.com/admin`
- Default password: `admin123` (change this in production!)

### Features
- Add/Edit/Delete movies
- TMDB API integration for movie metadata
- Featured movie management
- Movie categorization
- Search and filter functionality

## Database Management

### SQLite Setup
The application uses SQLite by default. The database file is located at `./dev.db`.

### Database Schema
```sql
CREATE TABLE Movie (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  poster_path TEXT NOT NULL,
  category TEXT NOT NULL,
  download_link TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Seeding Data
To populate the database with sample movies:
```bash
npm run seed
```

## Security Considerations

1. **Change the admin password** from the default `admin123`
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Rate limiting** for API endpoints
5. **Input validation** for all user inputs
6. **CORS configuration** for API access

## Performance Optimization

1. **Image Optimization:**
   - Use Next.js Image component
   - Enable WebP format
   - Lazy loading for images

2. **Caching:**
   - Enable static generation where possible
   - Use browser caching
   - Implement CDN for static assets

3. **Database Optimization:**
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Implement read replicas for high traffic

## Monitoring and Analytics

1. **Error Tracking:**
   - Integrate Sentry or similar error tracking
   - Set up logging for errors and performance

2. **Visitor Analytics:**
   - The built-in visitor counter tracks page views
   - For detailed analytics, integrate Google Analytics or Plausible

3. **Performance Monitoring:**
   - Use Vercel Analytics
   - Monitor Core Web Vitals
   - Track page load times

## Backup and Recovery

1. **Database Backups:**
   - Regular backups of the SQLite database
   - Store backups in secure cloud storage
   - Test backup restoration

2. **Code Backups:**
   - Version control with Git
   - Regular commits to main branch
   - Feature branches for development

## Troubleshooting

### Common Issues

1. **Build Errors:**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check TypeScript configuration

2. **Database Issues:**
   - Ensure database file exists
   - Check file permissions
   - Verify database URL in environment variables

3. **API Issues:**
   - Verify TMDB API key is valid
   - Check rate limits
   - Ensure CORS is configured properly

### Debug Mode
Enable debug mode by setting:
```env
DEBUG=*
```

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code documentation
3. Open an issue on GitHub

## License

This project is for educational purposes. Ensure you have proper licenses for any content you distribute.