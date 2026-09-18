import React from "react";

export function NubianMotif({ className = "w-12 h-4 text-artist-mutedGold" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12L25 2L50 12L75 2L100 12L75 22L50 12L25 22L0 12Z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="50" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export function CoastalSeparator() {
  return (
    <div className="flex items-center justify-center space-x-4 my-8 text-artist-earth/40">
      <div className="h-[1px] w-24 bg-artist-earth/30" />
      <NubianMotif className="w-16 h-5 text-artist-deepRed" />
      <div className="h-[1px] w-24 bg-artist-earth/30" />
    </div>
  );
}