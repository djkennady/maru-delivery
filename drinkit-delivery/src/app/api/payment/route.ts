import { NextResponse } from "next/server";
import {
  confirmSbpSession,
  createCardSession,
  getSbpSession,
  syncSbpSessionWithBank,
} from "@/lib/sbp-payments-store";
import { decodeSbpQrStorage } from "@/lib/alfa-sbp";
import { jsonFromError, readJsonBody } from "@/lib/api-error";
import { quoteCheckout } from "@/lib/checkout-quote";
import { getMenu } from "@/lib/menu-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function paidOrPending(paymentId: string) {
  const session =
    (await confirmSbpSession(paymentId)) ?? (await getSbpSession(paymentId));
  if (!session) return null;
  const stored = decodeSbpQrStorage(session.qrPayload);
  return { session, stored };
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

    if (payload.action === "confirm") {
      if (!payload.paymentId || typeof payload.paymentId !== "string") {
        return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
      }

      const result = await paidOrPending(payload.paymentId);
      if (!result) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      if (result.session.status === "expired") {
        return NextResponse.json(
          { error: "Оплата картой не прошла или срок истёк. Попробуйте ещё раз." },
          { status: 410 },
        );
      }

      if (result.session.status !== "paid") {
        return NextResponse.json(
          {
            error: "Оплата ещё не подтверждена банком.",
            session: result.session,
          },
          { status: 409 },
        );
      }

      return NextResponse.json({
        session: result.session,
        paymentId: result.session.id,
        cardLast4: "----",
        cardBrand: "Карта",
      });
    }

    const menu = await getMenu();
    const quoted = quoteCheckout(payload, menu, { requireAmount: true });
    const pageView = payload.pageView === "MOBILE" ? "MOBILE" : "DESKTOP";
    const { session, paymentUrl } = await createCardSession(
      quoted.amount,
      quoted.draft.phone,
      pageView,
      quoted.draft,
    );

    return NextResponse.json({ session, paymentUrl, paymentId: session.id });
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
      /* keep last known session */
    }

    return NextResponse.json(
      { session },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return jsonFromError(error);
  }
}
