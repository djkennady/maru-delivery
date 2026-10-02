import { NextResponse } from "next/server";
import { fulfillPaidPayment } from "@/lib/fulfill-paid-order";
import { syncSbpSessionByAlfaIds } from "@/lib/sbp-payments-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function firstParam(
  params: Record<string, string>,
  ...names: string[]
): string | undefined {
  for (const name of names) {
    const value = params[name] || params[name.toLowerCase()];
    if (value) return value;
  }
  return undefined;
}

async function readCallbackParams(request: Request): Promise<Record<string, string>> {
  const params: Record<string, string> = {};
  const url = new URL(request.url);
  url.searchParams.forEach((value, key) => {
    params[key] = value;
    params[key.toLowerCase()] = value;
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
          params[key.toLowerCase()] = String(value);
        }
      }
    } catch {
      /* ignore invalid json */
    }
    return params;
  }

  new URLSearchParams(raw).forEach((value, key) => {
    params[key] = value;
    params[key.toLowerCase()] = value;
  });
  return params;
}

async function handleCallback(request: Request) {
  try {
    const params = await readCallbackParams(request);
    const orderNumber = firstParam(
      params,
      "orderNumber",
      "order_number",
      "ordernumber",
    );
    const orderId = firstParam(
      params,
      "mdOrder",
      "mdorder",
      "orderId",
      "order_id",
      "orderid",
    );

    if (!orderNumber && !orderId) {
      console.warn("[sbp webhook] missing order ids", Object.keys(params));
      return NextResponse.json({ ok: false, error: "missing order" }, { status: 200 });
    }

    const session = await syncSbpSessionByAlfaIds({ orderNumber, orderId });
    if (session?.id && session.status === "paid") {
      await fulfillPaidPayment(session.id);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "[sbp webhook]",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handleCallback(request);
}

export async function POST(request: Request) {
  return handleCallback(request);
}
