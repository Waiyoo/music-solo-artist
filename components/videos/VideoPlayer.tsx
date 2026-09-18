"use client";

import React from "react";

interface VideoPlayerProps {
  title: string;
  externalUrl?: string | null;
  directUrl?: string | null;
  thumbnail?: string | null;
}

export default function VideoPlayer({ title, externalUrl, directUrl, thumbnail }: VideoPlayerProps) {
  // Helper to convert YouTube watch/short URLs to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const embedUrl = externalUrl ? getEmbedUrl(externalUrl) : "";

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-artist-charcoal border border-artist-earth/30 shadow-lg">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : directUrl ? (
        <video src={directUrl} controls poster={thumbnail || undefined} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-artist-sand p-6 text-center">
          {thumbnail && <img src={thumbnail} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-40" />}
          <div className="relative z-10">
            <span className="font-serif text-xl block mb-2">{title}</span>
            <span className="text-xs uppercase tracking-widest text-artist-mutedGold">Stream Unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}