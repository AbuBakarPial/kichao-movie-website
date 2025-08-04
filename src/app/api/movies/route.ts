import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function syncWithMongoDB(movie) {
  try {
    await fetch('YOUR_LOCAL_ADMIN_URL/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SECRET_TOKEN', // Add security
      },
      body: JSON.stringify(movie),
    })
  } catch (error) {
    console.error('Failed to sync with MongoDB:', error)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    let whereClause = {}
    
    if (search) {
      whereClause = {
        ...whereClause,
        title: {
          contains: search,
          mode: 'insensitive' as const
        }
      }
    }
    
    if (category && category !== 'All') {
      whereClause = {
        ...whereClause,
        category: category
      }
    }

    const movies = await db.movie.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(movies)
  } catch (error) {
    console.error('Database error, using sample data:', error)
    
    // If database fails, return sample data (demo mode)
    let filteredMovies = sampleMovies
    
    if (search) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (category && category !== 'All') {
      filteredMovies = filteredMovies.filter(movie => movie.category === category)
    }
    
    return NextResponse.json(filteredMovies)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, poster_path, category, download_link, featured } = body

    const movie = await db.movie.create({
      data: {
        title,
        poster_path,
        category,
        download_link,
        featured: featured || false
      }
    })
    
// Sync with MongoDB
    await syncWithMongoDB(body)
    
    return NextResponse.json(movie, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 })
    
    // If database fails, create a demo movie with generated ID
    // const demoMovie = {
    //   id: Date.now().toString(),
    //   title: title || 'Untitled Movie',
    //   poster_path: poster_path || 'https://via.placeholder.com/500x750?text=No+Poster',
    //   category: category || 'Unknown',
    //   download_link: download_link || '#',
    //   featured: featured || false,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString()
    // }
    
    return NextResponse.json(demoMovie, { status: 201 })
  }
}
