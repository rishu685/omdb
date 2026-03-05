'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div 
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="glass-card p-8 text-center border-red-500/30">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-red-300 text-sm mb-6">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/60 text-xs">
            Common issues:
          </p>
          <ul className="text-white/50 text-xs mt-2 space-y-1">
            <li>• Check if the IMDb ID format is correct (e.g., tt1234567)</li>
            <li>• Ensure the movie exists on IMDb</li>
            <li>• Try again in a few moments</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}