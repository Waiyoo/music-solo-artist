import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const links = await db.socialLink.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { platform, label, url, icon, active, displayOrder } = await request.json();
    const link = await db.socialLink.create({
      data: { platform, label, url, icon, active: active ?? true, displayOrder: displayOrder ?? 0 },
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await verifySession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, platform, label, url, icon, active, displayOrder } = await request.json();
    const link = await db.socialLink.update({
      where: { id },
      data: { platform, label, url, icon, active, displayOrder },
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
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

    await db.socialLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}