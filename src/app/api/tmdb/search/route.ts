import { searchMovies, mapTMDBToOurMovie } from '@/lib/tmdb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const page = searchParams.get('page') || '1'
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }
    
    const response = await searchMovies(query, parseInt(page))
    const movies = response.results.map(mapTMDBToOurMovie)
    
    return NextResponse.json({
      movies,
      page: response.page,
      total_pages: response.total_pages,
      total_results: response.total_results
    })
  } catch (error) {
    console.error('Error searching movies:', error)
    return NextResponse.json({ error: 'Failed to search movies' }, { status: 500 })
  }
}
