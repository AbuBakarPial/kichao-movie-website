'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface Movie {
  id: string
  title: string
  poster_path: string
  category: string
  download_link: string
}

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = (e?: React.MouseEvent) => {
    // Prevent event bubbling if event is provided
    if (e) {
      e.stopPropagation()
    }
    // Redirect to the monetized download link
    window.open(movie.download_link, '_blank')
  }

  const handleCardClick = () => {
    // Make the entire card clickable for download
    handleDownload()
  }

  return (
    <motion.div
      className="relative group cursor-pointer overflow-hidden rounded-2xl"
      whileHover={{ 
        scale: 1.05,
        y: -10
      }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Poster Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <motion.div
          className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full text-xs font-medium text-white/90 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            scale: isHovered ? 1 : 0.9
          }}
          transition={{ duration: 0.3 }}
        >
          {movie.category}
        </motion.div>
        
        {/* Always visible download button for better UX */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0.8, y: 0 }}
          animate={{ 
            opacity: isHovered ? 0 : 0.8,
            y: isHovered ? 20 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={handleDownload}
            size="sm"
            className="glass-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glow-red transition-all duration-300 shadow-lg shadow-red-500/25"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </motion.div>
        
        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 glass-card flex flex-col items-center justify-center p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h3
            className="text-white font-bold text-xl mb-4 leading-tight line-clamp-3"
            initial={{ y: 30, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 30,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {movie.title}
          </motion.h3>
          
          <motion.div
            className="flex justify-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 30,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button
              onClick={handleDownload}
              className="glass-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white flex items-center gap-2 px-8 py-3 rounded-full font-medium glow-red transition-all duration-300 shadow-lg shadow-red-500/25"
            >
              <Download className="w-5 h-5" />
              Download Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Card Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent"
        animate={{
          borderColor: isHovered ? 'rgba(239, 68, 68, 0.5)' : 'transparent',
          boxShadow: isHovered ? '0 0 30px rgba(239, 68, 68, 0.3)' : 'none'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Bottom Title (always visible) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: isHovered ? 0 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="text-white font-medium text-sm line-clamp-2">
          {movie.title}
        </h4>
      </motion.div>
    </motion.div>
  )
}
