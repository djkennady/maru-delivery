import { NextResponse } from "next/server";
import QRCode from "qrcode";
import {
  confirmSbpSession,
  createSbpSession,
  getSbpSession,
} from "@/lib/sbp-payments-store";

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
          { error: "Срок оплаты по QR истёк. Создайте новый." },
          { status: 410 },
        );
      }

      return NextResponse.json({ session });
    }

    if (typeof body.amount !== "number" || !body.phone) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const session = await createSbpSession(body.amount, body.phone);
    const qrDataUrl = await QRCode.toDataURL(session.qrPayload, {
      margin: 1,
      width: 280,
      color: { dark: "#0f172a", light: "#ffffff" },
    });

    return NextResponse.json({ session, qrDataUrl });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const paymentId = new URL(request.url).searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
    }

    const session = await getSbpSession(paymentId);
    if (!session) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
