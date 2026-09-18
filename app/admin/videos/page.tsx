"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Video {
  id: string;
  title: string;
  externalVideoUrl?: string;
  published: boolean;
  featured: boolean;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [externalVideoUrl, setExternalVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/manager/videos");
      if (res.ok) setVideos(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await fetch("/api/manager/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, externalVideoUrl, featured, published: true }),
      });

      if (res.ok) {
        setTitle("");
        setExternalVideoUrl("");
        setDescription("");
        setFeatured(false);
        fetchVideos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/manager/videos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
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
          <p className="text-xs text-artist-sand/60 mt-1">Video Catalogue</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Dashboard</Link>
          <Link href="/admin/artist" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Artist Profile</Link>
          <Link href="/admin/music" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Music & Albums</Link>
          <Link href="/admin/videos" className="block px-4 py-2.5 rounded text-sm bg-artist-earth/40 text-artist-warmCream font-semibold">Videos</Link>
          <Link href="/admin/events" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Events</Link>
          <Link href="/admin/bookings" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Bookings</Link>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-artist-richBrown font-bold">Video Management</h1>
          <p className="text-gray-600 text-sm mt-1">Publish official music videos, live performances, and editorial visual features.</p>
        </header>

        {/* Add Video Form */}
        <form onSubmit={handleCreateVideo} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Add New Video</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
              required
            />
            <input
              type="url"
              placeholder="YouTube / Vimeo URL"
              value={externalVideoUrl}
              onChange={(e) => setExternalVideoUrl(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            />
          </div>
          <textarea
            placeholder="Video Description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-xs uppercase tracking-wider text-gray-700 font-semibold">Mark as Featured Video</label>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-artist-deepRed text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-richBrown transition-colors"
          >
            Publish Video
          </button>
        </form>

        {/* Videos List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Published Videos ({videos.length})</h2>
          {videos.map((vid) => (
            <div key={vid.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded">
              <div>
                <h4 className="font-serif font-bold text-gray-900">{vid.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {vid.featured ? "Featured • " : ""}Status: {vid.published ? "Published" : "Draft"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(vid.id)}
                className="text-xs text-red-600 hover:underline uppercase tracking-wider font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
          {videos.length === 0 && !loading && <p className="text-sm text-gray-500">No videos published yet.</p>}
        </div>
      </main>
    </div>
  );
}