import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  RotateCw,
  Copy,
  Check,
  Heart,
  ArrowLeft,
  FileText,
  Globe,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { SearchResult } from '../types';

interface InAppBrowserViewProps {
  url: string;
  title: string;
  domain: string;
  description?: string;
  snippet?: string;
  onBackToResults: () => void;
  onSearchAgain: (query: string) => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export const InAppBrowserView: React.FC<InAppBrowserViewProps> = ({
  url,
  title,
  domain,
  description,
  snippet,
  onBackToResults,
  onSearchAgain,
  isFavorited,
  onToggleFavorite,
}) => {
  const [viewMode, setViewMode] = useState<'live' | 'reader'>('live');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasIframeError, setHasIframeError] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  // In-app proxy URL to eliminate X-Frame-Options blocking
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    setIsLoading(true);
    setHasIframeError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [url, iframeKey]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    setIsLoading(true);
    setHasIframeError(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-[calc(100vh-60px)]">
      {/* In-App Browser Control & Status Strip */}
      <div className="w-full border-b border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
        {/* Left: Back to Results + Page Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBackToResults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 font-medium text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer shrink-0"
            title="Return to search results"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Results</span>
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 font-mono shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cavot In-App Browser</span>
              <span>·</span>
            </span>
            <span className="font-semibold truncate text-slate-900 dark:text-zinc-100">{title}</span>
          </div>
        </div>

        {/* Right: Mode Switcher + Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle: Live Web vs Reader Mode */}
          <div className="flex items-center rounded-full border border-slate-200 dark:border-zinc-700 p-0.5 bg-slate-100 dark:bg-zinc-800">
            <button
              onClick={() => setViewMode('live')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                viewMode === 'live'
                  ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Live Web</span>
            </button>
            <button
              onClick={() => setViewMode('reader')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                viewMode === 'reader'
                  ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Reader View</span>
            </button>
          </div>

          {/* Favorite Button */}
          <button
            onClick={onToggleFavorite}
            className="p-1.5 rounded-full border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
            title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
          </button>

          {/* Copy URL */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Reload Page */}
          <button
            onClick={handleReload}
            className="p-1.5 rounded-full border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
            title="Reload in-app page"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-400 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Open in External Window */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
            title="Open in new external tab if site blocks embedding"
          >
            <span>External</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 relative flex flex-col">
        {viewMode === 'live' ? (
          <div className="flex-1 w-full h-full relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-7 h-7 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    Loading {domain} in Cavot...
                  </span>
                </div>
              </div>
            )}

            {!hasIframeError ? (
              <iframe
                key={iframeKey}
                src={proxyUrl}
                title={title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setHasIframeError(true);
                  setIsLoading(false);
                }}
                className="w-full h-full min-h-[calc(100vh-110px)] border-none bg-white"
              />
            ) : (
              /* Security Header / CSP Fallback */
              <div className="max-w-2xl mx-auto my-16 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md text-center">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2">
                  External Security Restriction
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  <strong>{domain}</strong> restricts in-app embedding via browser security headers (X-Frame-Options or Content-Security-Policy).
                  You can view the full verified content using Cavot Reader Mode below or open the live website directly.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setViewMode('reader')}
                    className="px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Switch to Cavot Reader Mode
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open {domain}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Reader View */
          <div className="max-w-3xl mx-auto w-full px-6 py-10 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Cavot Clean Reader Mode</span>
              <span>·</span>
              <span>{domain}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-zinc-100">
              {title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 pb-4 mb-6 border-b border-slate-200 dark:border-zinc-800">
              <span className="font-mono">{url}</span>
            </div>

            {description && (
              <div className="text-base sm:text-lg text-slate-800 dark:text-zinc-200 leading-relaxed font-normal mb-6">
                {description}
              </div>
            )}

            {snippet && (
              <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-sm text-slate-700 dark:text-zinc-300 italic mb-8">
                &ldquo;{snippet}&rdquo;
              </div>
            )}

            <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={onBackToResults}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-300 transition-colors"
              >
                ← Back to Search Results
              </button>

              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
