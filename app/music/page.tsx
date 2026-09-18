import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import EmptyState from "@/components/ui/EmptyState";
import MusicPlayer from "@/components/music/MusicPlayer";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function PublicMusicPage() {
  const songs = await db.music.findMany({
    where: { published: true },
    include: { externalLinks: true },
    orderBy: { createdAt: "desc" },
  });

  const albums = await db.album.findMany({
    where: { published: true },
    include: { songs: { include: { music: true } } },
    orderBy: { releaseDate: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full space-y-16">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Discography</span>
          <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">Music & Albums</h1>
          <p className="text-artist-earth max-w-xl text-sm">
            Immerse in official singles, albums, and streaming releases crafted with coastal and Nubian resonance.
          </p>
        </div>

        {songs.length > 0 ? (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-artist-richBrown border-b pb-2">Singles & Tracks</h2>
            <div className="grid grid-cols-1 gap-4">
              {songs.map((song) => (
                <div key={song.id} className="space-y-4">
                  <MusicPlayer title={song.title} audioUrl={song.audioUrl} coverArt={song.coverArt} />
                  {song.externalLinks.length > 0 && (
                    <div className="flex flex-wrap gap-3 px-2">
                      {song.externalLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs uppercase tracking-wider bg-artist-sand px-3 py-1.5 rounded text-artist-richBrown hover:bg-artist-earth hover:text-white transition-colors"
                        >
                          Listen on {link.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Catalogue Coming Soon"
            description="The artist's manager is preparing official audio releases for publication."
          />
        )}
      </main>
      <Footer />
    </div>
  );
}