'use client'

import { motion } from 'framer-motion'
import { Star, Calendar, Clock, Globe, Award, Users, ThumbsUp, ThumbsDown, Minus, Brain, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import type { MovieDisplayProps } from '@/types/movie'

export default function MovieDisplay({ data, loading, error }: MovieDisplayProps) {
  if (!data) return null;
  
  const { movie, sentimentAnalysis } = data;
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return ThumbsUp
      case 'negative': return ThumbsDown  
      case 'mixed': return Minus
      default: return Brain
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'sentiment-positive'
      case 'negative': return 'sentiment-negative'
      case 'mixed': return 'sentiment-mixed'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  const formatRating = (rating: string) => {
    const num = parseFloat(rating)
    if (isNaN(num)) return rating
    return num.toFixed(1)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Poster and Basic Info */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <div className="glass-card p-6 sticky top-8">
            {/* Poster */}
            <div className="relative mb-6 group">
              <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
                {movie.poster && movie.poster !== 'N/A' ? (
                  <Image
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                    unoptimized={true}
                    onError={(e) => {
                      console.error('Image failed to load:', movie.poster);
                      e.currentTarget.style.display = 'none';
                      const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallbackElement) {
                        fallbackElement.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                
                {(!movie.poster || movie.poster === 'N/A') && (
                  <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-gray-800/40 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <div className="w-16 h-16 mx-auto mb-2 bg-red-950/30 rounded-lg flex items-center justify-center text-2xl">
                        🎬
                      </div>
                      <p className="text-sm">No poster available</p>
                    </div>
                  </div>
                )}
                
                {/* Fallback div for failed image loads */}
                <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-gray-800/40 items-center justify-center hidden">
                  <div className="text-center text-white/60">
                    <div className="w-16 h-16 mx-auto mb-2 bg-red-950/30 rounded-lg flex items-center justify-center text-2xl">
                      🎭
                    </div>
                    <p className="text-sm">Image unavailable</p>
                  </div>
                </div>
              </div>
              
              {/* Overlay with IMDb ID */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {movie.imdbId}
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Ratings
              </h3>
              
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/30">
                  <span className="text-yellow-300 font-medium">IMDb</span>
                  <span className="text-yellow-300 text-lg font-bold">
                    {formatRating(movie.imdbRating)}/10
                  </span>
                </div>
              )}
              
              {movie.metascore && movie.metascore !== 'N/A' && (
                <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                  <span className="text-green-300 font-medium">Metascore</span>
                  <span className="text-green-300 text-lg font-bold">
                    {movie.metascore}/100
                  </span>
                </div>
              )}
              
              {movie.ratings && movie.ratings.length > 0 && (
                movie.ratings.map((rating: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-400/30">
                    <span className="text-red-300 font-medium text-sm">{rating.Source}</span>
                    <span className="text-red-300 font-bold text-sm">{rating.Value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Movie Details and Analysis */}
        <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
          {/* Title and Basic Info */}
          <div className="glass-card p-8">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/70">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{movie.runtime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{movie.country}</span>
                </div>
                {movie.rated && movie.rated !== 'N/A' && (
                  <div className="px-2 py-1 bg-white/10 rounded text-sm">
                    {movie.rated}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Genre</h3>
                <p className="text-white/80">{movie.genre}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Director</h3>
                <p className="text-white/80">{movie.director}</p>
              </div>
            </div>
          </div>

          {/* Plot Summary */}
          <motion.div className="glass-card p-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              📖 Plot Summary
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              {movie.plot}
            </p>
          </motion.div>

          {/* Cast */}
          <motion.div className="glass-card p-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Cast
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {movie.actors.split(', ').map((actor: string, index: number) => (
                <motion.div 
                  key={index}
                  className="p-4 bg-red-950/20 rounded-lg border border-red-800/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-white font-medium">{actor}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Awards */}
          {movie.awards && movie.awards !== 'N/A' && (
            <motion.div className="glass-card p-8" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Awards & Recognition
              </h2>
              <p className="text-white/80">{movie.awards}</p>
            </motion.div>
          )}

          {/* AI Sentiment Analysis */}
          {sentimentAnalysis && (
            <motion.div className="glass-card p-8" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-red-400" />
                AI Sentiment Analysis
              </h2>
              
              {/* Overall Sentiment */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getSentimentColor(sentimentAnalysis.overallSentiment)}`}>
                    {(() => {
                      const Icon = getSentimentIcon(sentimentAnalysis.overallSentiment)
                      return <Icon className="w-5 h-5" />
                    })()}
                    <span className="font-semibold capitalize">
                      {sentimentAnalysis.overallSentiment}
                    </span>
                  </div>
                  <div className="text-white/70">
                    Confidence: {Math.round(sentimentAnalysis.confidence * 100)}%
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      sentimentAnalysis.overallSentiment === 'positive' 
                        ? 'bg-green-500' 
                        : sentimentAnalysis.overallSentiment === 'negative'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ 
                      width: `${Math.abs(sentimentAnalysis.sentimentScore) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">Summary</h3>
                <p className="text-white/80 leading-relaxed">
                  {sentimentAnalysis.summary}
                </p>
              </div>

              {/* Insights */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">Audience Insights</h3>
                <p className="text-white/80 leading-relaxed">
                  {sentimentAnalysis.audienceInsights}
                </p>
              </div>

              {/* Key Themes */}
              {sentimentAnalysis.keyThemes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-3">Key Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {sentimentAnalysis.keyThemes.map((theme: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-400/30"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Positive/Negative Aspects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sentimentAnalysis.positiveAspects.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      Praised Aspects
                    </h3>
                    <ul className="space-y-2">
                      {sentimentAnalysis.positiveAspects.map((aspect: string, index: number) => (
                        <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">+</span>
                          {aspect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sentimentAnalysis.negativeAspects.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4" />
                      Criticized Aspects
                    </h3>
                    <ul className="space-y-2">
                      {sentimentAnalysis.negativeAspects.map((aspect: string, index: number) => (
                        <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                          <span className="text-red-400 mt-1">-</span>
                          {aspect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Analysis Stats */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Based on {sentimentAnalysis.reviewCount} reviews</span>
                  </div>
                  <div>
                    Score: {sentimentAnalysis.sentimentScore.toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}