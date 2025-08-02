'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MovieCard from './movie-card'

interface Movie {
  id: string
  title: string
  poster_path: string
  category: string
  download_link: string
}

interface FeaturedSliderProps {
  movies: Movie[]
}

export default function FeaturedSlider({ movies }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, movies.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className="relative w-full py-12 mt-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Featured Movies
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the most popular and trending movies handpicked for you
          </p>
        </motion.div>

        <div className="relative overflow-hidden rounded-3xl">
          {/* Main Featured Movie */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative h-[500px] md:h-[600px] w-full group"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {/* Background Image */}
              <img
                src={movies[currentIndex].poster_path}
                alt={movies[currentIndex].title}
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <motion.div
                  className="max-w-4xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {/* Category Badge */}
                  <div className="glass-card inline-block px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                    <span className="text-white/90 text-sm font-medium">
                      {movies[currentIndex].category}
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {movies[currentIndex].title}
                  </h3>
                  
                  <p className="text-gray-300 mb-8 text-lg md:text-xl max-w-2xl leading-relaxed">
                    Experience the ultimate cinematic journey with this masterpiece that has captivated audiences worldwide.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button
                      onClick={() => window.open(movies[currentIndex].download_link, '_blank')}
                      className="glass-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-8 py-4 text-lg flex items-center gap-3 rounded-full font-semibold glow-red transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="w-5 h-5" />
                      Watch & Download
                    </Button>
                    
                    <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">9.2</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-card text-white border-white/20 hover:bg-white/10 z-20 rounded-full w-12 h-12 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-card text-white border-white/20 hover:bg-white/10 z-20 rounded-full w-12 h-12 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {movies.slice(0, Math.min(movies.length, 8)).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional Featured Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-12">
          {movies.slice(1, 6).map((movie, index) => (
            <motion.div
              key={movie.id}
              className="group cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                y: -10
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(index + 1)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="glass-card w-12 h-12 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-white font-medium text-sm line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                  {movie.title}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {movie.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
    </section>
  )
}