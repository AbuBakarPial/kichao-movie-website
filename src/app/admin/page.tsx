'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Movie {
  id: string
  title: string
  poster_path: string
  category: string
  download_link: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    poster_path: '',
    category: '',
    download_link: '',
    featured: false
  })

  const categories = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Romance',
    'Animation',
    'Documentary',
    'Fantasy'
  ]

  useEffect(() => {
    if (isAuthenticated) {
      fetchMovies()
    }
  }, [isAuthenticated])

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies')
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
      } else {
        // If API fails, try to get from localStorage as fallback
        const localMovies = localStorage.getItem('adminMovies')
        if (localMovies) {
          setMovies(JSON.parse(localMovies))
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      // Fallback to localStorage
      const localMovies = localStorage.getItem('adminMovies')
      if (localMovies) {
        setMovies(JSON.parse(localMovies))
      }
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      toast.success('Login successful!')
    } else {
      toast.error('Invalid password!')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      poster_path: movie.poster_path,
      category: movie.category,
      download_link: movie.download_link,
      featured: movie.featured
    })
  }

  const handleCancelEdit = () => {
    setEditingMovie(null)
    setFormData({
      title: '',
      poster_path: '',
      category: '',
      download_link: '',
      featured: false
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingMovie) {
        // Update existing movie
        const response = await fetch(`/api/movies/${editingMovie.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const updatedMovie = await response.json()
          
          // Update local state
          setMovies(prev => 
            prev.map(movie => 
              movie.id === editingMovie.id ? updatedMovie : movie
            )
          )
          
          // Update localStorage
          const localMovies = movies.map(movie => 
            movie.id === editingMovie.id ? { ...movie, ...formData } : movie
          )
          localStorage.setItem('adminMovies', JSON.stringify(localMovies))
          
          // Reset form
          handleCancelEdit()
          
          toast.success('Movie updated successfully!')
        } else {
          // If API fails, update local state only
          setMovies(prev => 
            prev.map(movie => 
              movie.id === editingMovie.id ? { ...movie, ...formData } : movie
            )
          )
          
          // Update localStorage
          const localMovies = movies.map(movie => 
            movie.id === editingMovie.id ? { ...movie, ...formData } : movie
          )
          localStorage.setItem('adminMovies', JSON.stringify(localMovies))
          
          // Reset form
          handleCancelEdit()
          
          toast.success('Movie updated locally!')
        }
      } else {
        // Add new movie
        const response = await fetch('/api/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const newMovie = await response.json()
          
          // Update local state
          setMovies(prev => [newMovie, ...prev])
          
          // Save to localStorage as backup
          const localMovies = [...movies, newMovie]
          localStorage.setItem('adminMovies', JSON.stringify(localMovies))
          
          // Reset form
          setFormData({
            title: '',
            poster_path: '',
            category: '',
            download_link: '',
            featured: false
          })
          
          toast.success('Movie added successfully!')
        } else {
          // If API fails, create local movie
          const localMovie: Movie = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          // Update local state
          setMovies(prev => [localMovie, ...prev])
          
          // Save to localStorage
          const localMovies = [...movies, localMovie]
          localStorage.setItem('adminMovies', JSON.stringify(localMovies))
          
          // Reset form
          setFormData({
            title: '',
            poster_path: '',
            category: '',
            download_link: '',
            featured: false
          })
          
          toast.success('Movie added locally (API unavailable)!')
        }
      }
    } catch (error) {
      console.error('Error saving movie:', error)
      
      if (editingMovie) {
        // Update local movie as fallback
        setMovies(prev => 
          prev.map(movie => 
            movie.id === editingMovie.id ? { ...movie, ...formData } : movie
          )
        )
        
        // Update localStorage
        const localMovies = movies.map(movie => 
          movie.id === editingMovie.id ? { ...movie, ...formData } : movie
        )
        localStorage.setItem('adminMovies', JSON.stringify(localMovies))
        
        // Reset form
        handleCancelEdit()
        
        toast.success('Movie updated locally (network error)!')
      } else {
        // Create local movie as fallback
        const localMovie: Movie = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        // Update local state
        setMovies(prev => [localMovie, ...prev])
        
        // Save to localStorage
        const localMovies = [...movies, localMovie]
        localStorage.setItem('adminMovies', JSON.stringify(localMovies))
        
        // Reset form
        setFormData({
          title: '',
          poster_path: '',
          category: '',
          download_link: '',
          featured: false
        })
        
        toast.success('Movie added locally (network error)!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMovies(prev => prev.filter(movie => movie.id !== id))
        
        // Update localStorage
        const localMovies = movies.filter(movie => movie.id !== id)
        localStorage.setItem('adminMovies', JSON.stringify(localMovies))
        
        toast.success('Movie deleted successfully!')
      } else {
        // If API fails, delete from local state only
        setMovies(prev => prev.filter(movie => movie.id !== id))
        
        // Update localStorage
        const localMovies = movies.filter(movie => movie.id !== id)
        localStorage.setItem('adminMovies', JSON.stringify(localMovies))
        
        toast.success('Movie deleted locally!')
      }
    } catch (error) {
      console.error('Error deleting movie:', error)
      
      // Delete from local state as fallback
      setMovies(prev => prev.filter(movie => movie.id !== id))
      
      // Update localStorage
      const localMovies = movies.filter(movie => movie.id !== id)
      localStorage.setItem('adminMovies', JSON.stringify(localMovies))
      
      toast.success('Movie deleted locally!')
    }
  }

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured }),
      })

      if (response.ok) {
        setMovies(prev => 
          prev.map(movie => 
            movie.id === id ? { ...movie, featured } : movie
          )
        )
        
        // Update localStorage
        const localMovies = movies.map(movie => 
          movie.id === id ? { ...movie, featured } : movie
        )
        localStorage.setItem('adminMovies', JSON.stringify(localMovies))
        
        toast.success(`Movie ${featured ? 'featured' : 'unfeatured'}!`)
      } else {
        // If API fails, update local state only
        setMovies(prev => 
          prev.map(movie => 
            movie.id === id ? { ...movie, featured } : movie
          )
        )
        
        // Update localStorage
        const localMovies = movies.map(movie => 
          movie.id === id ? { ...movie, featured } : movie
        )
        localStorage.setItem('adminMovies', JSON.stringify(localMovies))
        
        toast.success(`Movie ${featured ? 'featured' : 'unfeatured'} locally!`)
      }
    } catch (error) {
      console.error('Error updating movie:', error)
      
      // Update local state as fallback
      setMovies(prev => 
        prev.map(movie => 
          movie.id === id ? { ...movie, featured } : movie
        )
      )
      
      // Update localStorage
      const localMovies = movies.map(movie => 
        movie.id === id ? { ...movie, featured } : movie
      )
      localStorage.setItem('adminMovies', JSON.stringify(localMovies))
      
      toast.success(`Movie ${featured ? 'featured' : 'unfeatured'} locally!`)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl max-w-md w-full mx-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-gradient">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="glass-button px-6 py-2 rounded-full text-white/80 hover:text-white border-white/20 hover:border-white/40 transition-all duration-300"
            >
              Logout
            </button>
          </div>

          {/* Add/Edit Movie Form */}
          <div className="glass-card p-6 rounded-3xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingMovie ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Movie title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="poster_path" className="block text-sm font-medium text-gray-300 mb-2">
                  Poster URL *
                </label>
                <input
                  type="url"
                  id="poster_path"
                  name="poster_path"
                  value={formData.poster_path}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/poster.jpg"
                  required
                />
              </div>
              <div>
                <label htmlFor="download_link" className="block text-sm font-medium text-gray-300 mb-2">
                  Download Link *
                </label>
                <input
                  type="url"
                  id="download_link"
                  name="download_link"
                  value={formData.download_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/download"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-300">
                  Featured Movie
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (editingMovie ? 'Updating Movie...' : 'Adding Movie...') : (editingMovie ? 'Update Movie' : 'Add Movie')}
                </button>
                {editingMovie && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Movies List */}
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">Manage Movies ({movies.length})</h2>
            {movies.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No movies added yet.</p>
            ) : (
              <div className="space-y-4">
                {movies.map((movie) => (
                  <div key={movie.id} className="glass-card p-4 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                        <p className="text-gray-400">{movie.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            movie.featured 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {movie.featured ? 'Featured' : 'Regular'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-all duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(movie.id, !movie.featured)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                            movie.featured
                              ? 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {movie.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
