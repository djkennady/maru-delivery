import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { getMenu } from "@/lib/menu-store";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const menu = await getMenu();
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
