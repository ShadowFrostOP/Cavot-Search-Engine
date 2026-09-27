import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sun,
  Moon,
  Settings,
  User,
  MoreHorizontal,
  Search,
  Globe,
  Lock,
} from 'lucide-react';
import { CavotLogo } from './CavotLogo';

interface TopControlBarProps {
  currentQuery: string;
  currentView: 'home' | 'results' | 'browser';
  activeUrl?: string;
  onNavigateHome: () => void;
  onSearch: (query: string) => void;
  onNavigateUrl?: (url: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenAccount: () => void;
  onOpenMore: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isRefreshing?: boolean;
}

export const TopControlBar: React.FC<TopControlBarProps> = ({
  currentQuery,
  currentView,
  activeUrl = '',
  onNavigateHome,
  onSearch,
  onNavigateUrl,
  theme,
  onToggleTheme,
  onOpenSettings,
  onOpenAccount,
  onOpenMore,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onRefresh,
  isRefreshing = false,
}) => {
  const [addressInput, setAddressInput] = useState<string>('');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);

  // Address display for omnibar
  const addressDisplay =
    currentView === 'browser' && activeUrl
      ? activeUrl
      : currentView === 'results'
      ? `cavot://search?q=${encodeURIComponent(currentQuery)}`
      : 'cavot://newtab';

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = addressInput.trim();
    if (!target) return;

    if (target.toLowerCase() === 'cavot://newtab' || target.toLowerCase() === 'home') {
      onNavigateHome();
      setIsEditingAddress(false);
      return;
    }

    if (target.startsWith('cavot://search?q=')) {
      try {
        const url = new URL(target.replace('cavot://', 'http://'));
        const q = url.searchParams.get('q') || target;
        onSearch(q);
      } catch {
        onSearch(target);
      }
      setIsEditingAddress(false);
      return;
    }

    if (/^https?:\/\//i.test(target) || /^www\./i.test(target) || /\.(com|org|net|io|edu|gov|co|ai|dev)(\/.*)?$/i.test(target)) {
      let finalUrl = target;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      if (onNavigateUrl) {
        onNavigateUrl(finalUrl);
        setIsEditingAddress(false);
        return;
      }
    }

    onSearch(target);
    setIsEditingAddress(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 sm:px-5 py-2.5 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* LEFT SECTION: Logo + Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <CavotLogo
            size="sm"
            showWordmark={currentView !== 'browser'}
            theme={theme}
            onClick={onNavigateHome}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          />

          {/* Browser Back / Forward / Refresh */}
          <div className="flex items-center gap-0.5 ml-1 sm:ml-2">
            <button
              onClick={onGoBack}
              disabled={!canGoBack}
              className="p-1.5 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Click to go back"
              aria-label="Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onGoForward}
              disabled={!canGoForward}
              className="p-1.5 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Click to go forward"
              aria-label="Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRefresh}
              className="p-1.5 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Reload page"
              aria-label="Refresh"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION: Chrome-style Omnibox / Search & Address Bar */}
        <div className="flex-1 max-w-2xl min-w-0">
          {isEditingAddress ? (
            <form onSubmit={handleAddressSubmit} className="relative w-full">
              <input
                type="text"
                autoFocus
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onBlur={() => setIsEditingAddress(false)}
                placeholder="Search Google or enter web URL..."
                className="w-full px-4 py-1.5 text-xs sm:text-sm font-sans rounded-full border border-blue-500 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none ring-2 ring-blue-500/20 shadow-xs"
              />
            </form>
          ) : (
            <div
              onClick={() => {
                setAddressInput(currentView === 'browser' ? activeUrl : currentView === 'results' ? currentQuery : '');
                setIsEditingAddress(true);
              }}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 cursor-text transition-all truncate shadow-2xs"
              title="Search or enter web address"
            >
              <div className="flex items-center gap-1.5 shrink-0 text-slate-400 dark:text-zinc-500">
                {currentView === 'browser' ? (
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="truncate flex-1 font-normal select-none">
                {addressDisplay}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Theme Switcher + Settings + Account + More */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title={`Toggle Theme (Current: ${theme})`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Search Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* More options */}
          <button
            onClick={onOpenMore}
            className="p-2 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="More Options & Tools"
            aria-label="More"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* User Account Avatar */}
          <button
            onClick={onOpenAccount}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-blue-500/40 transition-all cursor-pointer"
            title="Cavot Account"
            aria-label="Account"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
