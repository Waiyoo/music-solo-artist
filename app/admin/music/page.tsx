"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Song {
  id: string;
  title: string;
  duration?: string;
  published: boolean;
  audioUrl?: string;
}

export default function AdminMusicPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/manager/music");
      if (res.ok) setSongs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await fetch("/api/manager/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, audioUrl, duration, published: true }),
      });

      if (res.ok) {
        setTitle("");
        setAudioUrl("");
        setDuration("");
        fetchSongs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-64 bg-artist-charcoal text-artist-warmCream hidden md:flex flex-col">
        <div className="p-6 border-b border-artist-earth/30">
          <h1 className="font-serif text-xl font-bold tracking-wider">MANAGER PORTAL</h1>
          <p className="text-xs text-artist-sand/60 mt-1">Music Catalogue</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Dashboard</Link>
          <Link href="/admin/artist" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Artist Profile</Link>
          <Link href="/admin/music" className="block px-4 py-2.5 rounded text-sm bg-artist-earth/40 text-artist-warmCream font-semibold">Music & Albums</Link>
          <Link href="/admin/events" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Events</Link>
          <Link href="/admin/bookings" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Bookings</Link>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-artist-richBrown font-bold">Music Catalogue Management</h1>
          <p className="text-gray-600 text-sm mt-1">Add singles, albums, direct audio files, and external streaming service links.</p>
        </header>

        {/* Quick Add Song Form */}
        <form onSubmit={handleCreateSong} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Add New Track</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Track Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
              required
            />
            <input
              type="text"
              placeholder="Audio URL (optional)"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="text"
              placeholder="Duration (e.g. 3:45)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-artist-deepRed text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-richBrown transition-colors"
          >
            Publish Track
          </button>
        </form>

        {/* Songs List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Published Tracks ({songs.length})</h2>
          {songs.map((song) => (
            <div key={song.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded">
              <div>
                <h4 className="font-serif font-bold text-gray-900">{song.title}</h4>
                <p className="text-xs text-gray-500 mt-1">Duration: {song.duration || "N/A"} • Status: {song.published ? "Published" : "Draft"}</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Active</span>
            </div>
          ))}
          {songs.length === 0 && !loading && <p className="text-sm text-gray-500">No tracks published yet.</p>}
        </div>
      </main>
    </div>
  );
}