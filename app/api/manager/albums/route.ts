import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const albums = await db.album.findMany({
      include: { songs: { include: { music: true }, orderBy: { trackNo: "asc" } } },
      orderBy: { releaseDate: "desc" },
    });
    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, releaseDate, coverArt, description, published, songIds } = await request.json();

    const album = await db.album.create({
      data: {
        title,
        releaseDate: new Date(releaseDate || Date.now()),
        coverArt,
        description,
        published: published ?? false,
        songs: {
          create: songIds?.map((musicId: string, index: number) => ({
            musicId,
            trackNo: index + 1,
          })) || [],
        },
      },
      include: { songs: { include: { music: true } } },
    });

    return NextResponse.json({ success: true, album });
  } catch (error) {
    console.error("Create album error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}