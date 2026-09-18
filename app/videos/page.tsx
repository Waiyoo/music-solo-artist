import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import EmptyState from "@/components/ui/EmptyState";
import VideoPlayer from "@/components/videos/VideoPlayer";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function PublicVideosPage() {
  const videos = await db.video.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const featuredVideo = videos.find((v) => v.featured) || videos[0];
  const otherVideos = videos.filter((v) => v.id !== featuredVideo?.id);

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full space-y-16">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Visuals</span>
          <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">Music Videos & Live Featurettes</h1>
          <p className="text-artist-earth max-w-xl text-sm">
            Cinematic explorations, official music videos, and live coastal performances.
          </p>
        </div>

        {featuredVideo ? (
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-artist-mutedGold font-semibold">Featured Visual Release</span>
            <VideoPlayer
              title={featuredVideo.title}
              externalUrl={featuredVideo.externalVideoUrl}
              directUrl={featuredVideo.directVideoUrl}
              thumbnail={featuredVideo.thumbnail}
            />
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-artist-richBrown">{featuredVideo.title}</h2>
              {featuredVideo.description && (
                <p className="text-artist-earth text-sm max-w-3xl leading-relaxed">{featuredVideo.description}</p>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Videos Published"
            description="The artist's manager has not yet published any video content."
          />
        )}

        {otherVideos.length > 0 && (
          <div className="space-y-8 pt-8 border-t border-artist-sand">
            <h3 className="font-serif text-2xl text-artist-richBrown">Catalogue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherVideos.map((vid) => (
                <div key={vid.id} className="space-y-4">
                  <VideoPlayer
                    title={vid.title}
                    externalUrl={vid.externalVideoUrl}
                    directUrl={vid.directVideoUrl}
                    thumbnail={vid.thumbnail}
                  />
                  <h4 className="font-serif text-lg text-artist-richBrown font-bold">{vid.title}</h4>
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