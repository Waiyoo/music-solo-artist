import React from "react";

export function CoastalHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Subtle coastal wave / gradient mesh effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-artist-charcoal via-artist-richBrown/40 to-transparent opacity-90" />
      <svg className="absolute bottom-0 left-0 w-full h-32 opacity-10 text-artist-sand" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none">
        <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="currentColor" />
      </svg>
    </div>
  );
}