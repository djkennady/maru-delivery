import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { decodeSbpQrStorage } from "@/lib/alfa-sbp";
import {
  confirmSbpSession,
  createSbpSession,
  getSbpSession,
  syncSbpSessionWithBank,
} from "@/lib/sbp-payments-store";

export const dynamic = "force-dynamic";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Server error";
}

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
    const body = await request.json();

    if (body.action === "confirm") {
      if (!body.paymentId) {
        return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
      }

      const session = await confirmSbpSession(body.paymentId);
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

    if (typeof body.amount !== "number" || !body.phone) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const session = await createSbpSession(body.amount, body.phone);
    const payload = await sessionResponse(session);
    return NextResponse.json(payload);
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
      /* keep last known session if the bank is temporarily unavailable */
    }

    return NextResponse.json(
      { session },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
