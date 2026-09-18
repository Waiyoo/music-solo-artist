import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import EmptyState from "@/components/ui/EmptyState";
import { db } from "@/lib/db";
import Link from "next/link";

export const revalidate = 0;

export default async function PublicNewsPage() {
  const articles = await db.newsArticle.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full space-y-16">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Editorial</span>
          <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">News & Press</h1>
          <p className="text-artist-earth max-w-xl text-sm">
            Official press releases, announcements, and critical editorial reviews.
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((art) => (
              <Link key={art.id} href={`/news/${art.slug}`} className="group bg-white p-8 rounded-lg border border-artist-sand shadow-sm space-y-4 transition-all hover:border-artist-deepRed">
                <span className="text-xs uppercase tracking-widest text-artist-earth">
                  {new Date(art.createdAt).toLocaleDateString()}
                </span>
                <h2 className="font-serif text-2xl text-artist-richBrown group-hover:text-artist-deepRed transition-colors">
                  {art.title}
                </h2>
                {art.excerpt && <p className="text-artist-earth text-sm leading-relaxed">{art.excerpt}</p>}
                <span className="inline-block text-xs uppercase tracking-widest text-artist-deepRed font-semibold pt-2">
                  Read Article &rarr;
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Articles Published"
            description="The manager has not published any news articles yet."
          />
        )}
      </main>
      <Footer />
    </div>
  );
}