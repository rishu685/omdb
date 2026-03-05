'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Film, Sparkles, Github } from 'lucide-react'
import MovieSearch from '@/components/MovieSearch'
import MovieDisplay from '@/components/MovieDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import type { MovieAnalysisResult } from '@/types/movie'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<MovieAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMovieSearch = async (imdbId: string) => {
    setLoading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const response = await fetch('/api/movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdbId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (err) {
      console.error('Error fetching movie analysis:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze movie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Film className="w-10 h-10 text-red-400" />
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Movie Sentiment Analyzer
            </h1>
            <Sparkles className="w-10 h-10 text-red-300" />
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover what audiences really think about any movie. Enter an IMDb ID to get 
            AI-powered sentiment analysis, cast information, and comprehensive insights.
          </p>
        </motion.header>

        {/* Search Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MovieSearch onSearch={handleMovieSearch} loading={loading} />
        </motion.section>

        {/* Content Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {analysisResult && <MovieDisplay data={analysisResult} loading={loading} error={error} />}
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="mt-20 text-center text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Github className="w-5 h-5" />
              <span>Built with Next.js, TypeScript, and AI</span>
            </div>
            <p className="text-sm">
              Enter any IMDb movie ID (e.g., tt0133093 for The Matrix) to begin your analysis.
            </p>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}