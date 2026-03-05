import type { MovieData, SentimentAnalysis } from '@/types/movie'
import { analyzeSentiment } from '@/services/geminiService'

// Environment variables
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'your-omdb-api-key'

/**
 * Fetch movie data from OMDB API
 */
export async function fetchMovieData(imdbId: string): Promise<MovieData | null> {
  try {
    const apiKey = OMDB_API_KEY;
    
    // Demo mode with mock data
    if (!apiKey || apiKey === 'demo' || apiKey === 'your-omdb-api-key') {
      return getMockMovieData(imdbId);
    }
    
    const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}&plot=full`
    
    console.log('OMDB API URL:', url.replace(apiKey, '[HIDDEN]'))
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.Response === 'False') {
      console.error('OMDB API Error:', data.Error)
      return null
    }

    // Transform OMDB response to our MovieData type
    const movieData: MovieData = {
      imdbId: data.imdbID,
      title: data.Title,
      year: data.Year,
      rated: data.Rated,
      released: data.Released,
      runtime: data.Runtime,
      genre: data.Genre,
      director: data.Director,
      writer: data.Writer,
      actors: data.Actors,
      plot: data.Plot,
      language: data.Language,
      country: data.Country,
      awards: data.Awards,
      poster: data.Poster && data.Poster !== 'N/A' ? data.Poster.replace('http://', 'https://') : data.Poster,
      ratings: data.Ratings || [],
      metascore: data.Metascore,
      imdbRating: data.imdbRating,
      imdbVotes: data.imdbVotes,
      type: data.Type,
      dvd: data.DVD,
      boxOffice: data.BoxOffice,
      production: data.Production,
      website: data.Website,
      response: data.Response
    }

    return movieData
  } catch (error) {
    console.error('Error fetching movie data:', error)
    throw error
  }
}

/**
 * Analyze movie sentiment using Gemini AI
 */
export async function analyzeMovieSentiment(movieData: MovieData): Promise<SentimentAnalysis> {
  try {
    const sentimentAnalysis = await analyzeSentiment(
      movieData.title,
      movieData.plot,
      movieData.genre,
      movieData.actors,
      movieData.year
    );
    
    return sentimentAnalysis;
  } catch (error) {
    console.error('Error in AI sentiment analysis:', error)
    // Fallback to mock analysis
    return mockSentimentAnalysis(movieData);
  }
}

/**
 * Get movie data with sentiment analysis
 */
export async function getMovieWithSentiment(imdbId: string): Promise<{
  movie: MovieData;
  sentimentAnalysis: SentimentAnalysis;
} | null> {
  try {
    const movie = await fetchMovieData(imdbId);
    if (!movie) return null;
    
    const sentimentAnalysis = await analyzeMovieSentiment(movie);
    
    return {
      movie,
      sentimentAnalysis
    };
  } catch (error) {
    console.error('Error getting movie with sentiment:', error);
    throw error;
  }
}

/**
 * Generate mock sentiment analysis when AI is unavailable
 */
export function mockSentimentAnalysis(movieData: MovieData): SentimentAnalysis {
  const imdbRating = parseFloat(movieData.imdbRating || '0')
  const metascore = parseInt(movieData.metascore || '0')
  
  // Determine sentiment based on ratings
  let overallSentiment: 'positive' | 'negative' | 'mixed' = 'mixed'
  let sentimentScore = 0
  
  if (imdbRating >= 8.0 || metascore >= 80) {
    overallSentiment = 'positive'
    sentimentScore = 0.8
  } else if (imdbRating >= 7.0 || metascore >= 60) {
    overallSentiment = 'positive'
    sentimentScore = 0.5
  } else if (imdbRating >= 5.5 || metascore >= 40) {
    overallSentiment = 'mixed'
    sentimentScore = 0.1
  } else {
    overallSentiment = 'negative'
    sentimentScore = -0.5
  }

  // Generate genre-based themes and aspects
  const genres = movieData.genre.toLowerCase()
  const keyThemes: string[] = []
  const positiveAspects: string[] = []
  const negativeAspects: string[] = []

  // Add genre-specific themes
  if (genres.includes('action')) keyThemes.push('Action Sequences', 'Visual Effects')
  if (genres.includes('drama')) keyThemes.push('Character Development', 'Emotional Depth')
  if (genres.includes('comedy')) keyThemes.push('Humor', 'Entertainment Value')
  if (genres.includes('horror')) keyThemes.push('Suspense', 'Atmosphere')
  if (genres.includes('sci-fi')) keyThemes.push('Innovation', 'World Building')
  if (genres.includes('romance')) keyThemes.push('Chemistry', 'Emotional Connection')

  // Add rating-based aspects
  if (overallSentiment === 'positive') {
    positiveAspects.push('Strong performances', 'Engaging storyline', 'High production value')
    if (imdbRating >= 8.5) positiveAspects.push('Exceptional direction', 'Memorable characters')
  } else if (overallSentiment === 'negative') {
    negativeAspects.push('Weak plot', 'Poor execution', 'Limited appeal')
    if (imdbRating < 5.0) negativeAspects.push('Technical issues', 'Poor acting')
  } else {
    positiveAspects.push('Some strong elements', 'Decent production')
    negativeAspects.push('Uneven pacing', 'Mixed execution')
  }

  // Generate insights based on movie data
  const insights = generateInsights(movieData, overallSentiment, imdbRating)
  
  return {
    overallSentiment,
    sentimentScore,
    summary: generateSummary(movieData, overallSentiment, imdbRating),
    keyThemes: keyThemes.slice(0, 5),
    positiveAspects: positiveAspects.slice(0, 4),
    negativeAspects: negativeAspects.slice(0, 3),
    audienceInsights: insights,
    reviewCount: Math.floor(Math.random() * 5000) + 1000,
    confidence: 0.75
  }
}

function generateSummary(movieData: MovieData, sentiment: string, rating: number): string {
  const title = movieData.title
  
  if (sentiment === 'positive') {
    if (rating >= 8.5) {
      return `${title} has received overwhelmingly positive reception from audiences, with viewers praising its exceptional quality and memorable impact.`
    } else {
      return `${title} enjoys positive audience reception, with viewers generally appreciating its strengths and entertainment value.`
    }
  } else if (sentiment === 'negative') {
    return `${title} has faced criticism from audiences, with mixed to negative reactions highlighting various concerns about execution and appeal.`
  } else {
    return `${title} has received mixed reactions from audiences, with viewers divided on its merits and showing varied opinions about different aspects.`
  }
}

function generateInsights(movieData: MovieData, sentiment: string, rating: number): string {
  const insights = []
  
  if (movieData.awards && movieData.awards !== 'N/A') {
    insights.push('The film\'s critical recognition has influenced positive audience perception.')
  }
  
  if (movieData.genre.includes('Action')) {
    insights.push('Action movie audiences tend to focus on spectacle and pacing in their reviews.')
  }
  
  if (rating >= 8.0) {
    insights.push('High ratings suggest strong word-of-mouth recommendations among viewers.')
  } else if (rating < 6.0) {
    insights.push('Lower ratings indicate potential disconnect between audience expectations and delivery.')
  }
  
  if (movieData.actors.includes('Academy Award')) {
    insights.push('Star power and established talent contribute to audience interest and expectations.')
  }
  
  return insights.join(' ') || 'Analysis based on general audience patterns and movie characteristics.'
}

/**
 * Mock movie data for demo purposes
 */
function getMockMovieData(imdbId: string): MovieData {
  const mockMovies: { [key: string]: MovieData } = {
    'tt0133093': {
      imdbId: 'tt0133093',
      title: 'The Matrix',
      year: '1999',
      rated: 'R',
      released: '31 Mar 1999',
      runtime: '136 min',
      genre: 'Action, Sci-Fi',
      director: 'Lana Wachowski, Lilly Wachowski',
      writer: 'Lilly Wachowski, Lana Wachowski',
      actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
      plot: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      language: 'English',
      country: 'United States, Australia',
      awards: 'Won 4 Oscars. 37 wins & 51 nominations total',
      poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      ratings: [
        { Source: 'Internet Movie Database', Value: '8.7/10' },
        { Source: 'Rotten Tomatoes', Value: '88%' },
        { Source: 'Metacritic', Value: '73/100' }
      ],
      metascore: '73',
      imdbRating: '8.7',
      imdbVotes: '1,956,404',
      type: 'movie',
      dvd: '21 Sep 1999',
      boxOffice: '$171,479,930',
      production: 'Warner Bros.',
      website: 'N/A',
      response: 'True'
    },
    'tt0111161': {
      imdbId: 'tt0111161',
      title: 'The Shawshank Redemption',
      year: '1994',
      rated: 'R',
      released: '14 Oct 1994',
      runtime: '142 min',
      genre: 'Drama',
      director: 'Frank Darabont',
      writer: 'Stephen King, Frank Darabont',
      actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
      plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      language: 'English',
      country: 'United States',
      awards: 'Nominated for 7 Oscars. 21 wins & 42 nominations total',
      poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
      ratings: [
        { Source: 'Internet Movie Database', Value: '9.3/10' },
        { Source: 'Rotten Tomatoes', Value: '91%' },
        { Source: 'Metacritic', Value: '82/100' }
      ],
      metascore: '82',
      imdbRating: '9.3',
      imdbVotes: '2,756,534',
      type: 'movie',
      dvd: '27 Jan 1998',
      boxOffice: '$16,293,417',
      production: 'Columbia Pictures',
      website: 'N/A',
      response: 'True'
    }
  };

  // Return specific mock data if available, otherwise create generic mock
  if (mockMovies[imdbId]) {
    return mockMovies[imdbId];
  }

  // Generic mock data for unknown IDs
  return {
    imdbId: imdbId,
    title: 'Demo Movie',
    year: '2023',
    rated: 'PG-13',
    released: '15 May 2023',
    runtime: '120 min',
    genre: 'Action, Drama',
    director: 'Demo Director',
    writer: 'Demo Writer',
    actors: 'Demo Actor 1, Demo Actor 2, Demo Actor 3',
    plot: 'This is a demo movie for testing purposes. The actual movie data would be fetched from the OMDb API with a valid API key.',
    language: 'English',
    country: 'United States',
    awards: 'N/A',
    poster: 'N/A',
    ratings: [
      { Source: 'Internet Movie Database', Value: '7.5/10' },
      { Source: 'Rotten Tomatoes', Value: '75%' }
    ],
    metascore: '68',
    imdbRating: '7.5',
    imdbVotes: '125,000',
    type: 'movie',
    dvd: 'N/A',
    boxOffice: 'N/A',
    production: 'Demo Studios',
    website: 'N/A',
    response: 'True'
  };
}