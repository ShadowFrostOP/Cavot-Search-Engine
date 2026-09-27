import { QuickShortcut, SearchResult } from '../types';

export const DEFAULT_SHORTCUTS: QuickShortcut[] = [
  {
    id: 'yt',
    name: 'YouTube',
    shortcut: 'yt',
    url: 'https://www.youtube.com',
    searchUrl: 'https://www.youtube.com/results?search_query=',
  },
  {
    id: 'gh',
    name: 'GitHub',
    shortcut: 'gh',
    url: 'https://github.com',
    searchUrl: 'https://github.com/search?q=',
  },
  {
    id: 'wiki',
    name: 'Wikipedia',
    shortcut: 'wiki',
    url: 'https://en.wikipedia.org',
    searchUrl: 'https://en.wikipedia.org/wiki/Special:Search?search=',
  },
  {
    id: 'ig',
    name: 'Instagram',
    shortcut: 'ig',
    url: 'https://www.instagram.com',
    searchUrl: 'https://www.instagram.com/explore/tags/',
  },
  {
    id: 'g',
    name: 'Google',
    shortcut: 'g',
    url: 'https://www.google.com',
    searchUrl: 'https://www.google.com/search?q=',
  },
];

export const POPULAR_SUGGESTIONS: string[] = [
  'cavot features',
  'best coffee shops nearby',
  'current stock market trends',
  'quantum computing breakthroughs 2026',
  'minimalist design principles',
  'react 19 architecture',
  'autonomous electric vehicles',
  'space exploration missions',
  'black and white web typography',
  'local weather forecast',
];

