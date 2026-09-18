"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  images: { id: string; imageUrl: string; caption?: string }[];
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<{ imageUrl: string; caption?: string }[]>([]);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/manager/gallery");
      if (res.ok) setAlbums(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImageToDraft = () => {
    if (!imageUrl) return;
    setImages([...images, { imageUrl, caption }]);
    setImageUrl("");
    setCaption("");
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || images.length === 0) return;

    try {
      const res = await fetch("/api/manager/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          coverImage: images[0]?.imageUrl,
          images,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setImages([]);
        fetchAlbums();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    try {
      const res = await fetch(`/api/manager/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAlbums(albums.filter((a) => a.id !== id));
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
          <p className="text-xs text-artist-sand/60 mt-1">Editorial Photography</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Dashboard</Link>
          <Link href="/admin/artist" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Artist Profile</Link>
          <Link href="/admin/music" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Music & Albums</Link>
          <Link href="/admin/videos" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Videos</Link>
          <Link href="/admin/gallery" className="block px-4 py-2.5 rounded text-sm bg-artist-earth/40 text-artist-warmCream font-semibold">Gallery</Link>
          <Link href="/admin/events" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Events</Link>
          <Link href="/admin/bookings" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30">Bookings</Link>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-artist-richBrown font-bold">Editorial Photography Management</h1>
          <p className="text-gray-600 text-sm mt-1">Create photo albums and curate high-resolution photography collections.</p>
        </header>

        {/* Create Album Form */}
        <form onSubmit={handleCreateAlbum} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Create New Photo Album</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Album Title (e.g. Press & Editorial, Live Performance)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            />
          </div>

          <div className="p-4 bg-gray-50 border rounded space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-700">Add Photos to Album ({images.length} added)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              />
              <input
                type="text"
                placeholder="Photo Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              />
              <button
                type="button"
                onClick={handleAddImageToDraft}
                className="px-4 py-2 bg-artist-richBrown text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-earth transition-colors"
              >
                Attach Photo
              </button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {images.map((img, idx) => (
                  <span key={idx} className="text-xs bg-artist-sand px-2 py-1 rounded text-artist-richBrown truncate max-w-xs">
                    {idx + 1}. {img.caption || img.imageUrl}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-artist-deepRed text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-richBrown transition-colors"
          >
            Publish Photo Album
          </button>
        </form>

        {/* Albums List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-serif text-artist-richBrown font-bold">Published Albums ({albums.length})</h2>
          {albums.map((album) => (
            <div key={album.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded">
              <div>
                <h4 className="font-serif font-bold text-gray-900">{album.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{album.images.length} Photos in collection</p>
              </div>
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="text-xs text-red-600 hover:underline uppercase tracking-wider font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
          {albums.length === 0 && !loading && <p className="text-sm text-gray-500">No photography albums published yet.</p>}
        </div>
      </main>
    </div>
  );
}