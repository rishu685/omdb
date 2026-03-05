'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertCircle } from 'lucide-react'
import type { MovieSearchProps } from '@/types/movie'

export default function MovieSearch({ onSearch, loading }: MovieSearchProps) {
  const [imdbId, setImdbId] = useState('')
  const [error, setError] = useState('')

  const validateImdbId = (id: string): boolean => {
    // IMDb ID format: tt followed by 7-8 digits
    const imdbRegex = /^tt\d{7,8}$/
    return imdbRegex.test(id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!imdbId.trim()) {
      setError('Please enter an IMDb ID')
      return
    }

    if (!validateImdbId(imdbId.trim())) {
      setError('Invalid IMDb ID format. Please use format: tt1234567')
      return
    }

    await onSearch(imdbId.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setImdbId(value)
    
    // Clear error when user starts typing
    if (error) setError('')
    
    // Auto-format: add 'tt' prefix if user enters just numbers
    if (value.length > 0 && /^\d/.test(value)) {
      setImdbId(`tt${value}`)
    }
  }

  const exampleIds = ['tt0133093', 'tt0111161', 'tt0068646', 'tt0468569', 'tt1375666']
  const exampleTitles = ['The Matrix', 'Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'Inception']

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="glass-card p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="imdbId" className="block text-sm font-medium text-white/80">
              IMDb Movie ID
            </label>
            <div className="relative">
              <input
                id="imdbId"
                type="text"
                value={imdbId}
                onChange={handleInputChange}
                placeholder="e.g., tt0133093"
                className="input-field pr-12"
                disabled={loading}
                maxLength={10}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
            
            {error && (
              <motion.div 
                className="flex items-center gap-2 text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !imdbId.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Analyzing Movie...
              </span>
            ) : (
              'Analyze Movie'
            )}
          </button>
        </form>

        {/* Example IDs */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-white/60 mb-4">Try these popular movies:</p>
          <div className="flex flex-wrap gap-2">
            {exampleIds.map((id, index) => (
              <motion.button
                key={id}
                onClick={() => setImdbId(id)}
                className="btn-secondary text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {exampleTitles[index]}
                <span className="ml-1 text-white/40">({id})</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Instructions */}
      <motion.div 
        className="mt-6 text-center text-white/60 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>Find IMDb IDs by visiting movie pages on IMDb.com</p>
        <p className="mt-1">The ID appears in the URL: imdb.com/title/<span className="text-purple-400 font-medium">tt1234567</span>/</p>
      </motion.div>
    </div>
  )
}