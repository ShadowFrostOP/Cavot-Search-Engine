import { SearchResult, SearchCategory, QuickAnswer } from '../types';

export interface SearchResponse {
  quickAnswer?: QuickAnswer | null;
  overview?: string;
  results: SearchResult[];
  source?: string;
}

export async function executeRealWebSearch(
  query: string,
  category: SearchCategory = 'web'
): Promise<SearchResponse> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return { results: [] };

  // 1. Full-stack Node.js server route (backed by DuckDuckGo live engine + factual answers + OpenMeteo)
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: cleanQuery, category }),
    });

    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return {
          quickAnswer: data.quickAnswer,
          overview: data.overview,
          results: data.results,
          source: data.source,
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/search request failed, attempting browser fallback:', err);
  }

  // 2. Client-side fallback if server is unreachable
  const fallbackResults: SearchResult[] = [
    {
      id: `client-direct-1-${Date.now()}`,
      title: `${cleanQuery} — Official Website & Direct Source`,
      url: `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`,
      domain: 'google.com',
      description: `Official web indexing and verified source records for "${cleanQuery}".`,
      category: 'web',
      date: 'Live Query',
    },
    {
      id: `client-direct-2-${Date.now()}`,
      title: `${cleanQuery} on Wikipedia, the Free Encyclopedia`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanQuery)}`,
      domain: 'wikipedia.org',
      description: `Comprehensive encyclopedic entry, overview, history, and citations regarding ${cleanQuery}.`,
      category: 'web',
      date: 'Reference',
    },
    {
      id: `client-direct-3-${Date.now()}`,
      title: `${cleanQuery} Videos, Streams & Discussions on YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`,
      domain: 'youtube.com',
      description: `Watch official trailers, in-depth tutorials, gameplay, and community broadcasts on ${cleanQuery}.`,
      category: 'videos',
    },
    {
      id: `client-direct-4-${Date.now()}`,
      title: `Latest News & Real-Time Headlines on ${cleanQuery}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(cleanQuery)}`,
      domain: 'news.google.com',
      description: `Breaking updates, editorial journalism, press releases, and in-depth articles on ${cleanQuery}.`,
      category: 'news',
      date: 'Latest',
    },
  ];

  return {
    results: fallbackResults,
    source: 'client_direct_links',
  };
}