export const STATIC_RESULTS: SearchResult[] = [
  // Cavot Features
  {
    id: 'cavot-1',
    title: 'Cavot — The Ultra-Clean Monochrome Search Engine',
    url: 'https://cavot.org/overview',
    domain: 'cavot.org',
    description: 'Cavot redefines the search experience with pure black-and-white visual clarity, active screen time tracking, instant website shortcuts, and strict privacy protection.',
    category: 'web',
    date: 'Updated today',
    snippet: 'Cavot is designed with zero distraction: pure monochromatic contrast, real-time keyboard navigation, and seamless shortcut expansions.',
    tags: ['cavot', 'features', 'search engine', 'minimalism'],
  },
  {
    id: 'cavot-2',
    title: 'Cavot Features & Core Philosophy: Zero Clutter, Pure Speed',
    url: 'https://cavot.org/docs/features',
    domain: 'cavot.org',
    description: 'Explore Cavot native capabilities: precise active-usage screen time counter, custom quick search triggers, cross-category search, and local privacy persistence.',
    category: 'web',
    date: 'Sep 2026',
    snippet: 'Real-time visibility detection ensures screen time only accrues while Cavot is actively in focus.',
    tags: ['cavot', 'features', 'speed', 'screen time'],
  },
  {
    id: 'cavot-3',
    title: 'Cavot Architecture: Modern Web Engineering & Monochrome UI',
    url: 'https://dev.cavot.org/architecture',
    domain: 'dev.cavot.org',
    description: 'A deep dive into how Cavot achieves sub-millisecond query parsing, responsive tactile typography, and strict dual-mode black-and-white palettes.',
    category: 'news',
    date: '2 hours ago',
    author: 'Cavot Engineering Lab',
    tags: ['cavot', 'engineering', 'architecture'],
  },
  {
    id: 'cavot-img-1',
    title: 'Cavot Monogram C Lettermark Vector',
    url: 'https://cavot.org/brand/c-lettermark',
    domain: 'cavot.org',
    description: 'High-resolution vector geometry of the custom Cavot C emblem in pure monochrome.',
    category: 'images',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%230a0a0a"/><path d="M260 90H180C140 90 110 120 110 150C110 180 140 210 180 210H260V182H185C165 182 148 168 148 150C148 132 165 118 185 118H260V90Z" fill="white"/></svg>',
    tags: ['cavot', 'logo', 'c-mark'],
  },
  {
    id: 'cavot-vid-1',
    title: 'Introducing Cavot: Pure Search for Modern Minds',
    url: 'https://video.cavot.org/watch?v=intro',
    domain: 'video.cavot.org',
    description: 'A 2-minute walkthrough of Cavot navigation, keyboard shortcut system, and active screen time tracking.',
    category: 'videos',
    videoDuration: '02:14',
    views: '142K views',
    tags: ['cavot', 'video', 'demo'],
  },

  // Coffee
  {
    id: 'coffee-1',
    title: 'The Specialty Coffee Guide: Roasts, Extraction, and Artisanal Cafés',
    url: 'https://coffeegeek.com/guides/specialty-extract',
    domain: 'coffeegeek.com',
    description: 'Explore the science behind pour-over brewing, temperature profiling, single-origin Ethiopian beans, and finding top-tier third-wave coffee shops.',
    category: 'web',
    date: 'Yesterday',
    snippet: 'Top recommended roasters balance bright acidity with stone-fruit sweetness and velvety body.',
    tags: ['coffee', 'shops', 'cafes', 'espresso'],
  },
  {
    id: 'coffee-2',
    title: 'Top 15 Third-Wave Coffee Roasters and Neighborhood Cafés',
    url: 'https://sprudge.com/best-independent-cafes-2026',
    domain: 'sprudge.com',
    description: 'A curated directory of independent coffee shops known for minimalist interior design, flat whites, and sustainable direct-trade sourcing.',
    category: 'web',
    date: '3 days ago',
    tags: ['coffee', 'shops', 'guide'],
  },
  {
    id: 'coffee-map-1',
    title: 'Monochrome Espresso Bar & Roastery',
    url: 'https://maps.cavot.org/place/monochrome-espresso',
    domain: 'maps.cavot.org',
    description: 'Specialty coffee bar featuring Nordic light roast single origins. Minimalist concrete seating, high-speed WiFi, pour-overs.',
    category: 'maps',
    location: '412 Artisan Ave, Downtown District',
    rating: 4.9,
    snippet: 'Open 07:00 – 18:00 daily · Popular for pour-overs & oat flat whites',
    tags: ['coffee', 'nearby', 'maps'],
  },
  {
    id: 'coffee-map-2',
    title: 'Crestline Coffee & Slow Bar',
    url: 'https://maps.cavot.org/place/crestline-coffee',
    domain: 'maps.cavot.org',
    description: 'Quiet coffee studio with siphon brewing and custom seasonal espresso blends.',
    category: 'maps',
    location: '88 North St, Arts Quarter',
    rating: 4.8,
    snippet: 'Open 08:00 – 17:00 · Quiet work atmosphere',
    tags: ['coffee', 'cafes', 'maps'],
  },
  {
    id: 'coffee-shop-1',
    title: 'Fellow Ode Brew Grinder Gen 2 (Matte Black)',
    url: 'https://store.craftcoffee.com/fellow-ode-gen2',
    domain: 'store.craftcoffee.com',
    description: 'Precision home coffee grinder with 64mm professional-grade flat burrs and anti-static ionizer.',
    category: 'shopping',
    price: '$345.00',
    rating: 4.9,
    tags: ['coffee', 'gear', 'grinder'],
  },
  {
    id: 'coffee-book-1',
    title: 'The World Atlas of Coffee: From Beans to Brewing',
    url: 'https://books.cavot.org/title/world-atlas-of-coffee',
    domain: 'books.cavot.org',
    description: 'By James Hoffmann. The definitive guide covering origins, agronomy, harvesting, roasting, and cup cupping protocols.',
    category: 'books',
    author: 'James Hoffmann',
    date: '2024 Revised Edition · 272 pages',
    tags: ['coffee', 'books', 'brewing'],
  },

  // Stock Market / Finance
  {
    id: 'stock-1',
    title: 'Global Financial Markets Digest: Tech Indices & Macro Outlook',
    url: 'https://bloomberg.com/news/markets-today',
    domain: 'bloomberg.com',
    description: 'Equities maintain momentum as tech enterprise earnings exceed consensus. Treasury yields stabilize near 3.85% amid central bank guidance.',
    category: 'news',
    date: '45 mins ago',
    author: 'Financial Markets Desk',
    tags: ['stock', 'market', 'trends', 'finance'],
  },
  {
    id: 'stock-2',
    title: 'Market Indices Today: S&P 500, NASDAQ, and Global Currencies',
    url: 'https://ft.com/markets/equities-overview',
    domain: 'ft.com',
    description: 'Comprehensive financial dashboard tracking equity performance, bond spreads, commodities, and digital asset liquidity pools.',
    category: 'web',
    date: 'Updated 10m ago',
    tags: ['stock', 'market', 'finance', 'investing'],
  },
  {
    id: 'stock-vid-1',
    title: 'Macro Economy 2026: Inflation, Rates, and Market Liquidity',
    url: 'https://youtube.com/watch?v=market-outlook-2026',
    domain: 'youtube.com',
    description: 'Institutional analysis examining debt cycles, manufacturing expansion, and capital expenditure trends across semiconductors.',
    category: 'videos',
    videoDuration: '18:42',
    views: '89K views',
    tags: ['stock', 'market', 'finance'],
  },

  // Technology & AI
  {
    id: 'ai-1',
    title: 'Next-Generation Autonomous Systems: The Leap Beyond Transformers',
    url: 'https://arxiv.org/abs/2609.11029',
    domain: 'arxiv.org',
    description: 'Research synthesis on sparse inference architectures, state-space representations, and reasoning engines operating at high token efficiency.',
    category: 'web',
    date: 'Sep 2026',
    snippet: 'Benchmark evaluations demonstrate up to 4x latency reduction with zero precision degradation.',
    tags: ['ai', 'generative', 'quantum', 'tech'],
  },
  {
    id: 'ai-news-1',
    title: 'Silicon Fabricators Announce 1.4nm Mass Production Roadmap',
    url: 'https://techtimes.com/semiconductor-breakthrough-14nm',
    domain: 'techtimes.com',
    description: 'Next-generation high-NA extreme ultraviolet lithography enables 35% density improvements for server-scale neural coprocessors.',
    category: 'news',
    date: '3 hours ago',
    author: 'Hardware & Tech Desk',
    tags: ['tech', 'hardware', 'semiconductor', 'news'],
  },
  {
    id: 'react-1',
    title: 'React 19 Official Documentation & Architectural Primitives',
    url: 'https://react.dev/blog/2026/react-19-guide',
    domain: 'react.dev',
    description: 'Comprehensive documentation on Actions, Server Components, `use` hook patterns, Asset Loading, and optimistic UI transitions.',
    category: 'web',
    date: 'Official Documentation',
    tags: ['react', 'programming', 'javascript', 'frontend'],
  },
  {
    id: 'book-ai-1',
    title: 'Designing Data-Intensive Applications',
    url: 'https://books.cavot.org/title/designing-data-intensive-apps',
    domain: 'books.cavot.org',
    description: 'By Martin Kleppmann. The essential guide to reliability, scalability, and maintainability in distributed database and storage systems.',
    category: 'books',
    author: 'Martin Kleppmann',
    date: 'O\'Reilly Media · 616 pages',
    tags: ['books', 'tech', 'software', 'databases'],
  },
  {
    id: 'shopping-display-1',
    title: 'Studio Pro 32" 6K Retina Monochrome Monitor',
    url: 'https://gear.techcraft.com/products/retina-6k-display',
    domain: 'gear.techcraft.com',
    description: 'Ultra-high density 218 PPI display with true monochrome calibration mode, Thunderbolt 5 dock, and anodized aluminum bezel.',
    category: 'shopping',
    price: '$1,899.00',
    rating: 4.95,
    tags: ['shopping', 'monitor', 'tech', 'hardware'],
  },
  {
    id: 'weather-1',
    title: 'Cavot Climate & Atmospheric Radar: Real-Time Conditions',
    url: 'https://weather.cavot.org/current',
    domain: 'weather.cavot.org',
    description: 'Hyper-local weather telemetry: 68°F (20°C), Clear skies, 42% humidity, Barometric pressure 30.12 inHg, Wind 4 mph NW. UV Index 3.',
    category: 'web',
    date: 'Live Telemetry',
    snippet: 'Current conditions: Pristine visibility, calm winds. Zero precipitation predicted over the next 6 hours.',
    tags: ['weather', 'forecast', 'temperature'],
  },
];

