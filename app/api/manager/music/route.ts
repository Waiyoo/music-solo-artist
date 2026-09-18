import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const music = await db.music.findMany({
      include: { externalLinks: true, albums: { include: { album: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(music);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, duration, audioUrl, coverArt, published, externalLinks } = body;

    const music = await db.music.create({
      data: {
        title,
        duration,
        audioUrl,
        coverArt,
        published: published ?? true,
        externalLinks: {
          create: externalLinks?.map((link: { platform: string; url: string }) => ({
            platform: link.platform,
            url: link.url,
          })) || [],
        },
      },
      include: { externalLinks: true },
    });

    return NextResponse.json({ success: true, music });
  } catch (error) {
    console.error("Create music error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}