import React, { useState } from 'react';
import { X, Plus, Globe } from 'lucide-react';
import { QuickShortcut } from '../types';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShortcut: (shortcut: Omit<QuickShortcut, 'id'>) => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  onAddShortcut,
}) => {
  const [name, setName] = useState<string>('');
  const [shortcut, setShortcut] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a website name.');
      return;
    }
    if (!shortcut.trim()) {
      setError('Please provide a short trigger key (e.g. "x", "rd", "med").');
      return;
    }
    if (!url.trim()) {
      setError('Please provide a valid website URL.');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    onAddShortcut({
      name: name.trim(),
      shortcut: shortcut.trim().toLowerCase(),
      url: finalUrl,
      custom: true,
    });

    setName('');
    setShortcut('');
    setUrl('');
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-black dark:border-white/30 bg-white dark:bg-black text-black dark:text-white p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add Quick Search Shortcut"
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-black dark:text-white" />
            <h3 className="text-sm font-bold font-['Syne',sans-serif]">
              Add Quick Shortcut
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg border border-black/20 dark:border-white/20 text-xs bg-black/5 dark:bg-white/5">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1">
              Website Name
            </label>
            <input
              type="text"
              placeholder="e.g. Dribbble"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1">
              Shortcut Key (Trigger)
            </label>
            <input
              type="text"
              placeholder="e.g. dr"
              maxLength={6}
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:outline-none"
            />
            <p className="text-[10px] text-black/50 dark:text-white/50 mt-1">
              Type &ldquo;{shortcut || 'key'} &lt;query&gt;&rdquo; in the search bar to jump.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1">
              Website URL
            </label>
            <input
              type="text"
              placeholder="e.g. dribbble.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Save Shortcut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
