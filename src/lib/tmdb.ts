const TMDB_API_KEY = '066f284746f4485dbf17cbd5547f981b'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export interface TMDBMovie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  original_language: string
  original_title: string
  adult: boolean
}

export interface TMDBResponse {
  page: number
  results: TMDBMovie[]
  total_results: number
  total_pages: number
}

export interface TMDBGenre {
  id: number
  name: string
}

// Map TMDB genres to our categories
const genreMap: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

export async function fetchPopularMovies(page: number = 1): Promise<TMDBResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    throw error
  }
}

export async function fetchTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    throw error
  }
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error searching movies:', error)
    throw error
  }
}

export async function fetchMovieDetails(id: number): Promise<TMDBMovie & { genres: TMDBGenre[] }> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching movie details:', error)
    throw error
  }
}

export function getPosterUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Poster'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function mapTMDBToOurMovie(tmdbMovie: TMDBMovie): any {
  // Get the primary genre from genre_ids
  const primaryGenreId = tmdbMovie.genre_ids[0]
  const category = genreMap[primaryGenreId] || 'Unknown'

  return {
    tmdb_id: tmdbMovie.id,
    title: tmdbMovie.title,
    poster_path: getPosterUrl(tmdbMovie.poster_path),
    category: category,
    download_link: '', // Empty by default, to be filled by admin
    featured: false, // Can be set by admin
    overview: tmdbMovie.overview,
    release_date: tmdbMovie.release_date,
    vote_average: tmdbMovie.vote_average,
    vote_count: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity,
    original_language: tmdbMovie.original_language,
    adult: tmdbMovie.adult,
    from_tmdb: true // Flag to identify TMDB movies
  }
}

export function getOurCategories(): string[] {
  return [...new Set(Object.values(genreMap))]
}
