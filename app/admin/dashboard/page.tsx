import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch real database counts and status
  const [
    songsCount,
    albumsCount,
    videosCount,
    galleryCount,
    upcomingEventsCount,
    publishedNewsCount,
    newBookingsCount,
    artistProfile,
  ] = await Promise.all([
    db.music.count(),
    db.album.count(),
    db.video.count(),
    db.galleryAlbum.count(),
    db.event.count({ where: { eventDate: { gte: new Date() } } }),
    db.newsArticle.count({ where: { published: true } }),
    db.bookingRequest.count({ where: { status: "NEW" } }),
    db.artist.findFirst(),
  ]);

  const adminNav = [
    { href: "/admin/dashboard", label: "Dashboard", active: true },
    { href: "/admin/artist", label: "Artist Profile" },
    { href: "/admin/music", label: "Music & Albums" },
    { href: "/admin/videos", label: "Videos" },
    { href: "/admin/gallery", label: "Gallery" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/news", label: "News Articles" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/social", label: "Social Links" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-artist-charcoal text-artist-warmCream hidden md:flex flex-col">
        <div className="p-6 border-b border-artist-earth/30">
          <h1 className="font-serif text-xl font-bold tracking-wider">MANAGER PORTAL</h1>
          <p className="text-xs text-artist-sand/60 mt-1">Single Artist Control</p>
        </div>
        <nav className="flex-grow p-6 space-y-1.5 overflow-y-auto">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded text-sm transition-colors ${
                item.active
                  ? "bg-artist-earth/40 text-artist-warmCream font-semibold"
                  : "text-artist-sand/80 hover:bg-artist-earth/30 hover:text-artist-warmCream"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-artist-earth/30">
          <Link
            href="/admin/login"
            className="text-xs text-artist-deepRed hover:underline uppercase tracking-wider font-semibold block"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-gray-200">
            <div>
              <h1 className="text-3xl font-serif text-artist-richBrown font-bold">Manager Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                Overview of active content, live performance schedules, and pending representation inquiries.
              </p>
            </div>
            <div className="text-xs uppercase tracking-widest bg-artist-sand px-3 py-1.5 rounded font-semibold text-artist-richBrown">
              Profile Status: {artistProfile ? "Configured" : "Needs Setup"}
            </div>
          </header>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-2">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">New Bookings</span>
              <p className="text-3xl font-serif text-artist-deepRed">{newBookingsCount}</p>
              <Link href="/admin/bookings" className="text-xs text-blue-600 hover:underline block pt-2">Review inquiries &rarr;</Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-2">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Published Tracks</span>
              <p className="text-3xl font-serif text-artist-richBrown">{songsCount}</p>
              <Link href="/admin/music" className="text-xs text-blue-600 hover:underline block pt-2">Manage catalogue &rarr;</Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-2">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Upcoming Events</span>
              <p className="text-3xl font-serif text-artist-earth">{upcomingEventsCount}</p>
              <Link href="/admin/events" className="text-xs text-blue-600 hover:underline block pt-2">View tour schedule &rarr;</Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-2">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Gallery Albums</span>
              <p className="text-3xl font-serif text-artist-charcoal">{galleryCount}</p>
              <Link href="/admin/gallery" className="text-xs text-blue-600 hover:underline block pt-2">Curate photography &rarr;</Link>
            </div>
          </div>

          {/* Secondary Stats & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <h2 className="text-xl font-serif text-artist-richBrown">Catalogue & Media Summary</h2>
              <ul className="space-y-3 text-sm text-gray-700 divide-y divide-gray-100">
                <li className="flex justify-between pt-2"><span>Total Albums</span><span className="font-semibold">{albumsCount}</span></li>
                <li className="flex justify-between pt-2"><span>Video Releases</span><span className="font-semibold">{videosCount}</span></li>
                <li className="flex justify-between pt-2"><span>Published Articles</span><span className="font-semibold">{publishedNewsCount}</span></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-serif text-artist-richBrown">Quick Management Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/music" className="px-5 py-2.5 bg-artist-deepRed text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-richBrown transition-colors">
                  Add Music
                </Link>
                <Link href="/admin/events" className="px-5 py-2.5 bg-artist-richBrown text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-earth transition-colors">
                  Schedule Event
                </Link>
                <Link href="/admin/news" className="px-5 py-2.5 bg-artist-earth text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-charcoal transition-colors">
                  Publish News
                </Link>
                <Link href="/admin/artist" className="px-5 py-2.5 bg-gray-200 text-gray-800 text-xs uppercase tracking-wider rounded font-semibold hover:bg-gray-300 transition-colors">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}