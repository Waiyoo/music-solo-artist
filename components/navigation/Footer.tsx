//components/navigation/Footer.tsx

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-artist-charcoal text-artist-warmCream pt-16 pb-12 border-t border-artist-earth/30">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4 md:col-span-2">
          <h2 className="font-serif text-3xl tracking-wide">ARTIST NAME</h2>
          <p className="text-artist-sand/70 text-sm max-w-md leading-relaxed">
            Merging contemporary African roots, coastal textures, and Nubian editorial soundscapes into a timeless sonic journey. Managed globally.
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-artist-mutedGold mb-4 font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-artist-sand/80">
            <li><Link href="/music" className="hover:text-artist-warmCream transition-colors">Discography</Link></li>
            <li><Link href="/events" className="hover:text-artist-warmCream transition-colors">Tour Dates</Link></li>
            <li><Link href="/gallery" className="hover:text-artist-warmCream transition-colors">Editorial Gallery</Link></li>
            <li><Link href="/book" className="hover:text-artist-warmCream transition-colors">Booking Inquiries</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-artist-mutedGold mb-4 font-semibold">Management & Booking</h3>
          <p className="text-sm text-artist-sand/80 mb-2">Direct representation & bookings:</p>
          <a href="mailto:management@artistdomain.com" className="text-sm text-artist-warmCream underline hover:text-artist-mutedGold">
            management@artistdomain.com
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-artist-earth/20 flex flex-col sm:flex-row items-center justify-between text-xs text-artist-sand/50">
        <p>&copy; {new Date().getFullYear()} Artist Name. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <Link href="/admin/login" className="hover:text-artist-warmCream transition-colors">Manager Portal</Link>
        </div>
      </div>
    </footer>
  );
}