"use client";

import React, { useEffect } from "react";

interface LightboxProps {
  image: { imageUrl: string; caption?: string | null };
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function Lightbox({ image, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-artist-warmCream text-xl uppercase tracking-widest hover:text-artist-deepRed transition-colors"
      >
        Close [Esc]
      </button>

      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-6 text-artist-warmCream text-2xl px-4 py-2 hover:text-artist-deepRed transition-colors"
        >
          &larr;
        </button>
      )}

      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
        <img
          src={image.imageUrl}
          alt={image.caption || "Editorial Gallery Image"}
          className="max-h-[75vh] max-w-full object-contain rounded border border-artist-earth/30"
        />
        {image.caption && (
          <p className="text-artist-sand text-sm mt-4 font-serif italic text-center max-w-xl">
            {image.caption}
          </p>
        )}
      </div>

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-6 text-artist-warmCream text-2xl px-4 py-2 hover:text-artist-deepRed transition-colors"
        >
          &rarr;
        </button>
      )}
    </div>
  );
}