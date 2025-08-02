'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Film, Menu, X } from 'lucide-react'

interface HeaderProps {
  onSearch: (query: string) => void
  onCategoryFilter: (category: string) => void
  currentCategory: string
}

const categories = [
  'All',
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Romance'
]

export default function Header({ onSearch, onCategoryFilter, currentCategory }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleCategoryFilter = (category: string) => {
    onCategoryFilter(category)
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-card border-b border-white/10 backdrop-blur-xl' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-4 md:py-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <Film className="w-8 h-8 md:w-10 md:h-10 text-red-500 group-hover:text-red-400 transition-colors duration-300" />
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg group-hover:bg-red-400/30 transition-all duration-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-pink-400 transition-all duration-300">
              KiChao
            </h1>
          </motion.div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:text-red-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>

          {/* Desktop Search Bar */}
          <motion.div
            className="hidden md:flex relative flex-1 max-w-md mx-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              className="glass-input pl-12 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-full"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </div>

        {/* Mobile Search Bar */}
        <motion.div
          className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              className="glass-input pl-12 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-full w-full"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className={`hidden md:flex flex-wrap gap-3 mt-6 justify-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <Button
                variant={currentCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className={`glass-button rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  currentCategory === category
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-transparent glow-red shadow-lg shadow-red-500/25'
                    : 'text-white/80 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/10'
                }`}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Category Filters */}
        <motion.div
          className={`md:hidden grid grid-cols-2 gap-2 mt-4 ${isMenuOpen ? 'grid' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={currentCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(category)}
              className={`glass-button rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                currentCategory === category
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-transparent'
                  : 'text-white/80 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/10'
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom Border Glow */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent transition-opacity duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`} />
    </motion.header>
  )
}