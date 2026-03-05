'use client'

import { motion } from 'framer-motion'
import { Film, Sparkles, Brain } from 'lucide-react'

export default function LoadingSpinner() {
  const steps = [
    { icon: Film, text: 'Fetching movie data...', delay: 0 },
    { icon: Sparkles, text: 'Gathering reviews...', delay: 0.5 },
    { icon: Brain, text: 'Analyzing sentiment...', delay: 1 }
  ]

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-card p-12 text-center max-w-md mx-auto">
        {/* Main spinner */}
        <motion.div 
          className="relative mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto"></div>
          <motion.div 
            className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 border-b-blue-500 rounded-full mx-auto"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </motion.div>

        {/* Loading steps */}
        <div className="space-y-4">
          {steps.map(({ icon: Icon, text, delay }, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center gap-3 text-white/80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay }}
            >
              <Icon className="w-5 h-5 text-purple-400" />
              <span className="text-sm">{text}</span>
            </motion.div>
          ))}
        </div>

        <motion.p 
          className="text-white/60 text-xs mt-6"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          This may take a few moments...
        </motion.p>
      </div>
    </motion.div>
  )
}