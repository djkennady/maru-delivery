import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.address || !body.items?.length) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    console.log("[delivery order]", JSON.stringify(body, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
