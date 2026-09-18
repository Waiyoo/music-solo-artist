import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const albums = await db.galleryAlbum.findMany({
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
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

    const { title, description, coverImage, images } = await request.json();

    const album = await db.galleryAlbum.create({
      data: {
        title,
        description,
        coverImage,
        images: {
          create: images?.map((img: { imageUrl: string; caption?: string }, index: number) => ({
            imageUrl: img.imageUrl,
            caption: img.caption,
            order: index,
          })) || [],
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, album });
  } catch (error) {
    console.error("Create gallery album error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await verifySession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.galleryAlbum.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}