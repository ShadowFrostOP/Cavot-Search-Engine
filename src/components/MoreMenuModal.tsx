import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Info,
  Shield,
  Command,
  MessageSquare,
  Check,
  Send,
} from 'lucide-react';
import { CavotLogo } from './CavotLogo';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'menu' | 'about' | 'shortcuts' | 'privacy' | 'feedback' | 'help'>('menu');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');

  if (!isOpen) return null;

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      setActiveSection('menu');
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-black dark:border-white/30 bg-white dark:bg-black text-black dark:text-white p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="More Options"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2">
            {activeSection !== 'menu' && (
              <button
                onClick={() => setActiveSection('menu')}
                className="text-xs text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white mr-1"
              >
                ← Back
              </button>
            )}
            <h3 className="text-sm font-bold font-['Syne',sans-serif]">
              {activeSection === 'menu' && 'Cavot System Menu'}
              {activeSection === 'about' && 'About Cavot'}
              {activeSection === 'shortcuts' && 'Keyboard Shortcuts'}
              {activeSection === 'privacy' && 'Privacy Philosophy'}
              {activeSection === 'feedback' && 'Send Feedback'}
              {activeSection === 'help' && 'Search Help & Syntax'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content based on sub-section */}
        {activeSection === 'menu' && (
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveSection('about')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4" />
                <span>About Cavot</span>
              </div>
              <span className="opacity-40">→</span>
            </button>

            <button
              onClick={() => setActiveSection('shortcuts')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Command className="w-4 h-4" />
                <span>Keyboard Shortcuts</span>
              </div>
              <span className="opacity-40">→</span>
            </button>

            <button
              onClick={() => setActiveSection('help')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>Help &amp; Search Syntax</span>
              </div>
              <span className="opacity-40">→</span>
            </button>

            <button
              onClick={() => setActiveSection('privacy')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4" />
                <span>Privacy &amp; Data Philosophy</span>
              </div>
              <span className="opacity-40">→</span>
            </button>

            <button
              onClick={() => setActiveSection('feedback')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Send Feedback</span>
              </div>
              <span className="opacity-40">→</span>
            </button>
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="text-center py-2">
              <CavotLogo size="lg" className="justify-center mb-2" />
              <p className="font-mono text-[11px] text-black/50 dark:text-white/50">
                Version 1.0.0 — Pure Monochrome Engine
              </p>
            </div>
            <p>
              Cavot was born out of a desire for extreme clarity in search. While the modern web grew crowded with noisy advertising, intrusive popups, and colorful distractions, Cavot strips away the clutter to restore search to its essential core: pure information, instant navigation, and active screen time awareness.
            </p>
            <p className="border-t border-black/10 dark:border-white/10 pt-3 text-[11px] text-black/60 dark:text-white/60">
              Strict dual-mode black &amp; white design. Real-time active focus tracking. Zero 3rd-party tracking cookies.
            </p>
          </div>
        )}

        {/* Shortcuts Section */}
        {activeSection === 'shortcuts' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-black/10 dark:border-white/10">
              <span>Focus search bar</span>
              <kbd className="px-2 py-0.5 rounded border border-black/20 dark:border-white/20 font-mono text-[11px]">
                /
              </kbd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-black/10 dark:border-white/10">
              <span>Dismiss suggestions / dialogs</span>
              <kbd className="px-2 py-0.5 rounded border border-black/20 dark:border-white/20 font-mono text-[11px]">
                Esc
              </kbd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-black/10 dark:border-white/10">
              <span>Navigate suggestions</span>
              <kbd className="px-2 py-0.5 rounded border border-black/20 dark:border-white/20 font-mono text-[11px]">
                ↑ / ↓
              </kbd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-black/10 dark:border-white/10">
              <span>Direct website shortcut search</span>
              <span className="font-mono text-[11px] opacity-70">
                yt &lt;query&gt;
              </span>
            </div>
          </div>
        )}

        {/* Help Section */}
        {activeSection === 'help' && (
          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <strong className="block font-semibold mb-1">Prefix Shortcuts:</strong>
              <p className="text-black/70 dark:text-white/70">
                Type a shortcut key followed by your query to search that platform directly. For example, <code className="font-mono font-bold">yt lo-fi beats</code> or <code className="font-mono font-bold">gh typescript</code>.
              </p>
            </div>
            <div>
              <strong className="block font-semibold mb-1">Screen Time Telemetry:</strong>
              <p className="text-black/70 dark:text-white/70">
                The timer on the bottom-left tracks genuine active usage. When you minimize the window or focus another program, the timer automatically pauses.
              </p>
            </div>
          </div>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <div className="space-y-3 text-xs leading-relaxed">
            <p>
              Cavot follows a zero-telemetry philosophy. All your favorites, search history, shortcuts, and screen time metrics reside solely within your device&apos;s local storage.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-black/70 dark:text-white/70">
              <li>No profiling or tracking pixels</li>
              <li>No third-party ad networks</li>
              <li>Full ability to clear local data at any time</li>
            </ul>
          </div>
        )}

        {/* Feedback Section */}
        {activeSection === 'feedback' && (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            {feedbackSent ? (
              <div className="py-6 text-center">
                <Check className="w-8 h-8 mx-auto mb-2 text-black dark:text-white" />
                <p className="text-xs font-semibold">Thank you for your feedback!</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-black/70 dark:text-white/70">
                  Share your impressions, report an issue, or suggest a new Cavot shortcut.
                </p>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="How can we make Cavot better?"
                  className="w-full p-2.5 text-xs rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:outline-none resize-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
