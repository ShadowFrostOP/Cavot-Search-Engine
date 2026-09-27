import React from 'react';
import {
  X,
  Sliders,
  Moon,
  Sun,
  Shield,
  Clock,
  Trash2,
  Globe,
  Compass,
  Check,
  RotateCcw,
} from 'lucide-react';
import { AppSettings, QuickShortcut } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  shortcuts: QuickShortcut[];
  onRemoveShortcut: (id: string) => void;
  onClearHistory: () => void;
  onResetScreenTime: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  shortcuts,
  onRemoveShortcut,
  onClearHistory,
  onResetScreenTime,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-black dark:border-white/30 bg-white dark:bg-black text-black dark:text-white p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cavot Settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-black dark:text-white" />
            <h3 className="text-lg font-bold font-['Syne',sans-serif]">Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section: Appearance / Theme */}
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-3">
              Appearance
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'border-black bg-black/5 text-black font-bold ring-1 ring-black'
                    : 'border-black/20 text-black/70 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <span>Pure White (Light)</span>
                </div>
                {settings.theme === 'light' && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'border-white bg-white/10 text-white font-bold ring-1 ring-white'
                    : 'border-white/20 text-white/70 hover:border-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  <span>Pure Black (Dark)</span>
                </div>
                {settings.theme === 'dark' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Section: Search Experience */}
          <div className="border-t border-black/10 dark:border-white/10 pt-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-3">
              Search Preferences
            </div>

            <div className="space-y-3.5">
              {/* SafeSearch */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">SafeSearch Filtering</div>
                  <div className="text-xs text-black/50 dark:text-white/50">
                    Filter explicit or sensitive material
                  </div>
                </div>
                <select
                  value={settings.safeSearch}
                  onChange={(e) => onUpdateSettings({ safeSearch: e.target.value as any })}
                  className="px-3 py-1.5 rounded-lg border border-black/20 dark:border-white/20 bg-transparent text-xs font-medium focus:outline-none"
                >
                  <option value="strict" className="text-black bg-white">Strict</option>
                  <option value="moderate" className="text-black bg-white">Moderate</option>
                  <option value="off" className="text-black bg-white">Off</option>
                </select>
              </div>

              {/* Open Links in New Tab */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">Open in New Tab</div>
                  <div className="text-xs text-black/50 dark:text-white/50">
                    External search links open in a background tab
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.openInNewTab}
                  onChange={(e) => onUpdateSettings({ openInNewTab: e.target.checked })}
                  className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                />
              </div>

              {/* Auto Suggestions */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">Query Autocomplete</div>
                  <div className="text-xs text-black/50 dark:text-white/50">
                    Display smart search suggestions as you type
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSuggest}
                  onChange={(e) => onUpdateSettings({ autoSuggest: e.target.checked })}
                  className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Language & Region */}
          <div className="border-t border-black/10 dark:border-white/10 pt-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-3">
              Region & Language
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-black/60 dark:text-white/60 mb-1 block">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => onUpdateSettings({ language: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-xs font-medium focus:outline-none"
                >
                  <option value="English" className="text-black bg-white">English (US)</option>
                  <option value="Spanish" className="text-black bg-white">Español</option>
                  <option value="French" className="text-black bg-white">Français</option>
                  <option value="German" className="text-black bg-white">Deutsch</option>
                  <option value="Japanese" className="text-black bg-white">日本語</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-black/60 dark:text-white/60 mb-1 block">Region</label>
                <select
                  value={settings.region}
                  onChange={(e) => onUpdateSettings({ region: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-xs font-medium focus:outline-none"
                >
                  <option value="Global" className="text-black bg-white">Global (All Regions)</option>
                  <option value="North America" className="text-black bg-white">North America</option>
                  <option value="Europe" className="text-black bg-white">Europe</option>
                  <option value="Asia Pacific" className="text-black bg-white">Asia Pacific</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Screen Time Settings */}
          <div className="border-t border-black/10 dark:border-white/10 pt-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-3">
              Screen Time Controls
            </div>

            <div className="flex items-center justify-between text-sm mb-3">
              <div>
                <div className="font-semibold">Daily Usage Focus Goal</div>
                <div className="text-xs text-black/50 dark:text-white/50">
                  Target threshold for daily search research
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="360"
                  step="5"
                  value={settings.screenTimeGoalMin}
                  onChange={(e) => onUpdateSettings({ screenTimeGoalMin: Number(e.target.value) || 60 })}
                  className="w-20 px-2.5 py-1 text-xs font-mono text-center rounded-lg border border-black/20 dark:border-white/20 bg-transparent"
                />
                <span className="text-xs text-black/50 dark:text-white/50">min</span>
              </div>
            </div>

            <button
              onClick={onResetScreenTime}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Today's Screen Time
            </button>
          </div>

          {/* Section: Quick Search Management */}
          <div className="border-t border-black/10 dark:border-white/10 pt-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-2">
              Quick Search Shortcuts ({shortcuts.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {shortcuts.map((sc) => (
                <div
                  key={sc.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{sc.shortcut}</span>
                    <span className="opacity-50">·</span>
                    <span>{sc.name}</span>
                  </div>
                  {sc.custom && (
                    <button
                      onClick={() => onRemoveShortcut(sc.id)}
                      className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                      title="Delete shortcut"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: History & Data Privacy */}
          <div className="border-t border-black/10 dark:border-white/10 pt-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-3">
              Data &amp; Privacy
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium">Search History</div>
                <div className="text-[11px] text-black/50 dark:text-white/50">
                  Stored 100% locally in your browser.
                </div>
              </div>
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear History
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-black/10 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
