import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conditional classes and conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format movie runtime from minutes to hours and minutes
 */
export function formatRuntime(runtime: string): string {
  const match = runtime.match(/(\d+)/)
  if (!match) return runtime
  
  const minutes = parseInt(match[1])
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes}min`
  } else if (remainingMinutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${remainingMinutes}min`
  }
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: string | number): string {
  const number = typeof num === 'string' ? parseInt(num.replace(/,/g, '')) : num
  if (isNaN(number)) return num.toString()
  return number.toLocaleString()
}

/**
 * Validate IMDb ID format
 */
export function isValidImdbId(id: string): boolean {
  const imdbRegex = /^tt\d{7,8}$/
  return imdbRegex.test(id)
}

/**
 * Extract IMDb ID from URL or text
 */
export function extractImdbId(input: string): string | null {
  const match = input.match(/tt\d{7,8}/)
  return match ? match[0] : null
}

/**
 * Get sentiment color based on sentiment type
 */
export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return 'text-green-400 bg-green-500/20 border-green-400/30'
    case 'negative':
      return 'text-red-400 bg-red-500/20 border-red-400/30'
    case 'mixed':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30'
    default:
      return 'text-gray-400 bg-gray-500/20 border-gray-400/30'
  }
}