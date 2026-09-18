"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  venue: string;
  location: string;
  ticketUrl?: string;
  published: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/manager/events");
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate) return;

    try {
      const res = await fetch("/api/manager/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, eventDate, venue, location, ticketUrl, published: true }),
      });

      if (res.ok) {
        setTitle("");
        setVenue("");
        setLocation("");
        setEventDate("");
        setTicketUrl("");
        setDescription("");
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/manager/events?id=${id}`, { method: "DELETE" });
      if (res.ok) setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-64 bg-artist-charcoal text-artist-warmCream hidden md:flex flex-col">
        <div className="p-6 border-b border-artist-earth/30">
          <h1 className="font-serif text-xl font-bold tracking-wider">MANAGER PORTAL</h1>
          <p className="text-xs text-artist-sand/60 mt-1">Tour Events</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Dashboard</Link>
          <Link href="/admin/artist" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Artist Profile</Link>
          <Link href="/admin/music" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Music & Albums</Link>
          <Link href="/admin/events" className="block px-4 py-2.5 rounded text-sm bg-artist-earth/40 text-artist-warmCream font-semibold">Events</Link>
          <Link href="/admin/news" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">News Articles</Link>
          <Link href="/admin/bookings" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Bookings</Link>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-artist-richBrown font-bold">Tour Dates & Events Management</h1>
          <p className="text-gray-600 text-sm mt-1">Schedule live performances, venue details, and external ticketing links.</p>
        </header>

        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Schedule New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Event / Tour Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
              required
            />
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Venue Name"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="text"
              placeholder="Location (City, Country)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="url"
              placeholder="External Ticket URL"
              value={ticketUrl}
              onChange={(e) => setTicketUrl(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-artist-deepRed text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-richBrown transition-colors"
          >
            Publish Event
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Scheduled Events ({events.length})</h2>
          {events.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded">
              <div>
                <h4 className="font-serif font-bold text-gray-900">{ev.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{ev.venue}, {ev.location} • {new Date(ev.eventDate).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(ev.id)}
                className="text-xs text-red-600 hover:underline uppercase tracking-wider font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
          {events.length === 0 && !loading && <p className="text-sm text-gray-500">No events scheduled.</p>}
        </div>
      </main>
    </div>
  );
}