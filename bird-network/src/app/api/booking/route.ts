import { NextResponse } from "next/server";
import { getVenueBySlug } from "@/data/venues";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { venueSlug, name, phone, date, time, guests, comment } = body;

    if (!venueSlug || !name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const venue = getVenueBySlug(venueSlug);
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const booking = {
      id: crypto.randomUUID(),
      venue: venue.brand.ru,
      venueSlug,
      name,
      phone,
      date,
      time,
      guests: Number(guests),
      comment: comment || "",
      createdAt: new Date().toISOString(),
    };

    console.log("[BOOKING]", JSON.stringify(booking, null, 2));

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
