import React, { useState } from 'react';
import {
  X,
  User,
  Heart,
  Bookmark,
  History,
  Sliders,
  LogOut,
  ExternalLink,
  Trash2,
  Search,
} from 'lucide-react';
import { FavoriteItem, SearchHistoryItem } from '../types';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onRemoveFavorite: (resultId: string) => void;
  searchHistory: SearchHistoryItem[];
  onSelectHistory: (query: string) => void;
  onClearHistory: () => void;
  savedSearches: string[];
  onSelectSavedSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
  onOpenSettings: () => void;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  searchHistory,
  onSelectHistory,
  onClearHistory,
  savedSearches,
  onSelectSavedSearch,
  onRemoveSavedSearch,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'saved' | 'history' | 'profile'>('favorites');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-black text-black dark:text-white border-l border-black/15 dark:border-white/20 p-6 flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cavot Account & Profile"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-black dark:border-white flex items-center justify-center font-bold text-sm font-['Syne',sans-serif]">
              C
            </div>
            <div>
              <h3 className="text-sm font-bold font-['Syne',sans-serif]">Cavot Account</h3>
              <p className="text-xs text-black/50 dark:text-white/50">makhdooma.ali83@gmail.com</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-black/10 dark:border-white/10 py-3 mb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedSearches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'favorites' && (
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-3">
                Saved Favorites
              </div>

              {favorites.length === 0 ? (
                <div className="py-12 text-center text-black/50 dark:text-white/50 text-xs">
                  <Heart className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p>No favorited results yet.</p>
                  <p className="mt-1 opacity-70">
                    Click the &hearts; icon on any search result to save it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="p-3 rounded-xl border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-black/50 dark:text-white/50 mb-1">
                        <span className="font-mono">{fav.domain}</span>
                        <button
                          onClick={() => onRemoveFavorite(fav.resultId)}
                          className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white p-0.5"
                          title="Remove favorite"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold hover:underline line-clamp-1 block text-black dark:text-white"
                      >
                        {fav.title}
                      </a>

                      <p className="text-[11px] text-black/60 dark:text-white/60 mt-1 line-clamp-2">
                        {fav.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-3">
                Pinned Searches
              </div>

              {savedSearches.length === 0 ? (
                <div className="py-12 text-center text-black/50 dark:text-white/50 text-xs">
                  <Bookmark className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p>No saved searches.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedSearches.map((sq, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors"
                    >
                      <button
                        onClick={() => {
                          onSelectSavedSearch(sq);
                          onClose();
                        }}
                        className="flex items-center gap-2 text-xs font-medium text-left truncate flex-1"
                      >
                        <Search className="w-3.5 h-3.5 opacity-40 shrink-0" />
                        <span className="truncate">&ldquo;{sq}&rdquo;</span>
                      </button>

                      <button
                        onClick={() => onRemoveSavedSearch(sq)}
                        className="p-1 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50">
                  Search History ({searchHistory.length})
                </span>
                {searchHistory.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-[11px] text-black/60 dark:text-white/60 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {searchHistory.length === 0 ? (
                <div className="py-12 text-center text-black/50 dark:text-white/50 text-xs">
                  <History className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p>Your search history is clean.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {searchHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectHistory(item.query);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-black/15 dark:hover:border-white/15 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] text-left text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Search className="w-3.5 h-3.5 opacity-40 shrink-0" />
                        <span className="truncate">{item.query}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-40 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                <div className="text-xs text-black/50 dark:text-white/50">Connected Profile</div>
                <div className="text-sm font-bold mt-1">Makhdooma Ali</div>
                <div className="text-xs font-mono opacity-70">makhdooma.ali83@gmail.com</div>
                <div className="mt-3 text-[11px] px-2 py-1 rounded border border-black/10 dark:border-white/15 inline-block font-mono">
                  Cavot Pro Member · Monochromatic Sync Active
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors cursor-pointer text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>Configure Preferences</span>
                </div>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              alert('Signed out of Cavot account.');
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
