'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import FeaturedSlider from '@/components/featured-slider'
import MovieCard from '@/components/movie-card'
import VisitorCount from '@/components/visitor-count'

interface Movie {
  id: string
  title: string
  poster_path: string
  category: string
  download_link: string
  featured: boolean
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovies()
  }, [])

  useEffect(() => {
    filterMovies()
  }, [movies, searchQuery, selectedCategory])

const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies')
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
        
        // Set featured movies
        const featured = data.filter((movie: Movie) => movie.featured)
        setFeaturedMovies(featured)
      } else {
        // If API fails, try localStorage
        const localMovies = localStorage.getItem('adminMovies')
        if (localMovies) {
          const data = JSON.parse(localMovies)
          setMovies(data)
          
          // Set featured movies
          const featured = data.filter((movie: Movie) => movie.featured)
          setFeaturedMovies(featured)
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      // Fallback to localStorage
      const localMovies = localStorage.getItem('adminMovies')
      if (localMovies) {
        const data = JSON.parse(localMovies)
        setMovies(data)
        
        // Set featured movies
        const featured = data.filter((movie: Movie) => movie.featured)
        setFeaturedMovies(featured)
      }
    } finally {
      setLoading(false)
    }
  }

  const filterMovies = () => {
    let filtered = movies

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(movie => movie.category === selectedCategory)
    }

    setFilteredMovies(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen animated-gradient">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/8 via-black/5 to-transparent" />
        
        {/* ENHANCED Dark Vibrant Electric Particles */}
        <div className="absolute top-10 left-5 w-96 h-96 bg-gradient-to-br from-green-900/15 via-emerald-900/12 to-orange-900/10 rounded-full blur-3xl electric-particle" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-5 w-80 h-80 bg-gradient-to-tl from-orange-900/15 via-green-900/12 to-black/10 rounded-full blur-3xl electric-particle" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-purple-900/15 via-violet-900/12 to-black/10 rounded-full blur-3xl electric-particle" style={{ animationDelay: '6s' }} />
        
        {/* ENHANCED Dark Wave Elements */}
        <div className="absolute top-20 right-20 w-88 h-88 bg-gradient-to-r from-black/18 via-green-900/15 via-orange-900/12 via-purple-900/10 to-violet-900/8 rounded-full blur-3xl rainbow-wave" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-20 w-76 h-76 bg-gradient-to-l from-purple-900/18 via-black/15 via-green-900/12 via-orange-900/10 to-emerald-900/8 rounded-full blur-3xl rainbow-wave" style={{ animationDelay: '8s' }} />
        
        {/* ENHANCED Dark Burst Elements */}
        <div className="absolute top-1/4 left-10 w-84 h-84 bg-gradient-to-br from-green-900/20 to-purple-900/15 rounded-full blur-3xl hyper-burst" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-tl from-orange-900/20 to-emerald-900/15 rounded-full blur-3xl hyper-burst" style={{ animationDelay: '4s' }} />
        
        {/* ENHANCED Dark Float Giants */}
        <div className="absolute top-1/3 right-1/4 w-92 h-92 bg-gradient-to-tr from-orange-900/18 via-green-900/15 via-purple-900/12 rounded-full blur-3xl quantum-float" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-88 h-88 bg-gradient-to-br from-black/18 via-purple-900/15 via-violet-900/12 rounded-full blur-3xl quantum-float" style={{ animationDelay: '10s' }} />
        
        {/* ENHANCED Dark Glow Elements */}
        <div className="absolute top-1/6 left-1/3 w-86 h-86 bg-gradient-to-r from-green-900/22 via-purple-900/18 via-orange-900/15 rounded-full blur-3xl super-wave" style={{ animationDelay: '7s' }} />
        <div className="absolute bottom-1/6 right-1/3 w-82 h-82 bg-gradient-to-l from-purple-900/22 via-black/18 via-violet-900/15 rounded-full blur-3xl super-wave" style={{ animationDelay: '12s' }} />
        
        {/* ENHANCED Dark Particle Swarms */}
        <div className="absolute top-2/5 left-2/5 w-78 h-78 bg-gradient-to-b from-green-800/20 via-purple-900/18 to-orange-900/15 rounded-full blur-3xl vibrant-particle" style={{ animationDelay: '9s' }} />
        <div className="absolute bottom-2/5 right-2/5 w-74 h-74 bg-gradient-to-t from-black/20 via-orange-900/18 via-violet-900/15 rounded-full blur-3xl vibrant-particle" style={{ animationDelay: '15s' }} />
        
        {/* ENHANCED Large Moving Elements */}
        <div className="absolute top-3/4 left-1/6 w-94 h-94 bg-gradient-to-r from-purple-900/16 via-green-900/13 via-orange-900/10 rounded-full blur-3xl quantum-float" style={{ animationDelay: '11s' }} />
        <div className="absolute bottom-3/4 right-1/6 w-90 h-90 bg-gradient-to-l from-emerald-900/16 via-black/13 via-violet-900/10 rounded-full blur-3xl quantum-float" style={{ animationDelay: '17s' }} />
        
        {/* ENHANCED Dark Vibrant Circles */}
        <div className="absolute top-5 right-5 w-16 h-16 bg-gradient-to-r from-green-900/30 to-purple-900/25 rounded-full blur-xl hyper-burst" />
        <div className="absolute bottom-5 left-5 w-14 h-14 bg-gradient-to-l from-orange-900/30 to-emerald-900/25 rounded-full blur-xl hyper-burst" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/4 right-1/4 w-18 h-18 bg-gradient-to-br from-orange-900/28 to-green-900/22 rounded-full blur-2xl electric-particle" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-gradient-to-tl from-purple-900/28 via-violet-900/22 rounded-full blur-2xl electric-particle" style={{ animationDelay: '9s' }} />
        
        {/* ENHANCED Small Dots */}
        <div className="absolute top-20 left-20 w-6 h-6 bg-green-900/40 rounded-full blur-lg vibrant-particle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-32 right-32 w-8 h-8 bg-orange-900/35 rounded-full blur-lg vibrant-particle" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-20 left-32 w-7 h-7 bg-emerald-900/45 rounded-full blur-lg vibrant-particle" style={{ animationDelay: '8s' }} />
        <div className="absolute bottom-32 right-20 w-9 h-9 bg-purple-900/30 rounded-full blur-lg vibrant-particle" style={{ animationDelay: '11s' }} />
        
        {/* ENHANCED Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-grid-white/[0.03] bg-[length:30px_30px]" />
        </div>
      </div>

      {/* Header */}
      <Header
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        currentCategory={selectedCategory}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Featured Slider */}
        {featuredMovies.length > 0 && (
          <FeaturedSlider movies={featuredMovies} />
        )}

        {/* Movies Grid */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
                {selectedCategory === 'All' ? 'All Movies' : selectedCategory + ' Movies'}
                {searchQuery && <span className="text-red-400"> - Search: "{searchQuery}"</span>}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full" />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="aspect-[2/3] glass-card rounded-2xl animate-pulse"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  />
                ))}
              </div>
            ) : filteredMovies.length === 0 ? (
              <motion.div
                className="text-center py-16 glass-card rounded-3xl p-12 max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">No Movies Found</h3>
                <p className="text-gray-300 text-lg">
                  Try a different search term or browse another category.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.1 * index, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </section>

        {/* Ad Placement - Banner Ad */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            className="glass-card rounded-3xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-gray-400 mb-6 text-sm font-medium uppercase tracking-wider">
              Advertisement
            </p>
            <div className="glass-card rounded-2xl h-32 flex items-center justify-center border border-white/10">
              <span className="text-gray-500">Ad Banner Placeholder</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass-card border-t border-white/10 py-12 mt-16">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-gray-400">
                  © 2024 KiChao. All rights reserved.
                </p>
                
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                <VisitorCount />
                
                <div className="flex items-center gap-4">
                  <a 
                    href="/admin" 
                    className="glass-button px-6 py-2 rounded-full text-white/80 hover:text-white border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    Admin Access
                  </a>
                  
                  <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">Live</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </footer>
    </div>
  )
}
