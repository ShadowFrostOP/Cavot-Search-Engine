import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { QuickShortcut } from '../types';

interface QuickSearchSectionProps {
  shortcuts: QuickShortcut[];
  onOpenAddModal: () => void;
  onRemoveShortcut: (id: string) => void;
  onSelectShortcut: (shortcut: QuickShortcut) => void;
}

export const QuickSearchSection: React.FC<QuickSearchSectionProps> = ({
  shortcuts,
  onOpenAddModal,
  onRemoveShortcut,
  onSelectShortcut,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const renderCardIcon = (sc: QuickShortcut) => {
    const key = sc.shortcut.toLowerCase();
    switch (key) {
      case 'yt':
        return (
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        );
      case 'gh':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </div>
        );
      case 'wiki':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center font-serif font-bold text-lg shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            W
          </div>
        );
      case 'ig':
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </div>
        );
      case 'g':
        return (
          <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.35 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            {sc.shortcut.slice(0, 2)}
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-2">
      {/* Modern Chrome New-Tab Style Shortcut Grid */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {shortcuts.map((sc) => (
          <div
            key={sc.id}
            onMouseEnter={() => setHoveredId(sc.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative flex flex-col items-center cursor-pointer w-20"
          >
            <button
              onClick={() => onSelectShortcut(sc)}
              className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors w-full cursor-pointer"
              title={`Open ${sc.name}`}
            >
              {renderCardIcon(sc)}
              <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 truncate w-full text-center">
                {sc.name}
              </span>
            </button>

            {hoveredId === sc.id && sc.custom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveShortcut(sc.id);
                }}
                className="absolute -top-1 -right-1 p-1 bg-slate-200 dark:bg-zinc-700 hover:bg-red-500 hover:text-white rounded-full text-slate-600 dark:text-zinc-300 transition-colors shadow-xs"
                title="Remove shortcut"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {/* Add Shortcut Tile */}
        <div className="flex flex-col items-center w-20">
          <button
            onClick={onOpenAddModal}
            className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors w-full cursor-pointer group"
            title="Add shortcut"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border border-dashed border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 truncate w-full text-center group-hover:text-slate-700 dark:group-hover:text-zinc-200">
              Add shortcut
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
