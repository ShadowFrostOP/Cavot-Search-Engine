import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, Check, ArrowRight } from 'lucide-react';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchWithImage: (query: string, previewUrl?: string) => void;
}

const SAMPLE_IMAGES = [
  {
    title: 'Monochrome Architecture',
    query: 'monochrome architectural design',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%23111"/><polygon points="80,20 140,100 20,100" stroke="white" stroke-width="2" fill="none"/><line x1="80" y1="20" x2="80" y2="100" stroke="white" stroke-width="1"/></svg>',
  },
  {
    title: 'Precision Espresso',
    query: 'specialty coffee brewing gear',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%23fafafa"/><circle cx="80" cy="60" r="35" stroke="%23111" stroke-width="2" fill="none"/><circle cx="80" cy="60" r="20" stroke="%23666" stroke-width="1" fill="none"/></svg>',
  },
  {
    title: 'Quantum Hardware',
    query: 'quantum computing hardware',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%23050505"/><rect x="40" y="30" width="80" height="60" stroke="white" stroke-width="2" fill="none"/><circle cx="80" cy="60" r="15" stroke="white" stroke-width="1.5"/></svg>',
  },
];

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchWithImage,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [inferredQuery, setInferredQuery] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        // Infer clean title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
        setInferredQuery(cleanName || 'visual image match');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
        setInferredQuery(cleanName || 'visual image match');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const finalQuery = inferredQuery || 'visual search match';
    onSearchWithImage(finalQuery, selectedFile || undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-black dark:border-white/30 bg-white dark:bg-black text-black dark:text-white p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search by Image"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-black dark:text-white" />
            <h3 className="text-base font-bold font-['Syne',sans-serif]">
              Search with an Image
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Zone */}
        {!selectedFile ? (
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-black/25 dark:border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:border-black dark:hover:border-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-all"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-black/40 dark:text-white/40" />
              <p className="text-sm font-semibold mb-1">
                Drag and drop an image here, or browse
              </p>
              <p className="text-xs text-black/50 dark:text-white/50">
                Supports PNG, JPG, WebP, SVG
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* URL input alternative */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste an image URL..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (imageUrlInput.trim()) {
                    setSelectedFile(imageUrlInput.trim());
                    setInferredQuery('reverse visual lookup');
                  }
                }}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Load
              </button>
            </div>

            {/* Sample Images */}
            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 mb-2">
                Or test with sample images:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_IMAGES.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedFile(sample.url);
                      setInferredQuery(sample.query);
                    }}
                    className="p-1.5 rounded-xl border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white text-left cursor-pointer transition-all"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 mb-1.5 flex items-center justify-center">
                      <img src={sample.url} alt={sample.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-medium block truncate text-black dark:text-white">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Preview Loaded Image */
          <div className="text-center">
            <div className="relative aspect-[4/3] max-h-56 rounded-xl border border-black/20 dark:border-white/20 overflow-hidden mx-auto mb-4 bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <img
                src={selectedFile}
                alt="Upload preview"
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md cursor-pointer hover:scale-110 transition-transform"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-left mb-5">
              <label className="text-xs font-semibold text-black/60 dark:text-white/60 mb-1 block">
                Detected Subject / Query:
              </label>
              <input
                type="text"
                value={inferredQuery}
                onChange={(e) => setInferredQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white cursor-pointer"
              >
                Change Image
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 cursor-pointer"
              >
                <span>Search with Cavot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
