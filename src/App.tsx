/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { CavotLogo } from './components/CavotLogo';
import { TopControlBar } from './components/TopControlBar';
import { MainSearchBar } from './components/MainSearchBar';
import { QuickSearchSection } from './components/QuickSearchSection';
import { SearchResultsView } from './components/SearchResultsView';
import { InAppBrowserView } from './components/InAppBrowserView';
import { ScreenTimeWidget } from './components/ScreenTimeWidget';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { ImageSearchModal } from './components/ImageSearchModal';
import { SettingsModal } from './components/SettingsModal';
import { AccountDrawer } from './components/AccountDrawer';
import { MoreMenuModal } from './components/MoreMenuModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { DEFAULT_SHORTCUTS } from './data/mockSearchData';
import { executeRealWebSearch } from './services/searchService';
import {
  QuickShortcut,
  SearchResult,
  SearchCategory,
  AppSettings,
  FavoriteItem,
  SearchHistoryItem,
  QuickAnswer,
} from './types';

const SETTINGS_KEY = 'cavot_settings_v4';
const SHORTCUTS_KEY = 'cavot_shortcuts_v4';
const FAVORITES_KEY = 'cavot_favorites_v4';
const HISTORY_KEY = 'cavot_history_v4';
const SAVED_SEARCHES_KEY = 'cavot_saved_searches_v4';

interface BrowserPageInfo {
  url: string;
  title: string;
  domain: string;
  description?: string;
  snippet?: string;
}

interface NavigationHistoryItem {
  query: string;
  view: 'home' | 'results' | 'browser';
  category: SearchCategory;
  browserPage?: BrowserPageInfo;
}

