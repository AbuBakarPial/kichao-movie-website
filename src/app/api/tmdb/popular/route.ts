import { fetchPopularMovies, mapTMDBToOurMovie } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    
    const response = await fetchPopularMovies(parseInt(page))
    const movies = response.results.map(mapTMDBToOurMovie)
    
    return NextResponse.json({
      movies,
      page: response.page,
      total_pages: response.total_pages,
      total_results: response.total_results
    })
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
  }
}
