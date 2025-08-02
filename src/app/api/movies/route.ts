import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    console.error('Error fetching movies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
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

    return NextResponse.json(movie, { status: 201 })
  } catch (error) {
    console.error('Error creating movie:', error)
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    )
  }
}