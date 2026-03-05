import { NextRequest, NextResponse } from 'next/server'
import { getMovieWithSentiment } from '@/utils/movieServices'
import type { MovieAnalysisResult } from '@/types/movie'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imdbId } = body

    if (!imdbId) {
      return NextResponse.json(
        { error: 'IMDb ID is required' },
        { status: 400 }
      )
    }

    // Validate and clean IMDb ID format
    const cleanId = imdbId.trim().toLowerCase();
    const formattedId = cleanId.startsWith('tt') ? cleanId : `tt${cleanId}`;
    const imdbRegex = /^tt\d{7,8}$/i;
    
    if (!imdbRegex.test(formattedId)) {
      return NextResponse.json(
        { error: 'Invalid IMDb ID format. Expected: tt0123456 or 0123456' },
        { status: 400 }
      )
    }

    console.log('Analyzing movie:', formattedId)

    // Get movie data with Gemini sentiment analysis
    const result = await getMovieWithSentiment(formattedId)
    
    if (!result) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    const response: MovieAnalysisResult = {
      movie: result.movie,
      sentimentAnalysis: result.sentimentAnalysis
    };

    console.log('Analysis complete for:', result.movie.title)
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle specific error types
    if (errorMessage.includes('OMDB API key')) {
      return NextResponse.json(
        { error: 'Movie database service not configured. Please contact support.' },
        { status: 503 }
      )
    }
    
    if (errorMessage.includes('Movie not found')) {
      return NextResponse.json(
        { error: 'Movie not found. Please check the IMDb ID and try again.' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: `Failed to analyze movie: ${errorMessage}` },
      { status: 500 }
    )
  }
}