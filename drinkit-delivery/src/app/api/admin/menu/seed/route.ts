import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { resetMenuToDefaults } from "@/lib/menu-store";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const menu = await resetMenuToDefaults();
    return NextResponse.json({
      ok: true,
      products: menu.products.length,
      categories: menu.categories.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось обновить меню";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
