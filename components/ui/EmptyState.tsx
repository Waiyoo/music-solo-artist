//components/ui/EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-artist-sand bg-artist-warmCream/50 rounded-lg">
      <div className="w-12 h-12 mb-4 rounded-full bg-artist-sand/50 flex items-center justify-center text-artist-earth">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-xl font-serif text-artist-richBrown mb-2">{title}</h3>
      <p className="text-artist-earth max-w-md mb-6 text-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-artist-deepRed text-artist-warmCream text-sm uppercase tracking-widest rounded transition-all hover:bg-artist-richBrown"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}