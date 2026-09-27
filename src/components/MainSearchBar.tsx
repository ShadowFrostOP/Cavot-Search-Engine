import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, X, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { POPULAR_SUGGESTIONS } from '../data/mockSearchData';
import { QuickShortcut } from '../types';

interface MainSearchBarProps {
  onSearch: (query: string) => void;
  onOpenVoice: () => void;
  onOpenImage: () => void;
  recentSearches: string[];
  shortcuts: QuickShortcut[];
  initialValue?: string;
  autoFocus?: boolean;
}

interface SuggestionItem {
  text: string;
  type: 'recent' | 'popular' | 'shortcut' | 'suggestion';
  targetUrl?: string;
}

export const MainSearchBar: React.FC<MainSearchBarProps> = ({
  onSearch,
  onOpenVoice,
  onOpenImage,
  recentSearches,
  shortcuts,
  initialValue = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Compute suggestions based on input
  const suggestions: SuggestionItem[] = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      const recents: SuggestionItem[] = recentSearches.slice(0, 4).map((s) => ({ text: s, type: 'recent' }));
      const popular: SuggestionItem[] = POPULAR_SUGGESTIONS.slice(0, 4).map((s) => ({ text: s, type: 'popular' }));
      return [...recents, ...popular];
    }

    const prefixMatch = shortcuts.find((sc) => trimmed.startsWith(sc.shortcut + ' '));
    const list: SuggestionItem[] = [];

    if (prefixMatch) {
      const rest = query.trim().slice(prefixMatch.shortcut.length).trim();
      list.push({
        text: `Search on ${prefixMatch.name}: "${rest || '...'}"`,
        type: 'shortcut',
        targetUrl: prefixMatch.searchUrl ? `${prefixMatch.searchUrl}${encodeURIComponent(rest)}` : undefined,
      });
    }

    recentSearches
      .filter((s) => s.toLowerCase().includes(trimmed) && s.toLowerCase() !== trimmed)
      .slice(0, 3)
      .forEach((s) => list.push({ text: s, type: 'recent' }));

    POPULAR_SUGGESTIONS
      .filter((s) => s.toLowerCase().includes(trimmed))
      .slice(0, 4)
      .forEach((s) => {
        if (!list.some((item) => item.text.toLowerCase() === s.toLowerCase())) {
          list.push({ text: s, type: 'suggestion' });
        }
      });

    return list;
  }, [query, recentSearches, shortcuts]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      const item = suggestions[selectedIndex];
      if (item.targetUrl) {
        window.open(item.targetUrl, '_blank', 'noopener,noreferrer');
        setIsFocused(false);
        return;
      }
      onSearch(item.text);
    } else if (query.trim()) {
      onSearch(query.trim());
    }
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused && e.key === '/') {
      e.preventDefault();
      inputRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectSuggestion = (text: string, targetUrl?: string) => {
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setIsFocused(false);
      return;
    }
    setQuery(text);
    onSearch(text);
    setIsFocused(false);
  };

  const isOpen = isFocused && suggestions.length > 0;

  return (
    <div ref={containerRef} className="w-full max-w-2xl relative mx-auto z-30">
      {/* Main Search Bar Shell - Google/Chrome Inspired Modern Pill */}
      <div
        className={`group relative flex items-center w-full transition-all duration-200 border ${
          isOpen
            ? 'rounded-t-3xl rounded-b-none border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg'
            : isFocused
            ? 'rounded-full border-blue-500/80 dark:border-blue-400 ring-4 ring-blue-500/10 dark:ring-blue-400/15 shadow-md bg-white dark:bg-zinc-900'
            : 'rounded-full border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Search Icon */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="pl-4 sm:pl-5 pr-2 py-3.5 text-slate-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search the web or type a URL"
            autoFocus={autoFocus}
            className="w-full py-3.5 px-2 bg-transparent text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-base outline-none font-normal"
          />
        </form>

        {/* Action icons right: Clear + Mic + Lens/Image */}
        <div className="flex items-center gap-1 sm:gap-1.5 pr-3 sm:pr-4">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Clear search text"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search */}
          <button
            type="button"
            onClick={onOpenVoice}
            className="p-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
            title="Search by voice"
            aria-label="Search by voice"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Image / Lens Search */}
          <button
            type="button"
            onClick={onOpenImage}
            className="p-2 rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
            title="Search by image"
            aria-label="Search by image"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modern Connected Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-x border-b border-slate-300 dark:border-zinc-700 rounded-b-3xl shadow-xl overflow-hidden pt-1 pb-2">
          <div className="border-t border-slate-100 dark:border-zinc-800 mx-4 mb-1" />
          {suggestions.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={`${item.type}-${idx}-${item.text}`}
                onMouseDown={() => selectSuggestion(item.text, item.targetUrl)}
                className={`flex items-center justify-between px-5 py-2.5 cursor-pointer text-sm transition-colors ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.type === 'recent' ? (
                    <Clock className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                  ) : item.type === 'shortcut' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                  )}
                  <span className="truncate">{item.text}</span>
                </div>

                <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-normal shrink-0 ml-2">
                  {item.type === 'recent' && 'Recent'}
                  {item.type === 'popular' && 'Trending'}
                  {item.type === 'shortcut' && 'Shortcut'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
