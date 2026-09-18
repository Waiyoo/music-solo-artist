"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface ArtistProfile {
  artistName: string;
  stageName: string;
  shortBio: string;
  biography: string;
  genre: string;
  location: string;
  profileImage: string;
  heroImage: string;
}

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  active: boolean;
  displayOrder: number;
}

const platformsList = ["Instagram", "TikTok", "Facebook", "YouTube", "X", "Spotify", "Apple Music", "Audiomack", "Boomplay", "SoundCloud", "Custom"];

export default function AdminArtistPage() {
  const [profile, setProfile] = useState<ArtistProfile>({
    artistName: "",
    stageName: "",
    shortBio: "",
    biography: "",
    genre: "",
    location: "",
    profileImage: "",
    heroImage: "",
  });

  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // New social link form state
  const [newPlatform, setNewPlatform] = useState("Spotify");
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const artistRes = await fetch("/api/manager/artist");
        if (artistRes.ok) {
          const data = await artistRes.json();
          setProfile(data);
        }

        const socialRes = await fetch("/api/manager/social");
        if (socialRes.ok) {
          const data = await socialRes.json();
          setSocials(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/manager/artist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage("Artist profile updated successfully.");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    try {
      const res = await fetch("/api/manager/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: newPlatform,
          label: newLabel || newPlatform,
          url: newUrl,
          active: true,
          displayOrder: socials.length,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSocials([...socials, data.link]);
        setNewUrl("");
        setNewLabel("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    try {
      const res = await fetch(`/api/manager/social?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSocials(socials.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-artist-earth">Loading artist profile...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-64 bg-artist-charcoal text-artist-warmCream hidden md:flex flex-col">
        <div className="p-6 border-b border-artist-earth/30">
          <h1 className="font-serif text-xl font-bold tracking-wider">MANAGER PORTAL</h1>
          <p className="text-xs text-artist-sand/60 mt-1">Artist & Social Control</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30 hover:text-artist-warmCream">Dashboard</Link>
          <Link href="/admin/artist" className="block px-4 py-2.5 rounded text-sm bg-artist-earth/40 text-artist-warmCream font-semibold">Artist Profile</Link>
          <Link href="/admin/music" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30 hover:text-artist-warmCream">Music & Albums</Link>
          <Link href="/admin/events" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30 hover:text-artist-warmCream">Events</Link>
          <Link href="/admin/bookings" className="block px-4 py-2.5 rounded text-sm text-artist-sand/80 hover:bg-artist-earth/30 hover:text-artist-warmCream">Bookings</Link>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-artist-richBrown font-bold">Artist Identity & Social Presence</h1>
          <p className="text-gray-600 text-sm mt-1">Manage official biography, hero imagery, and streaming/social platform links.</p>
        </header>

        {message && (
          <div className="mb-6 p-4 bg-artist-sand/40 border border-artist-earth/30 rounded text-sm text-artist-richBrown font-medium">
            {message}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-12 space-y-6">
          <h2 className="text-xl font-serif text-artist-richBrown border-b pb-3">Core Artist Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Legal / Full Artist Name</label>
              <input
                type="text"
                value={profile.artistName || ""}
                onChange={(e) => setProfile({ ...profile, artistName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Stage Name</label>
              <input
                type="text"
                value={profile.stageName || ""}
                onChange={(e) => setProfile({ ...profile, stageName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Primary Genre</label>
              <input
                type="text"
                value={profile.genre || ""}
                onChange={(e) => setProfile({ ...profile, genre: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Base Location</label>
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Short Bio (Hero / Intro)</label>
            <textarea
              rows={2}
              value={profile.shortBio || ""}
              onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Full Biography (About Page)</label>
            <textarea
              rows={6}
              value={profile.biography || ""}
              onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Profile Photograph URL</label>
              <input
                type="text"
                value={profile.profileImage || ""}
                onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">Hero Photograph URL</label>
              <input
                type="text"
                value={profile.heroImage || ""}
                onChange={(e) => setProfile({ ...profile, heroImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-artist-deepRed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-artist-deepRed text-white text-xs uppercase tracking-widest rounded font-semibold hover:bg-artist-richBrown transition-colors"
          >
            {saving ? "Saving Changes..." : "Save Artist Profile"}
          </button>
        </form>

        {/* Social & Streaming Links Manager */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-xl font-serif text-artist-richBrown border-b pb-3">Social & Streaming Links</h2>

          <div className="space-y-4">
            {socials.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded">
                <div>
                  <span className="text-xs uppercase tracking-wider bg-artist-sand px-2 py-1 rounded font-semibold text-artist-richBrown mr-3">
                    {link.platform}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{link.label}</span>
                  <a href={link.url} target="_blank" rel="noreferrer" className="block text-xs text-blue-600 underline mt-1 truncate max-w-md">
                    {link.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteSocial(link.id)}
                  className="text-xs text-red-600 hover:underline uppercase tracking-wider"
                >
                  Delete
                </button>
              </div>
            ))}
            {socials.length === 0 && <p className="text-sm text-gray-500">No social or streaming links added yet.</p>}
          </div>

          <form onSubmit={handleAddSocial} className="pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1 font-semibold">Platform</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm bg-white"
              >
                {platformsList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1 font-semibold">Custom Label</label>
              <input
                type="text"
                placeholder="e.g. Official Spotify"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1 font-semibold">URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-artist-richBrown text-white text-xs uppercase tracking-wider rounded font-semibold hover:bg-artist-earth transition-colors whitespace-nowrap"
                >
                  Add Link
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}