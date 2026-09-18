import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let artist = await db.artist.findFirst();
    if (!artist) {
      // Initialize default stub if none exists
      artist = await db.artist.create({
        data: {
          artistName: "Artist Name",
          stageName: "STAGE NAME",
          shortBio: "Contemporary African × Coastal × Nubian soundscape architect.",
          biography: "Full artist biography goes here. Enter details about musical heritage, coastal roots, and international releases.",
          genre: "Afro-Fusion / Nubian Soul",
          location: "Nairobi / Coast, Kenya",
        },
      });
    }

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Fetch artist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { artistName, stageName, shortBio, biography, genre, location, profileImage, heroImage } = body;

    let artist = await db.artist.findFirst();

    if (artist) {
      artist = await db.artist.update({
        where: { id: artist.id },
        data: { artistName, stageName, shortBio, biography, genre, location, profileImage, heroImage },
      });
    } else {
      artist = await db.artist.create({
        data: { artistName, stageName, shortBio, biography, genre, location, profileImage, heroImage },
      });
    }

    return NextResponse.json({ success: true, artist });
  } catch (error) {
    console.error("Update artist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}