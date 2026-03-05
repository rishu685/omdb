export interface MovieData {
  imdbId: string
  title: string
  year: string
  rated: string
  released: string
  runtime: string
  genre: string
  director: string
  writer: string
  actors: string
  plot: string
  language: string
  country: string
  awards: string
  poster: string
  ratings: MovieRating[]
  metascore: string
  imdbRating: string
  imdbVotes: string
  type: string
  dvd?: string
  boxOffice?: string
  production?: string
  website?: string
  response: string
  sentimentAnalysis?: SentimentAnalysis
}

export interface MovieRating {
  Source: string
  Value: string
}

export interface SentimentAnalysis {
  overallSentiment: 'positive' | 'negative' | 'mixed'
  sentimentScore: number // -1 to 1
  summary: string
  keyThemes: string[]
  positiveAspects: string[]
  negativeAspects: string[]
  audienceInsights: string
  reviewCount: number
  confidence: number // 0 to 1
}

export interface Review {
  id: string
  author: string
  content: string
  rating?: number
  date: string
  helpful: number
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface MovieSearchProps {
  onSearch: (imdbId: string) => Promise<void>
  loading: boolean
}

export interface MovieDisplayProps {
  data: MovieAnalysisResult | null
  loading: boolean
  error: string | null
}

export interface MovieAnalysisResult {
  movie: MovieData
  sentimentAnalysis: SentimentAnalysis
  error?: string
}

export interface CastMember {
  name: string
  character?: string
  photo?: string
}