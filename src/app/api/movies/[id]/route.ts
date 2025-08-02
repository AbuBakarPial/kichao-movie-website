import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Sample movies data for demo mode
const sampleMovies = [
  {
    id: "1",
    title: "The Dark Knight",
    poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    category: "Action",
    download_link: "https://example.com/download/dark-knight",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    title: "Inception",
    poster_path: "https://image.tmdb.org/t/p/w500/9gk7adL6UxT9sGqMwYpWRLj7z1w.jpg",
    category: "Sci-Fi",
    download_link: "https://example.com/download/inception",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "The Matrix",
    poster_path: "https://image.tmdb.org/t/p/w/w5p2m0T03aG8mDC4wJ8XeT55Xw.jpg",
    category: "Sci-Fi",
    download_link: "https://example.com/download/matrix",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Pulp Fiction",
    poster_path: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0I2zPIcVkL1WcY1zWs.jpg",
    category: "Drama",
    download_link: "https://example.com/download/pulp-fiction",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "The Hangover",
    poster_path: "https://image.tmdb.org/t/p/w500/hVc4W5PhVhJjG7xZJiG5DL4N2I.jpg",
    category: "Comedy",
    download_link: "https://example.com/download/hangover",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "The Conjuring",
    poster_path: "https://image.tmdb.org/t/p/w5/wBzMyg8XyBTZ7tZejLGJf5aVFc.jpg",
    category: "Horror",
    download_link: "https://example.com/download/conjuring",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movie = await db.movie.findUnique({
      where: { id: params.id }
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(movie)
  } catch (error) {
    console.error('Database error, using sample data:', error)
    
    // If database fails, return sample movie (demo mode)
    const sampleMovie = sampleMovies.find(m => m.id === params.id)
    
    if (!sampleMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sampleMovie)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, poster_path, category, download_link, featured } = body

    const movie = await db.movie.update({
      where: { id: params.id },
      data: {
        title,
        poster_path,
        category,
        download_link,
        featured
      }
    })

    return NextResponse.json(movie)
  } catch (error) {
    console.error('Database error, updating movie in demo mode:', error)
    
    // If database fails, return a demo response
    const demoMovie = {
      id: params.id,
      title: title || 'Updated Movie',
      poster_path: poster_path || 'https://via.placeholder.com/500x750?text=No+Poster',
      category: category || 'Unknown',
      download_link: download_link || '#',
      featured: featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json(demoMovie)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.movie.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Movie deleted successfully' })
  } catch (error) {
    console.error('Database error, delete not available in demo mode:', error)
    return NextResponse.json(
      { error: 'Database not available in demo mode' },
      { status: 503 }
    )
  }
}
