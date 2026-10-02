import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { decodeSbpQrStorage } from "@/lib/alfa-sbp";
import { jsonFromError, readJsonBody } from "@/lib/api-error";
import { quoteCheckout } from "@/lib/checkout-quote";
import { getMenu } from "@/lib/menu-store";
import {
  confirmSbpSession,
  createSbpSession,
  getSbpSession,
  syncSbpSessionWithBank,
} from "@/lib/sbp-payments-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function sessionResponse(session: {
  id: string;
  amount: number;
  phone: string;
  status: string;
  qrPayload: string;
  createdAt: string;
  expiresAt: string;
  paidAt?: string;
}) {
  const { payload } = decodeSbpQrStorage(session.qrPayload);
  const qrDataUrl = await QRCode.toDataURL(payload, {
    margin: 1,
    width: 280,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
  return { session, qrDataUrl };
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

    if (payload.action === "confirm") {
      if (!payload.paymentId || typeof payload.paymentId !== "string") {
        return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
      }

      const session = await confirmSbpSession(payload.paymentId);
      if (!session) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      if (session.status === "expired") {
        return NextResponse.json(
          { error: "Срок оплаты по QR истёк или платёж отклонён. Создайте новый." },
          { status: 410 },
        );
      }

      if (session.status !== "paid") {
        return NextResponse.json(
          {
            error: "Оплата ещё не поступила. Подтвердите платёж в приложении банка.",
            session,
          },
          { status: 409 },
        );
      }

      return NextResponse.json({ session });
    }

    const menu = await getMenu();
    const quoted = quoteCheckout(payload, menu, { requireAmount: true });
    const session = await createSbpSession(
      quoted.amount,
      quoted.draft.phone,
      quoted.draft,
    );
    const response = await sessionResponse(session);
    return NextResponse.json(response);
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function GET(request: Request) {
  try {
    const paymentId = new URL(request.url).searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
    }

    let session = await getSbpSession(paymentId);
    if (!session) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    try {
      session = (await syncSbpSessionWithBank(paymentId)) ?? session;
    } catch {
      /* keep last known session if the bank is temporarily unavailable */
    }

    return NextResponse.json(
      { session },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return jsonFromError(error);
  }
}
