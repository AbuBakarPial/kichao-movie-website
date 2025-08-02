import { db } from '@/lib/db'

async function main() {
  const sampleMovies = [
    {
      title: "The Dark Knight",
      poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0wh.jpg",
      category: "Action",
      download_link: "https://example.com/download/dark-knight",
      featured: true
    },
    {
      title: "Inception",
      poster_path: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      category: "Sci-Fi",
      download_link: "https://example.com/download/inception",
      featured: true
    },
    {
      title: "The Matrix",
      poster_path: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      category: "Sci-Fi",
      download_link: "https://example.com/download/matrix",
      featured: false
    },
    {
      title: "Pulp Fiction",
      poster_path: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      category: "Drama",
      download_link: "https://example.com/download/pulp-fiction",
      featured: false
    },
    {
      title: "The Shawshank Redemption",
      poster_path: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      category: "Drama",
      download_link: "https://example.com/download/shawshank",
      featured: true
    },
    {
      title: "The Godfather",
      poster_path: "https://image.tmdb.org/t/p/w500/3hofbh3hrdPq2X2WtL5f7XqEOnA.jpg",
      category: "Drama",
      download_link: "https://example.com/download/godfather",
      featured: false
    },
    {
      title: "Fight Club",
      poster_path: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B127I0p2aPMGVVkO.jpg",
      category: "Drama",
      download_link: "https://example.com/download/fight-club",
      featured: false
    },
    {
      title: "Forrest Gump",
      poster_path: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLWEcSy3kRtlp.jpg",
      category: "Drama",
      download_link: "https://example.com/download/forrest-gump",
      featured: false
    },
    {
      title: "The Hangover",
      poster_path: "https://image.tmdb.org/t/p/w500/5WsmDdKpd2c8b9plXKj4F2cP9xk.jpg",
      category: "Comedy",
      download_link: "https://example.com/download/hangover",
      featured: false
    },
    {
      title: "The Conjuring",
      poster_path: "https://image.tmdb.org/t/p/w500/3qo0qK72Y2ptvvTGW4u7R5jrU9P.jpg",
      category: "Horror",
      download_link: "https://example.com/download/conjuring",
      featured: true
    }
  ]

  console.log('Seeding database with sample movies...')

  for (const movie of sampleMovies) {
    await db.movie.create({
      data: movie
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })