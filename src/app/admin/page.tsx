'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Trash2, Edit, Plus, Settings, LogOut } from 'lucide-react'
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

const categories = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Animation', 'Romance']

export default function AdminPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    poster_path: '',
    category: '',
    download_link: '',
    featured: false
  })

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      fetchMovies()
    }
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies')
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
      } else {
        // If API fails, use sample data
        setMovies([
          {
            id: "1",
            title: "Sample Movie",
            poster_path: "https://via.placeholder.com/500x750?text=Sample",
            category: "Action",
            download_link: "#",
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast({
        title: "Demo Mode",
        description: "Running in demo mode - API not available",
        variant: "destructive",
      })
    }
  }

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      fetchMovies()
      toast({
        title: "Login Successful",
        description: "Welcome to admin panel",
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid password",
        variant: "destructive",
      })
    }
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
        const newMovie = await response.json()
        toast({
          title: "Success!",
          description: editingMovie ? "Movie updated!" : "Movie added!",
        })
        
        // Add to local list for demo mode
        if (!editingMovie) {
          setMovies(prev => [newMovie, ...prev])
        } else {
          setMovies(prev => prev.map(m => m.id === editingMovie.id ? newMovie : m))
        }
        
        setIsAddDialogOpen(false)
        setEditingMovie(null)
        setFormData({
          title: '',
          poster_path: '',
          category: '',
          download_link: '',
          featured: false
        })
      } else {
        // Demo mode - create local movie
        const demoMovie = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setMovies(prev => [demoMovie, ...prev])
        toast({
          title: "Demo Mode",
          description: "Movie added in demo mode (API not available)",
        })
        
        setIsAddDialogOpen(false)
        setFormData({
          title: '',
          poster_path: '',
          category: '',
          download_link: '',
          featured: false
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      
      // Demo mode - create local movie
      const demoMovie = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setMovies(prev => [demoMovie, ...prev])
      toast({
        title: "Demo Mode",
        description: "Movie added in demo mode (Network error)",
      })
      
      setIsAddDialogOpen(false)
      setFormData({
        title: '',
        poster_path: '',
        category: '',
        download_link: '',
        featured: false
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await fetch(`/api/movies/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setMovies(prev => prev.filter(m => m.id !== id))
          toast({
            title: "Success!",
            description: "Movie deleted!",
          })
        } else {
          setMovies(prev => prev.filter(m => m.id !== id))
          toast({
            title: "Demo Mode",
            description: "Movie deleted in demo mode",
          })
        }
      } catch (error) {
        setMovies(prev => prev.filter(m => m.id !== id))
        toast({
          title: "Demo Mode",
          description: "Movie deleted in demo mode (Network error)",
        })
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-2"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Access Admin Panel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <Button
            onClick={() => {
              setIsAuthenticated(false)
              localStorage.removeItem('adminAuth')
            }}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="poster_path" className="text-white">Poster URL</Label>
                  <Input
                    id="poster_path"
                    value={formData.poster_path}
                    onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
                    className="mt-2 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
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
                  <Label htmlFor="download_link" className="text-white">Download Link</Label>
                  <Input
                    id="download_link"
                    value={formData.download_link}
                    onChange={(e) => setFormData({ ...formData, download_link: e.target.value })}
                    className="mt-2 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured" className="text-white">Featured Movie</Label>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
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
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Movies ({movies.length})</h2>
          
          {movies.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No movies found. Add your first movie!
            </div>
          ) : (
            <div className="space-y-4">
              {movies.map((movie) => (
                <div key={movie.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/500x750?text=No+Image'
                      }}
                    />
                    <div>
                      <div className="font-medium text-white">{movie.title}</div>
                      <div className="text-sm text-gray-400">{movie.category}</div>
                      {movie.featured && (
                        <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Featured</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingMovie(movie)
                        setFormData({
                          title: movie.title,
                          poster_path: movie.poster_path,
                          category: movie.category,
                          download_link: movie.download_link,
                          featured: movie.featured
                        })
                        setIsAddDialogOpen(true)
                      }}
                      className="border-gray-600 text-white hover:bg-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(movie.id)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
