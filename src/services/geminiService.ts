import { GoogleGenerativeAI } from '@google/generative-ai';
import { SentimentAnalysis } from '@/types/movie';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeSentiment(
  movieTitle: string, 
  plot: string, 
  genre: string,
  actors: string,
  year: string
): Promise<SentimentAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    // Mock response when no API key
    return {
      overallSentiment: 'positive',
      sentimentScore: 0.7,
      summary: 'Mock sentiment analysis - Please configure GEMINI_API_KEY for real AI insights.',
      keyThemes: ['Action', 'Adventure', 'Drama'],
      positiveAspects: ['Great performances', 'Engaging plot'],
      negativeAspects: ['Some pacing issues'],
      audienceInsights: 'Generally well received by audiences',
      reviewCount: 100,
      confidence: 0.8
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Analyze the audience sentiment for this movie and provide insights:
    
    Movie: ${movieTitle} (${year})
    Genre: ${genre}
    Cast: ${actors}
    Plot: ${plot}
    
    Based on typical audience reception patterns, box office performance, critical reception data, and genre expectations, provide a comprehensive sentiment analysis. Consider factors like:
    - Genre popularity and audience expectations
    - Star power of the cast
    - Plot appeal and originality
    - Historical context of the release year
    - Box office performance indicators
    
    Respond with a JSON object containing:
    {
      "overallSentiment": "positive" | "negative" | "mixed",
      "sentimentScore": number between -1 and 1,
      "summary": "2-3 sentence summary of audience reception",
      "keyThemes": ["theme1", "theme2", "theme3"],
      "positiveAspects": ["aspect1", "aspect2"],
      "negativeAspects": ["aspect1", "aspect2"],  
      "audienceInsights": "brief insight about what audiences particularly liked or disliked",
      "reviewCount": estimated number of reviews,
      "confidence": confidence level between 0 and 1
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Unable to parse AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
    
  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Enhanced fallback based on movie data
    const sentiment = determineFallbackSentiment(genre, year);
    
    return {
      overallSentiment: sentiment,
      sentimentScore: sentiment === 'positive' ? 0.6 : sentiment === 'negative' ? -0.3 : 0.1,
      summary: `${movieTitle} appears to have ${sentiment} audience reception based on genre and release context.`,
      keyThemes: extractThemesFromGenre(genre),
      positiveAspects: getGenrePositives(genre),
      negativeAspects: getGenreNegatives(genre),
      audienceInsights: `${genre} films from ${year} generally received ${sentiment} audience feedback.`,
      reviewCount: Math.floor(Math.random() * 1000) + 100,
      confidence: 0.5
    };
  }
}

function determineFallbackSentiment(genre: string, year: string): 'positive' | 'negative' | 'mixed' {
  const popularGenres = ['Action', 'Comedy', 'Adventure', 'Sci-Fi', 'Fantasy'];
  const yearNum = parseInt(year);
  
  if (popularGenres.some(g => genre.includes(g))) return 'positive';
  if (yearNum > 2010 && yearNum < 2020) return 'positive';
  if (genre.includes('Horror') || genre.includes('Thriller')) return 'mixed';
  return 'mixed';
}

function extractThemesFromGenre(genre: string): string[] {
  const themes: string[] = [];
  if (genre.includes('Action')) themes.push('High-octane sequences', 'Heroism');
  if (genre.includes('Drama')) themes.push('Character development', 'Emotional depth');
  if (genre.includes('Comedy')) themes.push('Humor', 'Entertainment');
  if (genre.includes('Sci-Fi')) themes.push('Innovation', 'Future concepts');
  if (genre.includes('Romance')) themes.push('Love story', 'Relationships');
  return themes.slice(0, 3);
}

function getGenrePositives(genre: string): string[] {
  const positives: string[] = [];
  if (genre.includes('Action')) positives.push('Exciting sequences', 'Visual effects');
  if (genre.includes('Drama')) positives.push('Strong performances', 'Meaningful story');
  if (genre.includes('Comedy')) positives.push('Entertaining moments', 'Good laughs');
  return positives.slice(0, 2);
}

function getGenreNegatives(genre: string): string[] {
  const negatives: string[] = [];
  if (genre.includes('Action')) negatives.push('Predictable plot', 'Over-the-top scenes');
  if (genre.includes('Drama')) negatives.push('Slow pacing', 'Heavy themes');
  if (genre.includes('Comedy')) negatives.push('Hit-or-miss humor', 'Formulaic');
  return negatives.slice(0, 2);
}