import { NextResponse } from "next/server";
import { getMenu } from "@/lib/menu-store";

export async function GET() {
  try {
    const menu = await getMenu();
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
