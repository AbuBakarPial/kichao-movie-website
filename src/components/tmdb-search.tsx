'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Film } from 'lucide-react'

interface TMDBMovie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  vote_average: number
}

interface TMDBSearchProps {
  onSelectMovie: (movie: { title: string; poster_path: string }) => void
}

export default function TMDBSearch({ onSelectMovie }: TMDBSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        searchMovies()
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const searchMovies = async () => {
    setLoading(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
      if (!apiKey) {
        console.error('TMDB API key not found')
        return
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      
      if (data.results) {
        setResults(data.results.slice(0, 10))
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error searching TMDB:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMovie = (movie: TMDBMovie) => {
    onSelectMovie({
      title: movie.title,
      poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    })
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search TMDB for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {results.map((movie) => (
            <motion.div
              key={movie.id}
              className="p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0"
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={() => handleSelectMovie(movie)}
            >
              <div className="flex gap-3">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">
                    <Film className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-white font-medium">{movie.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {new Date(movie.release_date).getFullYear()} • ⭐ {movie.vote_average}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {movie.overview}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {showResults && results.length === 0 && !loading && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50 p-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-400">No movies found</p>
        </motion.div>
      )}
    </div>
  )
}