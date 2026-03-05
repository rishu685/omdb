# 🎬 Movie Sentiment Analyzer

A modern, AI-powered movie analysis tool that fetches movie details from IMDb and provides comprehensive sentiment analysis of audience reviews. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Movie Sentiment Analyzer](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 Core Features
- **IMDb Integration**: Fetch comprehensive movie data using IMDb IDs
- **AI Sentiment Analysis**: Analyze audience sentiment using Google Gemini AI
- **Beautiful UI**: Modern, responsive design with glassmorphic elements
- **Movie Details**: Complete information including cast, plot, ratings, and awards
- **Sentiment Insights**: Detailed analysis with positive/negative aspects and themes
- **Real-time Validation**: Input validation with helpful error messages

### 🚀 Additional Features
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Framer Motion powered interactions
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Beautiful loading animations and progress indicators
- **Mock Analysis**: Fallback sentiment analysis when AI is unavailable
- **SEO Optimized**: Meta tags and structured data for better search visibility

## 🛠 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend & APIs
- **[OMDB API](http://www.omdbapi.com/)** - Movie database integration
- **[Google Gemini](https://ai.google.dev/)** - Advanced AI sentiment analysis
- **Next.js API Routes** - Serverless backend functions

### Styling & UI
- **Glassmorphism Design** - Modern glass card effects
- **Gradient Animations** - Smooth color transitions
- **Custom Components** - Reusable, accessible UI components
- **Responsive Grid Layout** - Mobile-first design approach

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **OMDB API Key** (free at [omdbapi.com](http://www.omdbapi.com/apikey.aspx))
- **Google Gemini API Key** (required, for AI analysis)

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd movie-sentiment-analyzer
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# Required: OMDB API Key
OMDB_API_KEY=your_omdb_api_key_here

# Google Gemini API Key (for AI sentiment analysis)
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Getting API Keys:

**OMDB API Key (Required):**
1. Visit [omdbapi.com](http://www.omdbapi.com/apikey.aspx)
2. Sign up for a free account
3. Copy your API key

**Google Gemini API Key (Required):**
1. Visit [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Create an account and add payment method
3. Generate a new API key
4. **Note**: Without this key, the app will use mock sentiment analysis

### 4. Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

Build for production:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 💡 Usage Guide

### Finding IMDb IDs

1. Go to [imdb.com](https://www.imdb.com)
2. Search for your desired movie
3. Look for the ID in the URL: `imdb.com/title/`**`tt1234567`**`/`
4. Use the complete ID (e.g., `tt0133093`)

### Example Movie IDs

| Movie | IMDb ID |
|-------|----------|
| The Matrix | tt0133093 |
| The Shawshank Redemption | tt0111161 |
| The Godfather | tt0068646 |
| The Dark Knight | tt0468569 |
| Inception | tt1375666 |

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── movie/         # Movie data endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── MovieDisplay.tsx   # Movie details display
│   ├── MovieSearch.tsx    # Search input component
│   ├── LoadingSpinner.tsx # Loading animation
│   └── ErrorMessage.tsx   # Error handling
├── types/                 # TypeScript definitions
│   └── movie.ts           # Movie data types
└── utils/                 # Utility functions
    ├── movieServices.ts   # API and AI services
    └── cn.ts              # Class utilities
```

## 🧠 Tech Stack Rationale

### Why Next.js 14?
- **App Router**: Modern file-based routing with React Server Components
- **API Routes**: Serverless functions for backend logic
- **Image Optimization**: Built-in optimization for movie posters
- **SEO**: Server-side rendering for better search engine visibility
- **Performance**: Automatic code splitting and optimization

### Why TypeScript?
- **Type Safety**: Catch errors at compile time
- **Better DX**: Excellent IDE support with autocomplete
- **Maintainability**: Self-documenting code with interfaces
- **Scalability**: Easier to maintain as the project grows

### Why Tailwind CSS?
- **Utility-First**: Rapid development with utility classes
- **Design System**: Consistent spacing, colors, and typography
- **Responsive**: Mobile-first responsive design
- **Performance**: Purges unused CSS in production
- **Customization**: Easy to extend with custom themes

### Why Framer Motion?
- **Performance**: Hardware-accelerated animations
- **Declarative**: Easy to understand animation syntax
- **Responsive**: Animations that work across devices
- **Accessibility**: Respects user motion preferences

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OMDB_API_KEY` | Yes | OMDB API key for movie data |
| `OPENAI_API_KEY` | No | OpenAI API key for AI analysis |

### Customization

**Colors and Themes:**
Modify `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

**Animation Duration:**
Adjust animation speeds in `globals.css`:

```css
.fade-in {
  animation-duration: 0.8s; /* Adjust as needed */
}
```

## 🔍 API Endpoints

### POST `/api/movie`

Fetch movie data and sentiment analysis.

**Request Body:**
```json
{
  "imdbId": "tt0133093"
}
```

**Response:**
```json
{
  "imdbId": "tt0133093",
  "title": "The Matrix",
  "year": "1999",
  "genre": "Action, Sci-Fi",
  "plot": "...",
  "sentimentAnalysis": {
    "overallSentiment": "positive",
    "sentimentScore": 0.8,
    "summary": "...",
    "keyThemes": [...],
    "positiveAspects": [...],
    "negativeAspects": [...]
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

- **Netlify**: Configure build settings for Next.js
- **Railway**: Connect GitHub repository
- **DigitalOcean**: Use App Platform

## 🐛 Troubleshooting

### Common Issues

**"Movie not found" Error:**
- Verify the IMDb ID format (tt + 7-8 digits)
- Check if the movie exists on IMDb
- Ensure OMDB API key is valid

**Sentiment Analysis Not Working:**
- Check OpenAI API key (optional)
- Verify API key has sufficient credits
- Mock analysis should work as fallback

**Styling Issues:**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS imports
- Verify PostCSS configuration

## 🔮 Future Enhancements

- [ ] **User Favorites**: Save favorite movies  
- [ ] **Comparison Mode**: Compare multiple movies
- [ ] **Trending Movies**: Show popular movies
- [ ] **Advanced Filters**: Filter by genre, year, rating
- [ ] **Social Sharing**: Share movie analyses
- [ ] **Review History**: Track analyzed movies
- [ ] **Batch Analysis**: Analyze multiple movies at once
- [ ] **Export Reports**: Download analysis as PDF

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for movie data
- [OpenAI](https://openai.com/) for AI sentiment analysis
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Next.js](https://nextjs.org/) team for the amazing framework

## 📊 Assumptions

1. **IMDb ID Format**: Users will provide valid IMDb IDs in the format `ttNNNNNNN`
2. **API Availability**: OMDB API and OpenAI API are available and responsive
3. **Network Connection**: Users have stable internet connection
4. **Modern Browsers**: Application targets modern browsers with ES6+ support
5. **Mobile Usage**: Significant portion of users will access on mobile devices
6. **English Content**: Primary focus on English language movies and reviews
7. **Fair Usage**: API usage will stay within rate limits and quotas

---

**Built with ❤️ using Next.js, TypeScript, and AI**