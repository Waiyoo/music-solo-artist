import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function AboutPage() {
  const artist = await db.artist.findFirst();

  const stageName = artist?.stageName || "ARTIST NAME";
  const biography = artist?.biography || "Biography is being updated by management.";
  const profileImage = artist?.profileImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80";
  const location = artist?.location || "Nairobi / Coast, Kenya";
  const genre = artist?.genre || "Afro-Fusion Editorial";

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[550px] rounded-lg overflow-hidden shadow-xl border border-artist-sand">
            <img src={profileImage} alt={stageName} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Artist Biography</span>
            <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">{stageName}</h1>
            <div className="flex gap-4 text-xs uppercase tracking-widest text-artist-earth border-y border-artist-sand py-3">
              <span>Genre: {genre}</span>
              <span>•</span>
              <span>Base: {location}</span>
            </div>
            <div className="prose text-artist-charcoal/90 leading-relaxed whitespace-pre-line text-base font-light">
              {biography}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}