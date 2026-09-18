import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artistdomain.com";

  let newsUrls: MetadataRoute.Sitemap = [];

  try {
    const articles = await db.newsArticle.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    newsUrls = articles.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.warn("Sitemap: Database not accessible during build, skipping dynamic news articles.");
  }

  const staticRoutes = [
    "",
    "/about",
    "/music",
    "/videos",
    "/gallery",
    "/events",
    "/news",
    "/book",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...newsUrls];
}