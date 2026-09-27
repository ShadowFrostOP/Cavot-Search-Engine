import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, AlertCircle, RefreshCw, Check } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete,
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      setTranscript('');
      setError(null);
      return;
    }

    // Check browser support for SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice search is not supported in this browser. You can type your query directly.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);

        // If finalized
        if (event.results[0].isFinal) {
          setTimeout(() => {
            if (currentText.trim()) {
              onTranscriptComplete(currentText.trim());
              onClose();
            }
          }, 600);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setError('Microphone permission was denied. Please allow microphone access to search by voice.');
        } else if (event.error === 'no-speech') {
          setError('No speech was detected. Please try again.');
        } else {
          setError(`Speech recognition encountered an issue (${event.error}).`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setError('Unable to initialize voice search. Please try again.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [isOpen]);

  const handleRetry = () => {
    setError(null);
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  const handleManualConfirm = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-black dark:border-white/30 bg-white dark:bg-black text-black dark:text-white p-6 shadow-2xl relative text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Voice Search"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <h3 className="text-lg font-bold font-['Syne',sans-serif] mb-6">
          Voice Search
        </h3>

        {/* Animated Listening Radar (Pure Black & White) */}
        <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-6">
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full border border-black dark:border-white animate-ping opacity-25" />
              <div className="absolute inset-2 rounded-full border border-black dark:border-white animate-pulse opacity-40" />
            </>
          )}

          <div
            className={`w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center transition-all ${
              isListening
                ? 'bg-black text-white dark:bg-white dark:text-black scale-105'
                : 'bg-transparent text-black dark:text-white'
            }`}
          >
            <Mic className="w-7 h-7" />
          </div>
        </div>

        {/* Live Status / Prompt */}
        <div className="min-h-[50px] flex flex-col items-center justify-center mb-6">
          {error ? (
            <div className="flex items-center gap-2 text-xs text-black/80 dark:text-white/80 max-w-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : isListening ? (
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-1">
                Listening... Speak now
              </p>
              <p className="text-base font-medium min-h-[28px] max-w-xs mx-auto italic">
                {transcript ? `"${transcript}"` : 'Say a topic, website, or question...'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-black/60 dark:text-white/60">
              Microphone idle.
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {error ? (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          ) : transcript ? (
            <button
              onClick={handleManualConfirm}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Search &ldquo;{transcript}&rdquo;
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
