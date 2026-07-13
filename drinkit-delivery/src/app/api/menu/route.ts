import { NextResponse } from "next/server";
import { getMenu } from "@/lib/menu-store";

export async function GET() {
  try {
    const menu = await getMenu();
    return NextResponse.json(menu);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Server error";
    console.error("GET /api/menu failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
