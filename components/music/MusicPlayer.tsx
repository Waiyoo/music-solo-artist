"use client";

import React, { useState, useRef } from "react";

interface MusicPlayerProps {
  title: string;
  audioUrl?: string | null;
  coverArt?: string | null;
}

export default function MusicPlayer({ title, audioUrl, coverArt }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-artist-charcoal text-artist-warmCream rounded-lg border border-artist-earth/30">
      <div className="flex items-center space-x-4">
        {coverArt ? (
          <img src={coverArt} alt={title} className="w-12 h-12 rounded object-cover" />
        ) : (
          <div className="w-12 h-12 rounded bg-artist-earth flex items-center justify-center font-serif text-lg">♫</div>
        )}
        <div>
          <h4 className="font-serif text-sm font-bold tracking-wide">{title}</h4>
          <span className="text-xs text-artist-sand/60">Official Audio</span>
        </div>
      </div>

      {audioUrl ? (
        <>
          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
          <button
            onClick={togglePlay}
            className="px-5 py-2 bg-artist-deepRed text-artist-warmCream text-xs uppercase tracking-widest rounded font-semibold hover:bg-artist-richBrown transition-colors"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </>
      ) : (
        <span className="text-xs text-artist-sand/50 uppercase tracking-widest">Streaming Only</span>
      )}
    </div>
  );
}