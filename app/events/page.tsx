import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import EmptyState from "@/components/ui/EmptyState";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function PublicEventsPage() {
  const now = new Date();
  const events = await db.event.findMany({
    where: { published: true },
    orderBy: { eventDate: "asc" },
  });

  const upcomingEvents = events.filter((e) => new Date(e.eventDate) >= now);
  const pastEvents = events.filter((e) => new Date(e.eventDate) < now);

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full space-y-16">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Live</span>
          <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">Tour Dates & Events</h1>
          <p className="text-artist-earth max-w-xl text-sm">
            Experience live coastal soundscapes and acoustic performances worldwide.
          </p>
        </div>

        <div className="space-y-8">
          <h2 className="font-serif text-2xl text-artist-richBrown border-b pb-3">Upcoming Performances</h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white rounded-lg border border-artist-sand shadow-sm">
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
          ) : (
            <EmptyState
              title="No Upcoming Tour Dates"
              description="Manager has not scheduled any upcoming performances at this time."
            />
          )}
        </div>

        {pastEvents.length > 0 && (
          <div className="space-y-8 pt-8 border-t border-artist-sand">
            <h2 className="font-serif text-2xl text-artist-earth">Past Performances</h2>
            <div className="space-y-3 opacity-75">
              {pastEvents.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between p-4 bg-artist-sand/30 rounded border">
                  <div>
                    <h4 className="font-serif text-artist-richBrown font-semibold">{ev.title}</h4>
                    <p className="text-xs text-artist-earth">{ev.venue}, {ev.location} • {new Date(ev.eventDate).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-artist-earth">Concluded</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}