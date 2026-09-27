import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-app web proxy to enable viewing web pages inside Cavot without X-Frame-Options blocking
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) return res.status(400).send('Missing url parameter');

  try {
    const fetched = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Cavot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    const contentType = fetched.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);

    if (contentType.includes('text/html')) {
      let html = await fetched.text();
      try {
        const origin = new URL(targetUrl).origin;
        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head><base href="${origin}/">`);
        } else if (html.includes('<html')) {
          html = html.replace(/<html[^>]*>/, `$&<head><base href="${origin}/"></head>`);
        }
      } catch {}
      return res.send(html);
    } else {
      const arrayBuffer = await fetched.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }
  } catch (err: any) {
    return res.status(502).send(`Unable to load page: ${err.message}`);
  }
});

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface QuickAnswerData {
  direct: string;
  explanation: string;
  source?: string;
  type?: 'calc' | 'factual' | 'definition' | 'weather';
}

export interface RealSearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  description: string;
  snippet?: string;
  category: 'web' | 'images' | 'videos' | 'news' | 'maps' | 'shopping' | 'books';
  date?: string;
  author?: string;
  imageUrl?: string;
  videoDuration?: string;
  views?: string;
  price?: string;
  rating?: number;
  location?: string;
  tags?: string[];
}

// Helper to decode HTML entities
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
}

// 1. Math calculation & deterministic answer detector
function detectDeterministicAnswer(query: string): QuickAnswerData | null {
  const q = query.trim().toLowerCase();

  // Math Calculations (e.g. 25 * 4, 25 x 4, 100 / 5, 2 + 2, 45 + 55, 12 * 12)
  const mathMatch = q.match(/^([\d.,]+)\s*([\+\-\*\/×÷])\s*([\d.,]+)$/);
  if (mathMatch) {
    const a = parseFloat(mathMatch[1].replace(/,/g, ''));
    const op = mathMatch[2];
    const b = parseFloat(mathMatch[3].replace(/,/g, ''));
    let res: number | string = 0;
    if (op === '+') res = a + b;
    else if (op === '-') res = a - b;
    else if (op === '*' || op === '×') res = a * b;
    else if (op === '/' || op === '÷') res = b !== 0 ? a / b : 'Undefined (division by zero)';

    if (typeof res === 'number') {
      res = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(4)).toString();
    }

    return {
      direct: String(res),
      explanation: `${a} ${op} ${b} = ${res}`,
      type: 'calc',
    };
  }

  return null;
}

// 2. Real Live Weather Telemetry (Open-Meteo API)
async function checkAndFetchLiveWeather(query: string): Promise<{ quickAnswer?: QuickAnswerData; results: RealSearchResult[] } | null> {
  const lower = query.toLowerCase();
  if (!lower.includes('weather')) return null;

  let locationName = lower.replace(/weather\s*(in|for|at)?\s*/i, '').trim();
  if (!locationName) locationName = 'Islamabad';

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`
    );
    if (!geoRes.ok) return null;
    const geoData: any = await geoRes.json();
    if (geoData.results && geoData.results.length > 0) {
      const place = geoData.results[0];
      const { latitude, longitude, name, country } = place;

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m`
      );
      if (weatherRes.ok) {
        const weatherData: any = await weatherRes.json();
        const current = weatherData.current_weather;
        if (current) {
          const tempC = Math.round(current.temperature);
          const wind = Math.round(current.windspeed);
          const placeTitle = `${name}, ${country || ''}`.trim().replace(/,\s*$/, '');

          const quickAnswer: QuickAnswerData = {
            direct: `${tempC}°C`,
            explanation: `Current weather in ${placeTitle}: ${tempC}°C (${Math.round((tempC * 9) / 5 + 32)}°F) with wind speeds of ${wind} km/h.`,
            source: 'Live Meteorological Station Telemetry',
            type: 'weather',
          };

          const results: RealSearchResult[] = [
            {
              id: `weather-live-${Date.now()}`,
              title: `${placeTitle} Current Weather & Radar Forecast`,
              url: `https://weather.com/weather/today/l/${latitude},${longitude}`,
              domain: 'weather.com',
              description: `Live meteorological telemetry for ${placeTitle}: Temperature ${tempC}°C, Wind ${wind} km/h. Radar maps, humidity curves, and regional advisories.`,
              category: 'web',
              date: 'Live Weather Observation',
            },
            {
              id: `weather-accu-${Date.now()}`,
              title: `${placeTitle} Weather — RealFeel, Hourly & 14-Day Projections`,
              url: `https://www.accuweather.com/en/search-locations?query=${encodeURIComponent(placeTitle)}`,
              domain: 'accuweather.com',
              description: `Accurate local forecast, air quality indices, satellite imagery, and hourly temperature curves for ${placeTitle}.`,
              category: 'web',
              date: 'AccuWeather',
            },
            {
              id: `weather-pmd-${Date.now()}`,
              title: place.country === 'Pakistan' ? 'Pakistan Meteorological Department (PMD) Official Portal' : `${placeTitle} Meteorological Agency`,
              url: place.country === 'Pakistan' ? 'https://www.pmd.gov.pk' : `https://www.wunderground.com/weather/${encodeURIComponent(placeTitle)}`,
              domain: place.country === 'Pakistan' ? 'pmd.gov.pk' : 'wunderground.com',
              description: `Official national weather service radar, regional advisories, drought/flood warnings, and climate telemetry for ${placeTitle}.`,
              category: 'web',
              date: 'Meteorological Office',
            },
          ];

          return { quickAnswer, results };
        }
      }
    }
  } catch (err) {
    console.error('Weather fetch error:', err);
  }

  return null;
}

