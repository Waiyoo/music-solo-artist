"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate: string;
  location: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "DECLINED" | "ARCHIVED";
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const url = filter ? `/api/manager/bookings?status=${filter}` : "/api/manager/bookings";
      const res = await fetch(url);
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/manager/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-64 bg-artist-charcoal text-artist-warmCream hidden md:flex flex-col">
        <div className="p-6 border-b border-artist-earth/30">
          <h1 className="font-serif text-xl font-bold tracking-wider">MANAGER PORTAL</h1>
          <p className="text-xs text-artist-sand/60 mt-1">Booking Inquiries</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Dashboard</Link>
          <Link href="/admin/artist" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Artist Profile</Link>
          <Link href="/admin/music" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Music & Albums</Link>
          <Link href="/admin/events" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Events</Link>
          <Link href="/admin/news" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">News Articles</Link>
          <Link href="/admin/bookings" className="block px-4 py-2.5 rounded text-sm bg-artist-earth/40 text-artist-warmCream font-semibold">Bookings</Link>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-artist-richBrown font-bold">Booking Inquiries</h1>
            <p className="text-gray-600 text-sm mt-1">Review performance requests and manage inquiry statuses.</p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DECLINED">Declined</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </header>

        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider bg-artist-sand px-2.5 py-1 rounded font-semibold text-artist-richBrown mr-3">
                    {b.status}
                  </span>
                  <span className="font-serif text-lg font-bold text-gray-900">{b.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({b.email} {b.phone ? `• ${b.phone}` : ""})</span>
                </div>
                <span className="text-xs text-gray-500">Submitted: {new Date(b.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div><strong>Event Type:</strong> {b.eventType}</div>
                <div><strong>Date:</strong> {new Date(b.eventDate).toLocaleDateString()}</div>
                <div><strong>Location:</strong> {b.location}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded text-sm text-gray-800 italic">
                "{b.message}"
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => updateStatus(b.id, "CONTACTED")} className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs uppercase tracking-wider rounded font-semibold hover:bg-blue-200">Mark Contacted</button>
                <button onClick={() => updateStatus(b.id, "CONFIRMED")} className="px-3 py-1.5 bg-green-100 text-green-800 text-xs uppercase tracking-wider rounded font-semibold hover:bg-green-200">Confirm Booking</button>
                <button onClick={() => updateStatus(b.id, "DECLINED")} className="px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs uppercase tracking-wider rounded font-semibold hover:bg-yellow-200">Decline</button>
                <button onClick={() => updateStatus(b.id, "ARCHIVED")} className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs uppercase tracking-wider rounded font-semibold hover:bg-gray-200">Archive</button>
              </div>
            </div>
          ))}

          {bookings.length === 0 && !loading && (
            <div className="bg-white p-12 text-center rounded-lg border border-gray-200 text-gray-500">
              No booking inquiries found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}