export default function App() {
  // Navigation & Page State (home, results, in-app browser)
  const [currentView, setCurrentView] = useState<'home' | 'results' | 'browser'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('web');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [quickAnswer, setQuickAnswer] = useState<QuickAnswer | null>(null);
  const [searchOverview, setSearchOverview] = useState<string | undefined>(undefined);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeBrowserPage, setActiveBrowserPage] = useState<BrowserPageInfo | null>(null);
  const [, startTransition] = useTransition();

  // History Stack for In-App Back/Forward Browser Navigation
  const [navHistory, setNavHistory] = useState<NavigationHistoryItem[]>([
    { query: '', view: 'home', category: 'web' },
  ]);
  const [navIndex, setNavIndex] = useState<number>(0);

  // Undo/Redo Action Stack
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      theme: 'light',
      safeSearch: 'moderate',
      resultsPerPage: 10,
      openInNewTab: false,
      autoSuggest: true,
      historyTracking: true,
      screenTimeGoalMin: 60,
      region: 'Global',
      language: 'English',
    };
  });

  // Apply Theme class to document root with clean light/dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.remove('bg-white', 'text-slate-900');
      document.body.classList.add('bg-zinc-950', 'text-zinc-100');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('bg-zinc-950', 'text-zinc-100');
      document.body.classList.add('bg-white', 'text-slate-900');
    }
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Quick Shortcuts State
  const [shortcuts, setShortcuts] = useState<QuickShortcut[]>(() => {
    try {
      const saved = localStorage.getItem(SHORTCUTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SHORTCUTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcuts));
    } catch {}
  }, [shortcuts]);

  // Favorites State
  const [favoritesList, setFavoritesList] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const favoritesMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    favoritesList.forEach((f) => {
      map[f.resultId] = true;
    });
    return map;
  }, [favoritesList]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesList));
    } catch {}
  }, [favoritesList]);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory));
    } catch {}
  }, [searchHistory]);

  // Saved Searches
  const [savedSearches, setSavedSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['Minecraft', 'weather in Pakistan', 'YouTube', 'cavot features'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(savedSearches));
    } catch {}
  }, [savedSearches]);

  // Modals & Panels State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState<boolean>(false);

  // REAL SEARCH EXECUTION (Results stay completely inside Cavot)
  const handleExecuteSearch = useCallback(
    async (query: string, category: SearchCategory = 'web', pushToHistory: boolean = true) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      // Check if user entered a shortcut syntax, e.g. "yt funny cats"
      const parts = trimmed.split(/\s+/);
      const prefix = parts[0]?.toLowerCase();
      const shortcutMatch = shortcuts.find((sc) => sc.shortcut.toLowerCase() === prefix);

      if (shortcutMatch && parts.length > 1) {
        const queryPart = parts.slice(1).join(' ');
        if (shortcutMatch.searchUrl) {
          const target = `${shortcutMatch.searchUrl}${encodeURIComponent(queryPart)}`;
          handleNavigateUrl(target);
          return;
        }
      }

      // Record in undo stack
      if (searchQuery && searchQuery !== trimmed) {
        setUndoStack((prev) => [...prev, searchQuery]);
        setRedoStack([]);
      }

      setSearchQuery(trimmed);
      setSearchCategory(category);
      setIsLoadingSearch(true);
      setCurrentView('results');

      // Update Navigation Stack
      if (pushToHistory) {
        setNavHistory((prev) => {
          const next = prev.slice(0, navIndex + 1);
          return [...next, { query: trimmed, view: 'results', category }];
        });
        setNavIndex((prev) => prev + 1);
      }

      // Record search in history if tracking enabled
      if (settings.historyTracking) {
        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());
          return [
            {
              id: `hist-${Date.now()}`,
              query: trimmed,
              timestamp: Date.now(),
              category,
            },
            ...filtered,
          ].slice(0, 50);
        });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Execute real web search
      try {
        const response = await executeRealWebSearch(trimmed, category);
        startTransition(() => {
          setSearchResults(response.results);
          setQuickAnswer(response.quickAnswer || null);
          setSearchOverview(response.overview);
          setIsLoadingSearch(false);
        });
      } catch (err) {
        console.error('Real web search error:', err);
        setIsLoadingSearch(false);
      }
    },
    [shortcuts, searchQuery, navIndex, settings.historyTracking]
  );

  // Open a search result directly INSIDE Cavot's in-app browser
  const handleOpenResult = useCallback(
    (result: SearchResult) => {
      const pageInfo: BrowserPageInfo = {
        url: result.url,
        title: result.title,
        domain: result.domain,
        description: result.description,
        snippet: result.snippet,
      };
      setActiveBrowserPage(pageInfo);
      setCurrentView('browser');

      setNavHistory((prev) => {
        const next = prev.slice(0, navIndex + 1);
        return [
          ...next,
          {
            query: searchQuery,
            view: 'browser',
            category: searchCategory,
            browserPage: pageInfo,
          },
        ];
      });
      setNavIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchQuery, searchCategory, navIndex]
  );

  // Navigate to an arbitrary URL directly inside Cavot's in-app browser
  const handleNavigateUrl = useCallback(
    (url: string) => {
      let cleanDomain = 'web';
      try {
        cleanDomain = new URL(url).hostname;
      } catch {}

      const pageInfo: BrowserPageInfo = {
        url,
        title: cleanDomain,
        domain: cleanDomain,
        description: `Browsing ${url} directly inside Cavot`,
      };
      setActiveBrowserPage(pageInfo);
      setCurrentView('browser');

      setNavHistory((prev) => {
        const next = prev.slice(0, navIndex + 1);
        return [
          ...next,
          {
            query: searchQuery,
            view: 'browser',
            category: searchCategory,
            browserPage: pageInfo,
          },
        ];
      });
      setNavIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchQuery, searchCategory, navIndex]
  );

  // Navigation: Go Back
  const handleGoBack = () => {
    if (navIndex > 0) {
      const targetIndex = navIndex - 1;
      const targetState = navHistory[targetIndex];
      setNavIndex(targetIndex);
      setCurrentView(targetState.view);
      setSearchQuery(targetState.query);
      setSearchCategory(targetState.category);

      if (targetState.view === 'browser' && targetState.browserPage) {
        setActiveBrowserPage(targetState.browserPage);
      } else if (targetState.view === 'results' && targetState.query) {
        handleExecuteSearch(targetState.query, targetState.category, false);
      }
    }
  };

  // Navigation: Go Forward
  const handleGoForward = () => {
    if (navIndex < navHistory.length - 1) {
      const targetIndex = navIndex + 1;
      const targetState = navHistory[targetIndex];
      setNavIndex(targetIndex);
      setCurrentView(targetState.view);
      setSearchQuery(targetState.query);
      setSearchCategory(targetState.category);

      if (targetState.view === 'browser' && targetState.browserPage) {
        setActiveBrowserPage(targetState.browserPage);
      } else if (targetState.view === 'results' && targetState.query) {
        handleExecuteSearch(targetState.query, targetState.category, false);
      }
    }
  };

  // Navigation: Return to Home
  const handleNavigateHome = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setActiveBrowserPage(null);
      setSearchQuery('');
      setNavHistory((prev) => [...prev.slice(0, navIndex + 1), { query: '', view: 'home', category: 'web' }]);
      setNavIndex((prev) => prev + 1);
    }
  };

  // Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (currentView === 'results' && searchQuery) {
      handleExecuteSearch(searchQuery, searchCategory, false).finally(() => {
        setIsRefreshing(false);
      });
    } else if (currentView === 'browser' && activeBrowserPage) {
      // Force refresh in-app browser view
      const current = activeBrowserPage;
      setActiveBrowserPage(null);
      setTimeout(() => {
        setActiveBrowserPage(current);
        setIsRefreshing(false);
      }, 100);
    } else {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  // Undo Action
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousQuery = undoStack[undoStack.length - 1];
      setUndoStack((prev) => prev.slice(0, -1));
      setRedoStack((prev) => [...prev, searchQuery]);
      handleExecuteSearch(previousQuery, searchCategory, true);
    }
  };

  // Redo Action
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextQuery = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, -1));
      setUndoStack((prev) => [...prev, searchQuery]);
      handleExecuteSearch(nextQuery, searchCategory, true);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (result: SearchResult) => {
    setFavoritesList((prev) => {
      const exists = prev.some((item) => item.resultId === result.id);
      if (exists) {
        return prev.filter((item) => item.resultId !== result.id);
      } else {
        const newFav: FavoriteItem = {
          id: `fav-${Date.now()}`,
          resultId: result.id,
          title: result.title,
          url: result.url,
          domain: result.domain,
          description: result.description,
          category: result.category,
          dateAdded: Date.now(),
        };
        return [newFav, ...prev];
      }
    });
  };

  // Add Custom Shortcut
  const handleAddShortcut = (newShortcut: Omit<QuickShortcut, 'id'>) => {
    const id = `custom-${Date.now()}`;
    setShortcuts((prev) => [...prev, { ...newShortcut, id }]);
  };

  // Remove Shortcut
  const handleRemoveShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  };

  // Select shortcut trigger: Opens inside Cavot in-app browser directly
  const handleSelectShortcut = (shortcut: QuickShortcut) => {
    handleNavigateUrl(shortcut.url);
  };

  // Category switch on Results Page
  const handleSelectCategory = (cat: SearchCategory) => {
    setSearchCategory(cat);
    handleExecuteSearch(searchQuery, cat, true);
  };

  const recentQueryStrings = searchHistory.map((h) => h.query);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* 
        TOP CONTROL BAR:
        Left: Cavot C logo with snake detail, Cavot wordmark, Back (<), Forward (>), Refresh (⟳), Undo (↺), Redo (↻), In-App Address bar.
        Right: Theme Dual Pill (Moon/Sun), Settings ([gear] Settings), Profile circle avatar, More (···).
      */}
      <TopControlBar
        currentQuery={searchQuery}
        currentView={currentView}
        activeUrl={activeBrowserPage?.url}
        onNavigateHome={handleNavigateHome}
        onSearch={(q) => handleExecuteSearch(q, searchCategory)}
        onNavigateUrl={handleNavigateUrl}
        theme={settings.theme}
        onToggleTheme={() =>
          setSettings((prev) => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light',
          }))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenMore={() => setIsMoreOpen(true)}
        canGoBack={navIndex > 0}
        canGoForward={navIndex < navHistory.length - 1}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onRefresh={handleRefresh}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isRefreshing={isRefreshing}
      />

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' ? (
          /* HOMEPAGE VIEW - Modern, colorful, recognizable, professional search engine */
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16 relative">
            {/* Central Hero Brand Lockup */}
            <div className="flex flex-col items-center text-center mb-7 select-none z-10">
              {/* Cavot C Custom Lettermark Emblem */}
              <div className="mb-4">
                <CavotLogo size="hero" showWordmark={false} theme={settings.theme} />
              </div>

              {/* Cavot Brand Wordmark */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-1">
                <span className="text-blue-600 dark:text-blue-400">C</span>
                <span>avot</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1.5 font-normal">
                Search the world&apos;s verified web knowledge
              </p>
            </div>

            {/* Main Search Bar */}
            <MainSearchBar
              onSearch={(q) => handleExecuteSearch(q, 'web')}
              onOpenVoice={() => setIsVoiceModalOpen(true)}
              onOpenImage={() => setIsImageModalOpen(true)}
              recentSearches={recentQueryStrings}
              shortcuts={shortcuts}
              autoFocus
            />

            {/* Quick Action Category Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs z-10">
              {[
                { label: 'Weather in Pakistan', query: 'weather in Pakistan' },
                { label: 'Minecraft', query: 'Minecraft' },
                { label: 'YouTube', query: 'YouTube' },
                { label: 'GitHub Trends', query: 'GitHub open source trending' },
                { label: 'World News', query: 'latest world news' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleExecuteSearch(item.query, 'web')}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Quick Search Shortcuts Grid */}
            <QuickSearchSection
              shortcuts={shortcuts}
              onOpenAddModal={() => setIsAddShortcutOpen(true)}
              onRemoveShortcut={handleRemoveShortcut}
              onSelectShortcut={handleSelectShortcut}
            />
          </div>
        ) : currentView === 'results' ? (
          /* SEARCH RESULTS VIEW (Results stay inside Cavot) */
          <div className="flex-1 flex flex-col">
            {isLoadingSearch ? (
              <div className="w-full max-w-5xl mx-auto px-4 py-16 text-center">
                <div className="inline-block w-8 h-8 rounded-full border-2 border-black dark:border-white border-t-transparent animate-spin mb-4" />
                <div className="text-sm font-bold font-['Syne',sans-serif]">
                  Searching real web index for &ldquo;{searchQuery}&rdquo;...
                </div>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                  Fetching live pages, verified domains, and summaries
                </p>
              </div>
            ) : (
              <SearchResultsView
                query={searchQuery}
                category={searchCategory}
                onSelectCategory={handleSelectCategory}
                results={searchResults}
                quickAnswer={quickAnswer}
                overview={searchOverview}
                favorites={favoritesMap}
                onToggleFavorite={handleToggleFavorite}
                onSearch={(q) => handleExecuteSearch(q, searchCategory)}
                onOpenResult={handleOpenResult}
              />
            )}
          </div>
        ) : (
          /* IN-APP CAVOT BROWSER VIEW (Opens pages directly inside Cavot) */
          activeBrowserPage && (
            <InAppBrowserView
              url={activeBrowserPage.url}
              title={activeBrowserPage.title}
              domain={activeBrowserPage.domain}
              description={activeBrowserPage.description}
              snippet={activeBrowserPage.snippet}
              onBackToResults={() => setCurrentView('results')}
              onSearchAgain={(q) => handleExecuteSearch(q, searchCategory)}
              isFavorited={!!favoritesMap[activeBrowserPage.url]}
              onToggleFavorite={() =>
                handleToggleFavorite({
                  id: activeBrowserPage.url,
                  title: activeBrowserPage.title,
                  url: activeBrowserPage.url,
                  domain: activeBrowserPage.domain,
                  description: activeBrowserPage.description || '',
                  category: 'web',
                })
              }
            />
          )
        )}
      </main>

      {/* 
        SCREEN TIME WIDGET:
        Real functional active-usage tracking.
        Pauses when tab is hidden or window blurs. Resumes on focus.
        Persisted in localStorage. Positioned in bottom-left as in reference image.
      */}
      <ScreenTimeWidget />

      {/* MODALS & PANELS */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={(transcript) => handleExecuteSearch(transcript, searchCategory)}
      />

      <ImageSearchModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSearchWithImage={(q) => handleExecuteSearch(q, 'images')}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
        shortcuts={shortcuts}
        onRemoveShortcut={handleRemoveShortcut}
        onClearHistory={() => setSearchHistory([])}
        onResetScreenTime={() => {
          localStorage.removeItem('cavot_screen_time_v2');
          window.location.reload();
        }}
      />

      <AccountDrawer
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        favorites={favoritesList}
        onRemoveFavorite={(resultId) =>
          setFavoritesList((prev) => prev.filter((f) => f.resultId !== resultId))
        }
        searchHistory={searchHistory}
        onSelectHistory={(q) => handleExecuteSearch(q, 'web')}
        onClearHistory={() => setSearchHistory([])}
        savedSearches={savedSearches}
        onSelectSavedSearch={(q) => handleExecuteSearch(q, 'web')}
        onRemoveSavedSearch={(q) =>
          setSavedSearches((prev) => prev.filter((item) => item !== q))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ShortcutsModal
        isOpen={isAddShortcutOpen}
        onClose={() => setIsAddShortcutOpen(false)}
        onAddShortcut={handleAddShortcut}
      />

      <MoreMenuModal
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
      />
    </div>
  );
}
