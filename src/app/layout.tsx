import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Movie Sentiment Analyzer',
  description: 'Analyze movie sentiment with AI-powered insights from IMDb data',
  keywords: ['movie', 'sentiment', 'analysis', 'IMDb', 'AI', 'reviews'],
  authors: [{ name: 'Movie Sentiment Analyzer' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}