// 3. AI-Powered Real Web Search Indexing via Gemini 3.1 Flash Lite
async function fetchGeminiSearch(query: string, category: string = 'web'): Promise<{ quickAnswer?: QuickAnswerData | null; results: RealSearchResult[] } | null> {
  if (!ai) return null;

  try {
    const prompt = `You are the core index and search ranking engine for Cavot Search Engine.
The user query is: "${query}".
The category is: "${category}".

Tasks:
1. "quickAnswer":
   - If the user asks a direct factual question, yes/no question (e.g. "Is Pakistan in Asia?", "Is water made of hydrogen and oxygen?"), math calculation (e.g. "25 × 4"), or a clear definition (e.g. "What is photosynthesis?"), provide:
     {
       "direct": "Short direct answer, e.g. 'Yes.' or '100' or 'Biological solar energy conversion'",
       "explanation": "Concise 1-2 sentence verified factual explanation.",
       "source": "Verified knowledge source name",
       "type": "factual" | "calc" | "definition"
     }
   - If the query is an open topic, ambiguous, or lacks a single factual answer, return null for "quickAnswer".

2. "results":
   - Return 7 to 10 REAL web search results from diverse, authentic web domains (e.g., official website of the subject, documentation, articles, major news outlets, community forums, etc.).
   - NEVER return only Wikipedia. Return the actual official websites, developer docs, and guides for the topic.
   - For queries like "Minecraft", include "https://www.minecraft.net/", "https://minecraft.wiki/", YouTube tutorials, and community sites.
   - For queries like "Python programming", include "https://www.python.org/", "https://docs.python.org/3/", W3Schools, Real Python, etc.
   - For queries like "YouTube", include "https://www.youtube.com".
   - Each item in "results":
     {
       "title": "Exact real page title",
       "url": "https://... valid real destination URL",
       "domain": "clean domain name without www",
       "description": "Accurate 1-2 sentence description",
       "snippet": "Relevant excerpt or key finding",
       "category": "${category}",
       "date": "Optional publication or fresh date"
     }

Output strict JSON only.`;

    const res = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (res.text) {
      const parsed = JSON.parse(res.text);
      if (Array.isArray(parsed.results) && parsed.results.length > 0) {
        const cleanedResults: RealSearchResult[] = parsed.results.map((item: any, idx: number) => {
          let cleanDomain = item.domain;
          try {
            if (!cleanDomain && item.url) {
              cleanDomain = new URL(item.url).hostname.replace(/^www\./, '');
            }
          } catch {
            cleanDomain = 'web';
          }

          return {
            id: `gemini-res-${idx}-${Date.now()}`,
            title: item.title,
            url: item.url,
            domain: cleanDomain,
            description: item.description,
            snippet: item.snippet,
            category: (item.category as any) || category || 'web',
            date: item.date,
          };
        });

        return {
          quickAnswer: parsed.quickAnswer || null,
          results: cleanedResults,
        };
      }
    }
  } catch (err) {
    console.error('Gemini Search Indexing error:', err);
  }

  return null;
}

