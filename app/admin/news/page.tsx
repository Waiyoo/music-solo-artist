"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/manager/news");
      if (res.ok) setArticles(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch("/api/manager/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content, published: true }),
      });

      if (res.ok) {
        setTitle("");
        setExcerpt("");
        setContent("");
        fetchNews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/manager/news?id=${id}`, { method: "DELETE" });
      if (res.ok) setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-64 bg-artist-charcoal text-artist-warmCream hidden md:flex flex-col">
        <div className="p-6 border-b border-artist-earth/30">
          <h1 className="font-serif text-xl font-bold tracking-wider">MANAGER PORTAL</h1>
          <p className="text-xs text-artist-sand/60 mt-1">Editorial News</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Dashboard</Link>
          <Link href="/admin/artist" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Artist Profile</Link>
          <Link href="/admin/music" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Music & Albums</Link>
          <Link href="/admin/events" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Events</Link>
          <Link href="/admin/news" className="block px-4 py-2.5 rounded text-sm bg-artist-earth/40 text-artist-warmCream font-semibold">News Articles</Link>
          <Link href="/admin/bookings" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Bookings</Link>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-artist-richBrown font-bold">News & Press Editorial</h1>
          <p className="text-gray-600 text-sm mt-1">Publish press releases, announcements, and editorial features.</p>
        </header>

        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Publish New Article</h2>
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
          <textarea
            placeholder="Short Excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
          />
          <textarea
            placeholder="Full Article Content (Markdown / HTML supported)"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-artist-deepRed text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-richBrown transition-colors"
          >
            Publish Article
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Published Articles ({articles.length})</h2>
          {articles.map((art) => (
            <div key={art.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded">
              <div>
                <h4 className="font-serif font-bold text-gray-900">{art.title}</h4>
                <p className="text-xs text-gray-500 mt-1">Slug: /{art.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(art.id)}
                className="text-xs text-red-600 hover:underline uppercase tracking-wider font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
          {articles.length === 0 && !loading && <p className="text-sm text-gray-500">No articles published.</p>}
        </div>
      </main>
    </div>
  );
}