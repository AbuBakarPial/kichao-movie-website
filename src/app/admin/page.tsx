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
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

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
      toast({
        title: "Login Successful!",
        description: "Welcome to the admin panel",
      })
    } else {
      toast({
        title: "Login Failed!",
        description: "Invalid password",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
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

      const data = await response.json()

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
        
        // Show success toast
        toast({
          title: "Success!",
          description: editingMovie ? "Movie updated successfully!" : "Movie added successfully!",
        })
      } else {
        // Show error toast
        toast({
          title: "Error!",
          description: data.error || "Failed to save movie",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving movie:', error)
      // Show error toast
      toast({
        title: "Error!",
        description: "Network error while saving movie",
        variant: "destructive",
      })
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

        const data = await response.json()

        if (response.ok) {
          await fetchMovies()
          // Show success toast
          toast({
            title: "Success!",
            description: "Movie deleted successfully!",
          })
        } else {
          // Show error toast
          toast({
            title: "Error!",
            description: data.error || "Failed to delete movie",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error deleting movie:', error)
        // Show error toast
        toast({
          title: "Error!",
          description: "Network error while deleting movie",
          variant: "destructive",
        })
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
        {/* Login form JSX - abbreviated for space */}
        <div className="glass-card rounded-3xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p>Enter your password to access the admin panel</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
            >
              Access Admin Panel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-gradient">
      {/* Header */}
      <header className="glass-card border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Add Movie Button */}
        <div className="mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="poster_path">Poster URL</Label>
                  <Input
                    id="poster_path"
                    value={formData.poster_path}
                    onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
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
                  <Label htmlFor="download_link">Download Link</Label>
                  <Input
                    id="download_link"
                    value={formData.download_link}
                    onChange={(e) => setFormData({ ...formData, download_link: e.target.value })}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Movie</Label>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
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
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Movies List */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Movies</h2>
          
          {loading ? (
            <div>Loading...</div>
          ) : movies.length === 0 ? (
            <div>No movies found. Add your first movie!</div>
          ) : (
            <div className="space-y-4">
              {movies.map((movie) => (
                <div key={movie.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{movie.title}</div>
                      <div className="text-sm text-gray-500">{movie.category}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(movie)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(movie.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