export function performCavotSearch(query: string, category: string = 'web'): SearchResult[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  // Match static items first
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

  let matches = STATIC_RESULTS.filter((item) => {
    // If category is not 'web' and not matching, downrank or filter
    const matchesCategory = category === 'web' || item.category === category;
    const textToSearch = `${item.title} ${item.description} ${item.domain} ${item.tags?.join(' ') || ''}`.toLowerCase();

    const matchesQuery = queryTokens.some((token) => textToSearch.includes(token));
    return matchesCategory && matchesQuery;
  });

  // If we found specific category matches, return them
  if (matches.length > 0) {
    return matches;
  }

  // If no direct static matches, generate contextual synthetic results so the user never gets a broken experience
  const synthetic: SearchResult[] = generateDynamicResults(query, category);
  return synthetic;
}

function generateDynamicResults(query: string, category: string): SearchResult[] {
  const qTitle = query.charAt(0).toUpperCase() + query.slice(1);
  const cleanSlug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  if (category === 'images') {
    return [
      {
        id: `img-${cleanSlug}-1`,
        title: `${qTitle} — Architectural Minimal Photography`,
        url: `https://visual.cavot.org/view/${cleanSlug}-1`,
        domain: 'visual.cavot.org',
        description: `High-resolution monochrome composition illustrating ${query} with dramatic geometric shadows and clean lines.`,
        category: 'images',
        imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23111111"/><circle cx="200" cy="150" r="80" stroke="white" stroke-width="4"/><path d="M120 150H280M200 70V230" stroke="%23666" stroke-width="2"/><text x="50%" y="270" text-anchor="middle" fill="%23888" font-family="sans-serif" font-size="14">${query.toUpperCase()}</text></svg>`,
      },
      {
        id: `img-${cleanSlug}-2`,
        title: `${qTitle} — Conceptual System Diagram`,
        url: `https://visual.cavot.org/view/${cleanSlug}-2`,
        domain: 'visual.cavot.org',
        description: `Clean black and white vector visualization representing ${query}.`,
        category: 'images',
        imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23fafafa"/><rect x="80" y="60" width="240" height="180" rx="8" stroke="%23111" stroke-width="3"/><path d="M80 120H320M160 120V240" stroke="%23999" stroke-width="2"/><text x="50%" y="45" text-anchor="middle" fill="%23111" font-family="sans-serif" font-size="14" font-weight="bold">${query.toUpperCase()}</text></svg>`,
      },
      {
        id: `img-${cleanSlug}-3`,
        title: `${qTitle} — Studio High-Contrast Asset`,
        url: `https://visual.cavot.org/view/${cleanSlug}-3`,
        domain: 'visual.cavot.org',
        description: `Monochromatic studio capture highlighting the textural form of ${query}.`,
        category: 'images',
        imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23050505"/><polygon points="200,60 290,220 110,220" stroke="white" stroke-width="3" fill="none"/><text x="50%" y="260" text-anchor="middle" fill="%23aaa" font-family="sans-serif" font-size="12">${query}</text></svg>`,
      },
    ];
  }

  if (category === 'videos') {
    return [
      {
        id: `vid-${cleanSlug}-1`,
        title: `Comprehensive Analysis: Understanding ${qTitle}`,
        url: `https://media.cavot.org/watch?v=${cleanSlug}-guide`,
        domain: 'media.cavot.org',
        description: `A masterclass breakdown detailing fundamentals, recent developments, and practical applications of ${query}.`,
        category: 'videos',
        videoDuration: '14:28',
        views: '210K views',
        date: '3 weeks ago',
      },
      {
        id: `vid-${cleanSlug}-2`,
        title: `${qTitle} Explained in 5 Minutes`,
        url: `https://media.cavot.org/watch?v=${cleanSlug}-fast`,
        domain: 'media.cavot.org',
        description: `Key principles, operational dynamics, and essential takeaways for ${query}.`,
        category: 'videos',
        videoDuration: '05:12',
        views: '45K views',
        date: '2 months ago',
      },
    ];
  }

  if (category === 'news') {
    return [
      {
        id: `news-${cleanSlug}-1`,
        title: `Industry Report: The Rapid Evolution of ${qTitle} in 2026`,
        url: `https://news.cavot.org/articles/${cleanSlug}-growth`,
        domain: 'news.cavot.org',
        description: `Global researchers and enterprise teams evaluate emerging benchmarks and structural shifts surrounding ${query}.`,
        category: 'news',
        author: 'Global Bureau Desk',
        date: '1 hour ago',
      },
      {
        id: `news-${cleanSlug}-2`,
        title: `Key Findings and Future Trajectories for ${qTitle}`,
        url: `https://techtimes.com/pulse/${cleanSlug}-trajectory`,
        domain: 'techtimes.com',
        description: `Comprehensive briefing covering regulatory frameworks, innovation indices, and deployment metrics for ${query}.`,
        category: 'news',
        author: 'Analytical Insights',
        date: '5 hours ago',
      },
    ];
  }

  if (category === 'maps') {
    return [
      {
        id: `map-${cleanSlug}-1`,
        title: `${qTitle} Headquarters & Experience Studio`,
        url: `https://maps.cavot.org/place/${cleanSlug}-studio`,
        domain: 'maps.cavot.org',
        description: `Dedicated hub and interactive center for ${query}. Open to visitors by appointment.`,
        category: 'maps',
        location: `100 Innovation Boulevard, Tech District`,
        rating: 4.8,
        snippet: 'Open Mon-Fri 09:00 - 18:00 · Verified Location',
      },
      {
        id: `map-${cleanSlug}-2`,
        title: `Metropolitan ${qTitle} Association`,
        url: `https://maps.cavot.org/place/${cleanSlug}-center`,
        domain: 'maps.cavot.org',
        description: `Community knowledge center and collaborative workspace specialized in ${query}.`,
        category: 'maps',
        location: `540 Heritage Way, Suite 300`,
        rating: 4.7,
        snippet: 'Public access · Wheelchair accessible',
      },
    ];
  }

  if (category === 'shopping') {
    return [
      {
        id: `shop-${cleanSlug}-1`,
        title: `Premium ${qTitle} Precision Kit — Obsidian Edition`,
        url: `https://store.cavot.org/products/${cleanSlug}-kit`,
        domain: 'store.cavot.org',
        description: `Engineered with aircraft-grade aluminum, matte black anodized surface, and ergonomic tactile design for ${query}.`,
        category: 'shopping',
        price: '$129.00',
        rating: 4.9,
      },
      {
        id: `shop-${cleanSlug}-2`,
        title: `The Essential ${qTitle} Reference Companion`,
        url: `https://goods.cavot.org/products/${cleanSlug}-companion`,
        domain: 'goods.cavot.org',
        description: `Compact physical toolkit designed to optimize daily efficiency and mastery of ${query}.`,
        category: 'shopping',
        price: '$59.50',
        rating: 4.7,
      },
    ];
  }

  if (category === 'books') {
    return [
      {
        id: `book-${cleanSlug}-1`,
        title: `The Foundations of ${qTitle}: Principles & Practice`,
        url: `https://books.cavot.org/read/${cleanSlug}-foundations`,
        domain: 'books.cavot.org',
        description: `Comprehensive academic text analyzing the core mechanisms, historical development, and future challenges of ${query}.`,
        category: 'books',
        author: 'Dr. Evelyn Sterling & Dr. Marcus Vance',
        date: 'Oxford University Press · 480 pages',
      },
      {
        id: `book-${cleanSlug}-2`,
        title: `Mastering ${qTitle}: A Pragmatic Approach`,
        url: `https://books.cavot.org/read/${cleanSlug}-mastery`,
        domain: 'books.cavot.org',
        description: `A hands-on manual designed for professionals seeking deep domain fluency and rapid execution.`,
        category: 'books',
        author: 'Julian Croft',
        date: 'Cavot Publishing · 310 pages',
      },
    ];
  }

  // Default web results
  return [
    {
      id: `web-${cleanSlug}-1`,
      title: `${qTitle} — Comprehensive Overview, Standards & Guide`,
      url: `https://reference.cavot.org/wiki/${cleanSlug}`,
      domain: 'reference.cavot.org',
      description: `In-depth exploration of ${query}. Discover definitions, core architectures, real-world case studies, and authoritative source documentation.`,
      category: 'web',
      date: 'Updated 2 hours ago',
      snippet: `Comprehensive directory and contextual index exploring ${query} across modern standards and industry benchmarks.`,
      tags: [query, 'guide', 'reference'],
    },
    {
      id: `web-${cleanSlug}-2`,
      title: `Latest Developments and Insights on ${qTitle}`,
      url: `https://journal.independent.org/article/${cleanSlug}-insights`,
      domain: 'journal.independent.org',
      description: `Analytical publication reviewing contemporary trends, historical context, and experimental findings in relation to ${query}.`,
      category: 'web',
      date: 'Yesterday',
      snippet: `Critical examination of methodologies, implementation challenges, and breakthrough performance metrics.`,
      tags: [query, 'analysis'],
    },
    {
      id: `web-${cleanSlug}-3`,
      title: `${qTitle}: Architecture, Tools, and Modern Best Practices`,
      url: `https://devhub.io/insights/${cleanSlug}`,
      domain: 'devhub.io',
      description: `Technical deep-dive providing structured frameworks, reproducible examples, and workflow strategies for ${query}.`,
      category: 'web',
      date: 'Sep 2026',
      snippet: `Learn how leading practitioners streamline execution and elevate precision with modern toolchains.`,
      tags: [query, 'practices'],
    },
    {
      id: `web-${cleanSlug}-4`,
      title: `The Future of ${qTitle}: 2026 and Beyond`,
      url: `https://perspectives.tech/future-of-${cleanSlug}`,
      domain: 'perspectives.tech',
      description: `Thought-leadership essay examining the socio-economic and technological trajectory of ${query} over the next decade.`,
      category: 'web',
      date: '4 days ago',
      snippet: `Interviews with domain pioneers and predictive modelling highlight transformative potential.`,
      tags: [query, 'future'],
    },
  ];
}
