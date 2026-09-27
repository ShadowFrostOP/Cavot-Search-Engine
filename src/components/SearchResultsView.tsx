import React, { useState } from 'react';
import {
  Heart,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Clock,
  Sparkles,
  MapPin,
  Star,
  Play,
  ShoppingBag,
  BookOpen,
  Image as ImageIcon,
  Newspaper,
  Compass,
  SlidersHorizontal,
  Globe,
  HelpCircle,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import { SearchResult, SearchCategory, QuickAnswer } from '../types';

interface SearchResultsViewProps {
  query: string;
  category: SearchCategory;
  onSelectCategory: (category: SearchCategory) => void;
  results: SearchResult[];
  quickAnswer?: QuickAnswer | null;
  overview?: string;
  favorites: Record<string, boolean>;
  onToggleFavorite: (result: SearchResult) => void;
  onSearch: (query: string) => void;
  onOpenResult: (result: SearchResult) => void;
}

const CATEGORIES: { id: SearchCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'web', label: 'All', icon: Compass },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'videos', label: 'Videos', icon: Play },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'maps', label: 'Maps', icon: MapPin },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'books', label: 'Books', icon: BookOpen },
];

function getFaviconUrl(domain: string): string {
  try {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
  } catch {
    return '';
  }
}

function getSiteDisplayName(domain: string): string {
  const d = domain.toLowerCase();
  if (d.includes('youtube.com')) return 'YouTube';
  if (d.includes('wikipedia.org')) return 'Wikipedia';
  if (d.includes('github.com')) return 'GitHub';
  if (d.includes('minecraft.net')) return 'Minecraft';
  if (d.includes('python.org')) return 'Python.org';
  if (d.includes('weather.com')) return 'The Weather Channel';
  if (d.includes('accuweather.com')) return 'AccuWeather';
  if (d.includes('pmd.gov.pk')) return 'Pakistan Meteorological Department';
  if (d.includes('britannica.com')) return 'Britannica';
  if (d.includes('w3schools.com')) return 'W3Schools';
  if (d.includes('freecodecamp.org')) return 'freeCodeCamp';
  if (d.includes('realpython.com')) return 'Real Python';
  if (d.includes('bbc.com')) return 'BBC News';
  if (d.includes('reddit.com')) return 'Reddit';

  const parts = d.replace(/^www\./, '').split('.');
  if (parts.length >= 2) {
    const main = parts[parts.length - 2];
    return main.charAt(0).toUpperCase() + main.slice(1);
  }
  return domain;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  category,
  onSelectCategory,
  results,
  quickAnswer,
  overview,
  favorites,
  onToggleFavorite,
  onSearch,
  onOpenResult,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<'any' | '24h' | 'week' | 'month'>('any');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<SearchResult | null>(null);

  const handleCopyLink = (item: SearchResult) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const answer = quickAnswer || (overview ? { direct: '', explanation: overview } : null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 md:py-6">
      {/* Category Tabs Strip */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 mb-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-2">
          {CATEGORIES.slice(0, 5).map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}

          {/* More Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 rounded-full transition-colors cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showMoreMenu && (
              <div className="absolute top-full left-0 mt-1 py-1.5 w-36 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150">
                {CATEGORIES.slice(5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left cursor-pointer transition-colors ${
                      category === cat.id
                        ? 'font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tools Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
              showFilters
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium'
                : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Tools</span>
          </button>
        </div>
      </div>

      {/* Filter Options Bar */}
      {showFilters && (
        <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-xs animate-in fade-in duration-150">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Time filter:</span>
          {(['any', '24h', 'week', 'month'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                timeFilter === t
                  ? 'bg-blue-600 text-white font-medium shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              {t === 'any' ? 'Any time' : t === '24h' ? 'Past 24 hours' : t === 'week' ? 'Past week' : 'Past month'}
            </button>
          ))}
        </div>
      )}

      {/* Result Metrics */}
      <div className="text-xs text-slate-500 dark:text-zinc-400 mb-4 flex items-center justify-between">
        <span>About {results.length * 1420 + 84} results (0.11 seconds)</span>
        <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-zinc-500">
          Cavot is designed to minimize unnecessary data and processing
        </span>
      </div>

      {/* 
        PREMIUM QUICK ANSWER CARD (Above normal results, never replacing them)
        Direct factual / Yes-No / Calculation / Definition answer
      */}
      {answer && (
        <div className="cavot-quick-answer mb-6 p-4 sm:p-5 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/30 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              {answer.type === 'calc' ? (
                <Calculator className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>
                {answer.type === 'calc'
                  ? 'Calculation'
                  : answer.type === 'weather'
                  ? 'Live Meteorological Telemetry'
                  : 'Direct Fact Answer'}
              </span>
            </div>

            {answer.source && (
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                {answer.source}
              </span>
            )}
          </div>

          {answer.direct && (
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
              <span>{answer.direct}</span>
              {answer.direct === 'Yes.' && (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 inline-block shrink-0" />
              )}
            </div>
          )}

          <div className="text-sm sm:text-base font-normal text-slate-700 dark:text-zinc-200 leading-relaxed">
            {answer.explanation}
          </div>
        </div>
      )}

      {/* Results Rendering according to category */}
      {results.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-2">No results found</div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
            We couldn&apos;t find any matches for &ldquo;{query}&rdquo;. Try checking for typos or searching for a different keyword.
          </p>
          <button
            onClick={() => onSearch('Minecraft')}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Try searching &ldquo;Minecraft&rdquo;
          </button>
        </div>
      ) : category === 'images' ? (
        /* Image Results Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((item, idx) => {
            const isFav = !!favorites[item.id];
            return (
              <div
                key={item.id}
                className="cavot-result-item group relative rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 flex flex-col shadow-2xs hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
              >
                <div
                  className="aspect-[4/3] w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden cursor-pointer flex items-center justify-center"
                  onClick={() => setSelectedImage(item)}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 opacity-20 text-slate-400" />
                  )}
                </div>

                <div className="p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate text-slate-900 dark:text-zinc-100">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                      {item.domain}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(item)}
                    className="p-1 rounded-md text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : category === 'videos' ? (
        /* Video Results Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((item, idx) => {
            const isFav = !!favorites[item.id];
            return (
              <div
                key={item.id}
                className="cavot-result-item rounded-xl border border-slate-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-2xs hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                    <span className="font-medium text-slate-700 dark:text-zinc-300">{item.domain}</span>
                    <span>·</span>
                    <span>{item.views || 'Verified video'}</span>
                  </div>
                  <button
                    onClick={() => onToggleFavorite(item)}
                    className="p-1 rounded hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <div
                  onClick={() => onOpenResult(item)}
                  className="relative aspect-video w-full rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mb-3 group cursor-pointer overflow-hidden"
                >
                  <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-110 shadow-md transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  {item.videoDuration && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono bg-black/80 text-white backdrop-blur-xs">
                      {item.videoDuration}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenResult(item)}
                    className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline text-left block cursor-pointer"
                  >
                    {item.title}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors shrink-0"
                    title="Open in external tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* Standard Web, News, Shopping, Books, Maps Results List - Google / Chrome Clean Hierarchy */
        <div className="flex flex-col gap-6 sm:gap-7">
          {results.map((item, idx) => {
            const isFav = !!favorites[item.id];
            const isCopied = copiedId === item.id;
            const siteName = getSiteDisplayName(item.domain);
            const faviconUrl = getFaviconUrl(item.domain);

            return (
              <article
                key={item.id}
                className="cavot-result-item group flex flex-col"
                style={{
                  animationDelay: `${Math.min(idx * 30, 300)}ms`,
                }}
              >
                {/* 1. Header: Favicon + Website Name + URL/Breadcrumb */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Site Favicon */}
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                      {faviconUrl ? (
                        <img
                          src={faviconUrl}
                          alt=""
                          loading="lazy"
                          className="w-4 h-4 object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                        {siteName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono truncate">
                        {item.url}
                      </span>
                    </div>
                  </div>

                  {/* Micro Actions: Favorite & Copy */}
                  <div className="flex items-center gap-1 shrink-0 ml-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyLink(item)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Copy URL"
                      aria-label="Copy link"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onToggleFavorite(item)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-transform active:scale-90 cursor-pointer"
                      title={isFav ? 'Remove from favorites' : 'Favorite this result'}
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-all duration-200 ${
                          isFav ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 2. Clickable Result Title */}
                <h3 className="text-lg sm:text-xl font-normal leading-snug">
                  <button
                    type="button"
                    onClick={() => onOpenResult(item)}
                    className="cavot-result-title text-left cursor-pointer font-medium hover:underline inline"
                  >
                    <span>{item.title}</span>
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex p-1 ml-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors align-middle"
                    title="Open in new external tab"
                    aria-label="Open externally"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h3>

                {/* 3. Description & Snippet */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed max-w-3xl">
                  {item.description}
                </p>

                {item.snippet && item.snippet !== item.description && (
                  <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 pl-3 border-l-2 border-slate-300 dark:border-zinc-700 italic">
                    &ldquo;{item.snippet}&rdquo;
                  </div>
                )}

                {/* 4. Metadata badges */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-zinc-400">
                  {item.date && (
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.date}
                    </span>
                  )}
                  {item.author && <span className="text-[11px]">By {item.author}</span>}
                  {item.price && (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                      {item.price}
                    </span>
                  )}
                  {item.rating && (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      {item.rating}
                    </span>
                  )}
                  {item.location && (
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {item.location}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
