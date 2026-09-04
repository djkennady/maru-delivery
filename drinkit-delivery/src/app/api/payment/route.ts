import { NextResponse } from "next/server";
import {
  confirmSbpSession,
  createCardSession,
  getSbpSession,
  syncSbpSessionWithBank,
} from "@/lib/sbp-payments-store";
import { decodeSbpQrStorage } from "@/lib/alfa-sbp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Server error";
}

async function paidOrPending(paymentId: string) {
  const session =
    (await confirmSbpSession(paymentId)) ?? (await getSbpSession(paymentId));
  if (!session) return null;
  const stored = decodeSbpQrStorage(session.qrPayload);
  return { session, stored };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "confirm") {
      if (!body.paymentId) {
        return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
      }

      const result = await paidOrPending(body.paymentId);
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

    if (typeof body.amount !== "number" || !body.phone) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const pageView = body.pageView === "MOBILE" ? "MOBILE" : "DESKTOP";
    const { session, paymentUrl } = await createCardSession(
      body.amount,
      body.phone,
      pageView,
    );

    return NextResponse.json({ session, paymentUrl, paymentId: session.id });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
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
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
