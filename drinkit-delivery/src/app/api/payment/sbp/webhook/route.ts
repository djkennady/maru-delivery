import { NextResponse } from "next/server";
import { syncSbpSessionByAlfaIds } from "@/lib/sbp-payments-store";

export const dynamic = "force-dynamic";

async function readCallbackParams(request: Request): Promise<Record<string, string>> {
  const params: Record<string, string> = {};
  const url = new URL(request.url);
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  if (request.method === "GET") return params;

  const contentType = request.headers.get("content-type") ?? "";
  const raw = await request.text();
  if (!raw) return params;

  if (contentType.includes("application/json")) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string" || typeof value === "number") {
          params[key] = String(value);
        }
      }
    } catch {
      /* ignore invalid json */
    }
    return params;
  }

  new URLSearchParams(raw).forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

async function handleCallback(request: Request) {
  try {
    const params = await readCallbackParams(request);
    const orderNumber = params.orderNumber || params.order_number;
    const orderId = params.mdOrder || params.orderId || params.order_id;

    if (!orderNumber && !orderId) {
      return NextResponse.json({ ok: false, error: "missing order" }, { status: 200 });
    }

    await syncSbpSessionByAlfaIds({ orderNumber, orderId });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET(request: Request) {
  return handleCallback(request);
}

export async function POST(request: Request) {
  return handleCallback(request);
}
