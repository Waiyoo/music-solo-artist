"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import EmptyState from "@/components/ui/EmptyState";
import Lightbox from "@/components/gallery/Lightbox";

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface GalleryAlbum {
  id: string;
  title: string;
  description?: string | null;
  images: GalleryImage[];
}

export default function PublicGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allImagesFlat, setAllImagesFlat] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/manager/gallery");
        if (res.ok) {
          const data: GalleryAlbum[] = await res.json();
          setAlbums(data);
          const flat = data.flatMap((a) => a.images);
          setAllImagesFlat(flat);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const openLightbox = (img: GalleryImage, flatIndex: number) => {
    setSelectedImage(img);
    setCurrentIndex(flatIndex);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allImagesFlat.length;
    setCurrentIndex(nextIdx);
    setSelectedImage(allImagesFlat[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allImagesFlat.length) % allImagesFlat.length;
    setCurrentIndex(prevIdx);
    setSelectedImage(allImagesFlat[prevIdx]);
  };

  let globalImageCounter = 0;

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-16">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Visual Identity</span>
          <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">Editorial Gallery</h1>
          <p className="text-artist-earth max-w-xl text-sm">
            High-resolution photography capturing coastal atmosphere, studio sessions, and live editorial performances.
          </p>
        </div>

        {albums.length > 0 ? (
          <div className="space-y-16">
            {albums.map((album) => (
              <div key={album.id} className="space-y-6">
                <div className="border-b border-artist-sand pb-3">
                  <h2 className="font-serif text-2xl text-artist-richBrown">{album.title}</h2>
                  {album.description && <p className="text-artist-earth text-xs mt-1">{album.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {album.images.map((img) => {
                    const currentFlatIdx = globalImageCounter++;
                    return (
                      <div
                        key={img.id}
                        onClick={() => openLightbox(img, currentFlatIdx)}
                        className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-artist-charcoal cursor-pointer shadow-md border border-artist-sand/50"
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.caption || album.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                          <p className="text-artist-warmCream text-xs font-serif italic">
                            {img.caption || album.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <EmptyState
              title="Gallery Archive Empty"
              description="The artist's manager has not yet published any photography collections."
            />
          )
        )}
      </main>

      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={allImagesFlat.length > 1 ? handleNext : undefined}
          onPrev={allImagesFlat.length > 1 ? handlePrev : undefined}
        />
      )}

      <Footer />
    </div>
  );
}