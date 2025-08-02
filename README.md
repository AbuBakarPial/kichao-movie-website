# KiChao - Movie Download Site

A modern, glassmorphic movie download website built with Next.js 15, TypeScript, and Tailwind CSS. Features include a responsive movie grid, featured slider, instant search, category filtering, comprehensive admin panel, visitor tracking, and theme-aware custom cursor.

## 🚀 Features

### Frontend Features
- **Responsive Movie Grid**: Displays movies in a clean grid layout with premium glass hover effects
- **Featured Movies Slider**: Immersive 600px height slider with auto-play and manual navigation
- **Instant Search**: Real-time movie search as you type
- **Category Filtering**: Filter movies by genre (Action, Comedy, Drama, Horror, etc.)
- **Glassmorphism UI**: Advanced glass-morphism design inspired by Braxton theme
- **Theme-Aware Custom Cursor**: Animated cursor that adapts to light/dark themes
- **Monetization**: Redirect to monetized download links (download-only, no watch button)
- **Ad Placement**: Banner ad integration ready
- **Visitor Counter**: Real-time visitor tracking in footer
- **Mobile-First Design**: Fully responsive with collapsible mobile menu

### Admin Panel Features
- **Secure Authentication**: Password-protected admin access
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for movies
- **TMDB Integration**: Search and auto-populate movie data from TMDB API
- **Movie Management**: Mark movies as featured, manage categories
- **Real-time Updates**: Changes reflect immediately on the frontend
- **Visitor Statistics**: Track total visitors and site engagement

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **API Integration**: TMDB API
- **Icons**: Lucide React
- **Theme Management**: next-themes
- **State Management**: React hooks

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kichao
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # TMDB API Key (Get from https://www.themoviedb.org/settings/api)
   NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key_here"

   # Admin Password (for development - change this for production)
   ADMIN_PASSWORD="admin123"
   ```

4. **Set up the database**
   ```bash
   # Push the schema to the database
   npm run db:push
   
   # Generate Prisma client
   npm run db:generate
   
   # Seed the database with sample movies (optional)
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

The application uses a single `Movie` model with the following fields:

```prisma
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
```

## 🔧 Admin Panel

### Accessing the Admin Panel
1. Navigate to `/admin` in your browser
2. Enter the admin password (default: `admin123`)
3. You now have access to the full admin dashboard

### Admin Features
- **Add Movies**: Use the TMDB search to find movies and auto-populate data
- **Edit Movies**: Modify existing movie details
- **Delete Movies**: Remove movies from the database
- **Feature Movies**: Mark movies as featured to appear in the slider
- **Manage Categories**: Assign movies to different categories
- **Visitor Analytics**: View visitor count and engagement metrics

### TMDB API Integration
1. Get your API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Add it to your `.env.local` file
3. Use the TMDB search in the admin panel to find movies
4. Selected movies will auto-populate title and poster URL

## 🎨 UI/UX Features

### Glassmorphism Design
- Advanced glass effects with backdrop blur and transparency
- Animated gradient backgrounds with floating orbs
- Smooth transitions and hover effects
- Premium card designs with multi-layered hover states
- Consistent visual language throughout the application

### Responsive Design
- Mobile-first approach with collapsible navigation
- Touch-friendly interface elements
- Optimized for all screen sizes
- Adaptive layouts that work seamlessly across devices

### Theme Support
- Light and dark theme support
- Theme-aware custom cursor
- Smooth theme transitions
- Persistent theme preferences

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard:
     - `DATABASE_URL` (use a production database URL)
     - `NEXT_PUBLIC_TMDB_API_KEY`
     - `ADMIN_PASSWORD`

3. **Set up production database**
   - Use a production-ready database (PostgreSQL, MySQL, etc.)
   - Update your `DATABASE_URL` in Vercel environment variables
   - Run `npx prisma db push` on your production database

### Alternative Deployment Options
- **Netlify**: Connect GitHub repository, configure build settings
- **Railway**: Auto-deploy from GitHub with environment variables
- **Self-hosted**: Use Docker for containerized deployment

### Environment Variables Required for Production

```env
# Database
DATABASE_URL="your_production_database_url"

# TMDB API Key
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"

# Admin Password
ADMIN_PASSWORD="your_secure_admin_password"
```

## 🔧 Key Changes in Latest Version

### Download-Only Focus
- Removed watch buttons from movie cards
- Enhanced download button with prominent styling
- Focused on download functionality for movie distribution

### Enhanced Header
- Improved mobile responsiveness with collapsible menu
- Better search bar placement and styling
- Enhanced category filtering with glow effects
- Optimized for both desktop and mobile experiences

### Theme-Aware Cursor
- Custom cursor that adapts to light/dark themes
- Smooth animations and hover effects
- Consistent with overall design language

### Visitor Tracking
- Real-time visitor counter in footer
- Persistent visitor count across sessions
- Admin panel integration for visitor analytics

## 🎨 Customization

### Changing the Theme
- The app uses a red-themed dark background by default
- Modify the gradient classes in `src/app/page.tsx` to change colors
- Update the custom cursor color in `src/components/custom-cursor.tsx`

### Adding More Categories
- Edit the `categories` array in `src/components/header.tsx`
- Add new categories to the admin panel in `src/app/admin/page.tsx`

### Customizing Ad Placements
- Ad placeholders are located in the main page and admin panel
- Replace the placeholder divs with actual ad code (Google AdSense, Adsterra, etc.)

## 🔒 Security Notes

- The admin panel uses simple password authentication for development
- For production, implement proper authentication (NextAuth.js, JWT, etc.)
- Never commit your `.env.local` file to version control
- Use strong, unique passwords for production
- Change the default admin password before deployment

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop computers (1024px+)
- Large screens (1280px+)

## 🎯 SEO Features

- Dynamic meta tags for better search engine visibility
- Open Graph tags for social sharing
- Semantic HTML5 structure
- Proper image alt attributes
- Mobile-friendly design
- Fast loading times

## 📊 Performance Optimization

- Lazy loading for images
- Optimized bundle size
- Efficient database queries
- Smooth animations with Framer Motion
- Responsive image handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Create an issue for bugs or feature requests
- Refer to the deployment guide in `DEPLOYMENT.md`

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**