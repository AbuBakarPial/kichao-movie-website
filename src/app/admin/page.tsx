'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Trash2, Edit, Plus, Search, Film, Settings, LogOut } from 'lucide-react'
import TMDBSearch from '@/components/tmdb-search'

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

const categories = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Romance'
]

export default function AdminPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    poster_path: '',
    category: '',
    download_link: '',
    featured: false
  })

  useEffect(() => {
    // Check if admin is authenticated (in real app, use proper auth)
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      fetchMovies()
    }
  }, [])

  useEffect(() => {
    filterMovies()
  }, [movies, searchQuery])

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies')
      const data = await response.json()
      setMovies(data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMovies = () => {
    let filtered = movies

    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredMovies(filtered)
  }

  const handleLogin = () => {
    // Simple password authentication (in real app, use proper auth)
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      fetchMovies()
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  const handleTMDBSelect = (movieData: { title: string; poster_path: string }) => {
    setFormData({
      ...formData,
      title: movieData.title,
      poster_path: movieData.poster_path
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingMovie ? `/api/movies/${editingMovie.id}` : '/api/movies'
      const method = editingMovie ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchMovies()
        setIsAddDialogOpen(false)
        setEditingMovie(null)
        setFormData({
          title: '',
          poster_path: '',
          category: '',
          download_link: '',
          featured: false
        })
      }
    } catch (error) {
      console.error('Error saving movie:', error)
    }
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
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await fetch(`/api/movies/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchMovies()
        }
      } catch (error) {
        console.error('Error deleting movie:', error)
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

        <motion.div
          className="glass-card rounded-3xl p-8 w-full max-w-md relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Settings className="w-8 h-8 text-green-500" />
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Admin Login
              </h1>
            </div>
            <p className="text-gray-400">Enter your password to access the admin panel</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="glass-input mt-2 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full glass-button bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium py-3"
            >
              Access Admin Panel
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-gradient">
      {/* Enhanced Background Effects */}
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
      <header className="glass-card border-b border-white/10 p-6 relative z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Settings className="w-8 h-8 text-red-500" />
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-gray-400 text-sm">Manage your movie collection</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="glass-button border-white/20 text-white/80 hover:text-white hover:border-white/40 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold text-white mb-2">{movies.length}</div>
            <div className="text-gray-400 text-sm">Total Movies</div>
          </motion.div>
          
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-bold text-red-400 mb-2">
              {movies.filter(m => m.featured).length}
            </div>
            <div className="text-gray-400 text-sm">Featured</div>
          </motion.div>
          
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {new Set(movies.map(m => m.category)).size}
            </div>
            <div className="text-gray-400 text-sm">Categories</div>
          </motion.div>
          
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {filteredMovies.length}
            </div>
            <div className="text-gray-400 text-sm">Filtered</div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-12 pr-4 py-3 text-white placeholder:text-gray-400 rounded-full"
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="glass-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-6 py-3 rounded-full font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-white font-medium mb-2 block">Search TMDB</Label>
                  <TMDBSearch onSelectMovie={handleTMDBSelect} />
                </div>
                
                <div>
                  <Label htmlFor="title" className="text-white font-medium">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass-input mt-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="poster_path" className="text-white font-medium">Poster URL</Label>
                  <Input
                    id="poster_path"
                    value={formData.poster_path}
                    onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
                    className="glass-input mt-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-white font-medium">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="glass-input mt-2 text-white border-white/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="download_link" className="text-white font-medium">Download Link</Label>
                  <Input
                    id="download_link"
                    value={formData.download_link}
                    onChange={(e) => setFormData({ ...formData, download_link: e.target.value })}
                    className="glass-input mt-2 text-white"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured" className="text-white font-medium">Featured Movie</Label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="glass-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white flex-1">
                    {editingMovie ? 'Update Movie' : 'Add Movie'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      setEditingMovie(null)
                      setFormData({
                        title: '',
                        poster_path: '',
                        category: '',
                        download_link: '',
                        featured: false
                      })
                    }}
                    className="glass-button border-white/20 text-white/80 hover:text-white hover:border-white/40"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Movies Table */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Film className="w-5 h-5 text-red-400" />
              Movies ({filteredMovies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <p className="text-gray-400 mt-4">Loading movies...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white">Poster</TableHead>
                      <TableHead className="text-white">Title</TableHead>
                      <TableHead className="text-white">Category</TableHead>
                      <TableHead className="text-white">Featured</TableHead>
                      <TableHead className="text-white">Created</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovies.map((movie) => (
                      <TableRow key={movie.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <img
                            src={movie.poster_path}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="text-white font-medium">{movie.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="glass-card">
                            {movie.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={movie.featured ? "default" : "outline"} className={
                            movie.featured 
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" 
                              : "glass-card text-white/80 border-white/20"
                          }>
                            {movie.featured ? "Featured" : "Regular"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(movie.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(movie)}
                              className="glass-button border-white/20 text-white/80 hover:text-white hover:border-white/40"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(movie.id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}