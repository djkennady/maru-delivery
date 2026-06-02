import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { createProduct } from "@/lib/menu-store";
import type { ProductInput } from "@/types/menu";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProductInput;

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    if (!body.categoryId?.trim()) {
      return NextResponse.json({ error: "Category required" }, { status: 400 });
    }

    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
