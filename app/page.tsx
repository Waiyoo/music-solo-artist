import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import MusicPlayer from "@/components/music/MusicPlayer";
import VideoPlayer from "@/components/videos/VideoPlayer";
import { NubianMotif, CoastalSeparator } from "@/components/ui/NubianMotif";
import { CoastalHeroOverlay } from "@/components/ui/CoastalHeroOverlay";
import { db } from "@/lib/db";
import Link from "next/link";

export const revalidate = 0;

export default async function HomePage() {
  const artist = await db.artist.findFirst();
  const socials = await db.socialLink.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" } });
  const featuredSongs = await db.music.findMany({ where: { published: true }, take: 2, orderBy: { createdAt: "desc" } });
  const featuredVideo = await db.video.findFirst({ where: { published: true, featured: true } }) || await db.video.findFirst({ where: { published: true } });
  const upcomingEvents = await db.event.findMany({ where: { published: true, eventDate: { gte: new Date() } }, take: 3, orderBy: { eventDate: "asc" } });
  const latestNews = await db.newsArticle.findMany({ where: { published: true }, take: 2, orderBy: { createdAt: "desc" } });

  const stageName = artist?.stageName || "ARTIST NAME";
  const shortBio = artist?.shortBio || "Contemporary African × Coastal × Nubian soundscape architect.";
  const heroImage = artist?.heroImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1800&q=80";

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={stageName} className="w-full h-full object-cover filter brightness-[0.45]" />
          <CoastalHeroOverlay />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-artist-warmCream">
          <NubianMotif className="w-16 h-6 text-artist-mutedGold mx-auto" />
          <span className="text-xs uppercase tracking-[0.3em] text-artist-mutedGold font-semibold">
            {artist?.genre || "Afro-Fusion Editorial"}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-wide">
            {stageName}
          </h1>
          <p className="text-artist-sand text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {shortBio}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/music"
              className="px-8 py-3.5 bg-artist-deepRed text-artist-warmCream text-xs uppercase tracking-widest rounded font-semibold transition-all hover:bg-artist-richBrown"
            >
              Explore Music
            </Link>
            <Link
              href="/book"
              className="px-8 py-3.5 bg-transparent border border-artist-warmCream text-artist-warmCream text-xs uppercase tracking-widest rounded font-semibold transition-all hover:bg-artist-warmCream hover:text-artist-charcoal"
            >
              Booking Inquiries
            </Link>
          </div>
        </div>
      </section>

      {/* Social / Streaming Bar */}
      <section className="bg-artist-charcoal py-6 border-t border-artist-earth/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
          {socials.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-widest text-artist-sand/80 hover:text-artist-warmCream transition-colors"
            >
              {link.label}
            </a>
          ))}
          {socials.length === 0 && (
            <span className="text-xs uppercase tracking-widest text-artist-sand/50">Official Streaming Platforms Coming Soon</span>
          )}
        </div>
      </section>

      <CoastalSeparator />

      {/* Featured Music Section */}
      {featuredSongs.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 w-full space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-artist-sand">
            <div>
              <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Catalogue</span>
              <h2 className="font-serif text-3xl md:text-4xl text-artist-richBrown mt-1">Featured Releases</h2>
            </div>
            <Link href="/music" className="text-xs uppercase tracking-widest text-artist-deepRed hover:underline font-semibold">
              View All Music &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredSongs.map((song) => (
              <MusicPlayer key={song.id} title={song.title} audioUrl={song.audioUrl} coverArt={song.coverArt} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Video Section */}
      {featuredVideo && (
        <section className="bg-artist-charcoal text-artist-warmCream py-20 my-10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 space-y-8 relative z-10">
            <div className="text-center space-y-2">
              <NubianMotif className="w-12 h-5 text-artist-mutedGold mx-auto" />
              <span className="text-xs uppercase tracking-widest text-artist-mutedGold font-semibold">Visual Artistry</span>
              <h2 className="font-serif text-3xl md:text-4xl">Featured Performance</h2>
            </div>
            <VideoPlayer
              title={featuredVideo.title}
              externalUrl={featuredVideo.externalVideoUrl}
              directUrl={featuredVideo.directVideoUrl}
              thumbnail={featuredVideo.thumbnail}
            />
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 w-full space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-artist-sand">
            <div>
              <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Live Performances</span>
              <h2 className="font-serif text-3xl md:text-4xl text-artist-richBrown mt-1">Upcoming Tour Dates</h2>
            </div>
            <Link href="/events" className="text-xs uppercase tracking-widest text-artist-deepRed hover:underline font-semibold">
              All Tour Dates &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-lg border border-artist-sand shadow-sm">
                <div className="space-y-1 mb-4 md:mb-0">
                  <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">
                    {new Date(ev.eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <h3 className="font-serif text-xl text-artist-richBrown font-bold">{ev.title}</h3>
                  <p className="text-artist-earth text-sm">{ev.venue} — {ev.location}</p>
                </div>
                {ev.ticketUrl && (
                  <a
                    href={ev.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-artist-deepRed text-artist-warmCream text-xs uppercase tracking-widest rounded font-semibold hover:bg-artist-richBrown transition-colors"
                  >
                    Tickets / Info
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <CoastalSeparator />

      {/* Latest News Section */}
      {latestNews.length > 0 && (
        <section className="bg-artist-sand/30 py-20 border-y border-artist-sand">
          <div className="max-w-6xl mx-auto px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-artist-sand">
              <div>
                <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Editorial</span>
                <h2 className="font-serif text-3xl md:text-4xl text-artist-richBrown mt-1">News & Press</h2>
              </div>
              <Link href="/news" className="text-xs uppercase tracking-widest text-artist-deepRed hover:underline font-semibold">
                All Articles &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestNews.map((art) => (
                <Link key={art.id} href={`/news/${art.slug}`} className="group bg-white p-8 rounded-lg border border-artist-sand shadow-sm space-y-4 transition-all hover:border-artist-deepRed">
                  <span className="text-xs uppercase tracking-widest text-artist-earth">
                    {new Date(art.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="font-serif text-2xl text-artist-richBrown group-hover:text-artist-deepRed transition-colors">
                    {art.title}
                  </h3>
                  {art.excerpt && <p className="text-artist-earth text-sm leading-relaxed">{art.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center space-y-6">
        <NubianMotif className="w-16 h-6 text-artist-deepRed mx-auto" />
        <span className="text-xs uppercase tracking-[0.3em] text-artist-deepRed font-semibold">Direct Representation</span>
        <h2 className="font-serif text-4xl md:text-5xl text-artist-richBrown">Book {stageName} For Your Event</h2>
        <p className="text-artist-earth max-w-xl mx-auto text-sm leading-relaxed">
          Inquiries for festival appearances, cultural residencies, and private showcases are managed directly through our secure booking protocol.
        </p>
        <div className="pt-4">
          <Link
            href="/book"
            className="px-8 py-4 bg-artist-deepRed text-artist-warmCream text-xs uppercase tracking-widest rounded font-semibold transition-all hover:bg-artist-richBrown inline-block"
          >
            Submit Booking Request
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}