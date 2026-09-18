import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, eventDate, location, message } = body;

    if (!name || !email || !eventType || !eventDate || !location || !message) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    // Save booking request to database FIRST before notification dispatch
    const booking = await db.bookingRequest.create({
      data: {
        name,
        email,
        phone,
        eventType,
        eventDate: new Date(eventDate),
        location,
        message,
        status: "NEW",
      },
    });

    // TODO: Dispatch manager notification email via configured transport if available

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json({ error: "Failed to submit booking request." }, { status: 500 });
  }
}