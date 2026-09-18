import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await db.newsArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 w-full space-y-8">
        <div className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">{article.title}</h1>
        </div>

        {article.featuredImage && (
          <div className="h-[400px] rounded-lg overflow-hidden shadow-lg border border-artist-sand">
            <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg text-artist-charcoal/90 leading-relaxed space-y-6 pt-6 border-t border-artist-sand whitespace-pre-line font-light">
          {article.content}
        </div>
      </main>
      <Footer />
    </div>
  );
}