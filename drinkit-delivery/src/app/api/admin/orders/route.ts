import { NextResponse } from "next/server";
import { getAdminPassword, isAuthorizedAdmin } from "@/lib/admin-auth";
import { jsonFromError, readJsonBody } from "@/lib/api-error";
import { getAllOrders } from "@/lib/orders-store";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const expected = getAdminPassword();
    if (!expected || payload.password !== expected) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonFromError(error);
  }
}