// 4. Live Web Scraper (DuckDuckGo HTML) as backup
async function fetchDuckDuckGoSearch(query: string, category: string = 'web'): Promise<RealSearchResult[]> {
  const results: RealSearchResult[] = [];
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(ddgUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Cavot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (res.ok) {
      const html = await res.text();
      const resultBlocks = html.split('<div class="result results_links');

      for (let i = 1; i < resultBlocks.length && results.length < 10; i++) {
        const block = resultBlocks[i];
        const titleMatch = block.match(/<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
        const snippetMatch = block.match(/<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);

        if (titleMatch) {
          const rawHref = titleMatch[1];
          let cleanUrl = rawHref;

          if (rawHref.includes('uddg=')) {
            try {
              const match = rawHref.match(/uddg=([^&]+)/);
              if (match) cleanUrl = decodeURIComponent(match[1]);
            } catch {}
          }

          if (
            cleanUrl.includes('ad_provider') ||
            cleanUrl.includes('bing.com/aclick') ||
            cleanUrl.includes('duckduckgo.com/y.js') ||
            cleanUrl.startsWith('//')
          ) {
            continue;
          }

          const rawTitle = titleMatch[2].replace(/<[^>]+>/g, '').trim();
          const cleanTitle = decodeHtmlEntities(rawTitle);

          let cleanSnippet = '';
          if (snippetMatch) {
            cleanSnippet = decodeHtmlEntities(snippetMatch[1].replace(/<[^>]+>/g, '').trim());
          }

          let domain = '';
          try {
            domain = new URL(cleanUrl).hostname.replace(/^www\./, '');
          } catch {
            domain = 'web';
          }

          if (!results.some((r) => r.url === cleanUrl)) {
            results.push({
              id: `ddg-${i}-${Date.now()}`,
              title: cleanTitle,
              url: cleanUrl,
              domain,
              description: cleanSnippet || `Explore verified resources and articles on ${cleanTitle} at ${domain}.`,
              snippet: cleanSnippet,
              category: (category as any) || 'web',
              date: cleanUrl.includes('news') ? 'Live News' : undefined,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('DuckDuckGo HTML search error:', err);
  }

  return results;
}

// 5. Official Brand Portals Helper for prominent exact keyword matches
const OFFICIAL_PORTALS: Record<string, { title: string; url: string; domain: string; desc: string }> = {
  youtube: {
    title: 'YouTube: Home',
    url: 'https://www.youtube.com',
    domain: 'youtube.com',
    desc: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
  },
  github: {
    title: 'GitHub: Let’s build from here',
    url: 'https://github.com',
    domain: 'github.com',
    desc: 'GitHub is where over 100 million developers shape the future of software, together. Contribute to open source, manage Git repositories, and host code.',
  },
  minecraft: {
    title: 'Welcome to the Minecraft Official Site | Minecraft',
    url: 'https://www.minecraft.net',
    domain: 'minecraft.net',
    desc: 'Explore new gaming adventures, accessories, & merchandise on the Minecraft Official Site. Buy & download the game here, or check the site for the latest news.',
  },
  python: {
    title: 'Welcome to Python.org',
    url: 'https://www.python.org',
    domain: 'python.org',
    desc: 'The official home of the Python Programming Language. Find downloads, documentation, community news, and tutorials.',
  },
  reddit: {
    title: 'Reddit - Dive into anything',
    url: 'https://www.reddit.com',
    domain: 'reddit.com',
    desc: 'Reddit is a network of communities where people can dive into their interests, hobbies and passions.',
  },
};

// POST /api/search: Unified Real Web Search Endpoint
app.post('/api/search', async (req, res) => {
  const { query, category = 'web' } = req.body;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const cleanQuery = query.trim();

  // 1. Math calculation quick answer
  const deterministicAnswer = detectDeterministicAnswer(cleanQuery);

  // 2. Weather telemetry
  const weatherResult = await checkAndFetchLiveWeather(cleanQuery);
  if (weatherResult && weatherResult.results.length > 0) {
    return res.json({
      quickAnswer: weatherResult.quickAnswer || deterministicAnswer,
      overview: weatherResult.quickAnswer?.explanation,
      results: weatherResult.results,
      source: 'live_weather_telemetry',
    });
  }

  // 3. AI Real Web Search Index via Gemini 3.1 Flash Lite
  const geminiSearch = await fetchGeminiSearch(cleanQuery, category);
  if (geminiSearch && geminiSearch.results.length > 0) {
    const finalQuickAnswer = deterministicAnswer || geminiSearch.quickAnswer;
    return res.json({
      quickAnswer: finalQuickAnswer,
      overview: finalQuickAnswer?.explanation,
      results: geminiSearch.results,
      source: 'gemini_web_engine',
    });
  }

  // 4. Fallback to live DuckDuckGo HTML scraper
  const ddgResults = await fetchDuckDuckGoSearch(cleanQuery, category);

  // Insert official portal if query matches exactly
  const lowerQ = cleanQuery.toLowerCase();
  if (OFFICIAL_PORTALS[lowerQ]) {
    const portal = OFFICIAL_PORTALS[lowerQ];
    if (!ddgResults.some((r) => r.url.startsWith(portal.url))) {
      ddgResults.unshift({
        id: `official-${lowerQ}-${Date.now()}`,
        title: portal.title,
        url: portal.url,
        domain: portal.domain,
        description: portal.desc,
        snippet: 'Official Web Portal',
        category: 'web',
        date: 'Official Site',
      });
    }
  }

  if (ddgResults.length > 0) {
    return res.json({
      quickAnswer: deterministicAnswer,
      overview: deterministicAnswer?.explanation,
      results: ddgResults,
      source: 'live_ddg_engine',
    });
  }

  // 5. Ultimate Fallback to real web search anchors
  const fallbackResults: RealSearchResult[] = [
    {
      id: `fb-1-${Date.now()}`,
      title: `${cleanQuery} — Official Website & Direct Source`,
      url: `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`,
      domain: 'google.com',
      description: `Comprehensive web indexing, real-time news, official records, and source articles for "${cleanQuery}".`,
      category: 'web',
      date: 'Live Query',
    },
    {
      id: `fb-2-${Date.now()}`,
      title: `${cleanQuery} on Wikipedia, the Free Encyclopedia`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanQuery)}`,
      domain: 'wikipedia.org',
      description: `Comprehensive encyclopedic entry, overview, history, and citations regarding ${cleanQuery}.`,
      category: 'web',
      date: 'Reference',
    },
    {
      id: `fb-3-${Date.now()}`,
      title: `${cleanQuery} Videos, Streams & Discussions on YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`,
      domain: 'youtube.com',
      description: `Watch official trailers, in-depth tutorials, gameplay, and community broadcasts regarding ${cleanQuery}.`,
      category: 'videos',
    },
    {
      id: `fb-4-${Date.now()}`,
      title: `Latest News & Real-Time Headlines on ${cleanQuery}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(cleanQuery)}`,
      domain: 'news.google.com',
      description: `Breaking updates, editorial journalism, press releases, and in-depth articles on ${cleanQuery}.`,
      category: 'news',
      date: 'Latest',
    },
  ];

  return res.json({
    quickAnswer: deterministicAnswer,
    overview: deterministicAnswer?.explanation,
    results: fallbackResults,
    source: 'web_direct_index',
  });
});

// Production static assets or Vite middleware for dev
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cavot Search Engine running on port ${PORT}`);
  });
}

startServer();
