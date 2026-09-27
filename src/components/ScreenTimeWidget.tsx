import React, { useState, useEffect, useRef } from 'react';
import { Clock, Pause, Play, RotateCcw, X, ShieldCheck, Flame } from 'lucide-react';
import { ScreenTimeState } from '../types';

const STORAGE_KEY = 'cavot_screen_time_v2';

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const ScreenTimeWidget: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dailyGoalMin, setDailyGoalMin] = useState<number>(60);
  const sessionSecondsRef = useRef<number>(0);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from storage or reset if date changed
  useEffect(() => {
    try {
      const today = getTodayKey();
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ScreenTimeState = JSON.parse(raw);
        if (parsed.dateString === today && typeof parsed.totalActiveSecondsToday === 'number') {
          setTotalSeconds(parsed.totalActiveSecondsToday);
        } else {
          // New day, reset
          const freshState: ScreenTimeState = {
            totalActiveSecondsToday: 0,
            dateString: today,
            sessionsToday: 1,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
          setTotalSeconds(0);
        }
      } else {
        const freshState: ScreenTimeState = {
          totalActiveSecondsToday: 0,
          dateString: today,
          sessionsToday: 1,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
        setTotalSeconds(0);
      }
    } catch {
      setTotalSeconds(0);
    }
  }, []);

  // Save to localStorage periodically or on change
  useEffect(() => {
    const today = getTodayKey();
    const state: ScreenTimeState = {
      totalActiveSecondsToday: totalSeconds,
      dateString: today,
      sessionsToday: 1,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable
    }
  }, [totalSeconds]);

  // Active time tracking with visibility and focus detection
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (interval) return;
      lastActiveTimestampRef.current = Date.now();
      interval = setInterval(() => {
        const now = Date.now();
        const deltaSec = Math.floor((now - lastActiveTimestampRef.current) / 1000);
        if (deltaSec >= 1) {
          lastActiveTimestampRef.current = now;
          setTotalSeconds((prev) => prev + deltaSec);
          sessionSecondsRef.current += deltaSec;
        }
      }, 1000);
    };

    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
        stopTimer();
      } else {
        setIsActive(true);
        startTimer();
      }
    };

    const handleWindowBlur = () => {
      setIsActive(false);
      stopTimer();
    };

    const handleWindowFocus = () => {
      if (!document.hidden) {
        setIsActive(true);
        startTimer();
      }
    };

    // User activity handler to detect idle after 2 minutes of zero interaction
    const handleUserInteraction = () => {
      if (!document.hidden && document.hasFocus()) {
        if (!isActive) {
          setIsActive(true);
          startTimer();
        }
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        // Pause if idle for 120 seconds
        idleTimeoutRef.current = setTimeout(() => {
          setIsActive(false);
          stopTimer();
        }, 120000);
      }
    };

    // Initial check
    if (!document.hidden && document.hasFocus()) {
      setIsActive(true);
      startTimer();
    } else {
      setIsActive(false);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('mousemove', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      stopTimer();
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isActive]);

  const wholeMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const sessionMin = Math.floor(sessionSecondsRef.current / 60);
  const sessionSec = sessionSecondsRef.current % 60;

  const resetTodayTime = () => {
    setTotalSeconds(0);
    sessionSecondsRef.current = 0;
    try {
      const today = getTodayKey();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          totalActiveSecondsToday: 0,
          dateString: today,
          sessionsToday: 1,
        })
      );
    } catch {}
  };

  return (
    <>
      {/* 
        Bottom-Left Floating Badge:
        Modern Chrome / Google style subtle activity pill
      */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setShowModal(true)}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-slate-700 dark:text-zinc-300 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer"
          title="Click to view detailed Screen Time statistics"
          aria-label={`Screen Time: ${wholeMinutes} minutes. Status: ${isActive ? 'Active' : 'Paused'}`}
        >
          {/* Subtle pulsating status dot */}
          <span className="relative flex h-2 w-2">
            {isActive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300 dark:bg-zinc-600" />
            )}
          </span>

          <span className="text-xs font-medium tracking-tight whitespace-nowrap">
            Screen Time:{' '}
            <strong className="font-semibold text-slate-900 dark:text-zinc-100 tabular-nums">
              {wholeMinutes} min
            </strong>
          </span>

          <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors" />
        </button>
      </div>

      {/* Screen Time Breakdown Dialog */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-black dark:border-white/30 bg-white dark:bg-black text-black dark:text-white p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="screen-time-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg border border-black dark:border-white">
                  <Clock className="w-4 h-4 text-black dark:text-white" />
                </div>
                <h3 id="screen-time-title" className="text-base font-bold font-['Syne',sans-serif]">
                  Screen Time Insights
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main counter */}
            <div className="py-6 text-center">
              <div className="text-5xl font-extrabold font-['Syne',sans-serif] tabular-nums tracking-tight">
                {wholeMinutes}
                <span className="text-2xl font-medium text-black/60 dark:text-white/60 ml-1.5">
                  min
                </span>
              </div>
              <p className="text-xs text-black/50 dark:text-white/50 mt-1 tabular-nums">
                ({wholeMinutes}m {remainingSeconds}s total active today)
              </p>

              {/* Status pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-4 rounded-full border border-black/10 dark:border-white/15 text-xs font-medium">
                {isActive ? (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Tracking Active Usage</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Paused (Window Inactive)</span>
                  </>
                )}
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04]">
                <div className="text-[11px] uppercase tracking-wider text-black/50 dark:text-white/50 font-medium">
                  Current Session
                </div>
                <div className="text-base font-bold tabular-nums mt-0.5">
                  {sessionMin}m {sessionSec}s
                </div>
              </div>
              <div className="p-3 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04]">
                <div className="text-[11px] uppercase tracking-wider text-black/50 dark:text-white/50 font-medium">
                  Daily Goal
                </div>
                <div className="text-base font-bold tabular-nums mt-0.5">
                  {dailyGoalMin} min
                </div>
              </div>
            </div>

            {/* Goal progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-black/60 dark:text-white/60">Today's Usage Goal</span>
                <span className="tabular-nums font-bold">
                  {Math.min(100, Math.round((wholeMinutes / dailyGoalMin) * 100))}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-black dark:bg-white transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, (wholeMinutes / dailyGoalMin) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 text-[12px] text-black/60 dark:text-white/60 mb-6 leading-relaxed">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Cavot only tracks active foreground interaction. Time pauses automatically when switching tabs or walking away.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetTodayTime}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Today
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
