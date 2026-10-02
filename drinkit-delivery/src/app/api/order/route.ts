import { NextResponse } from "next/server";
import { jsonFromError, readJsonBody, ClientError } from "@/lib/api-error";
import { confirmSbpSession } from "@/lib/sbp-payments-store";
import { fulfillPaidPayment } from "@/lib/fulfill-paid-order";
import { getOrderByPaymentId, getOrdersByPhone } from "@/lib/orders-store";
import { getPaymentOrderDraft } from "@/lib/payment-order-draft";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const paymentId =
      typeof payload.paymentId === "string" ? payload.paymentId.trim() : "";

    if (!paymentId) {
      throw new ClientError("Invalid order");
    }

    const existing = await getOrderByPaymentId(paymentId);
    if (existing) {
      return NextResponse.json({ order: existing });
    }

    const draft = await getPaymentOrderDraft(paymentId);
    if (!draft) {
      throw new ClientError("Checkout draft not found");
    }

    if (draft.paymentMethod === "sbp" || draft.paymentMethod === "card") {
      const session = await confirmSbpSession(paymentId);
      if (!session || session.status !== "paid") {
        return NextResponse.json(
          { error: "Оплата ещё не подтверждена банком." },
          { status: 402 },
        );
      }
    }

    const fulfilled = await fulfillPaidPayment(paymentId);
    if (fulfilled) {
      return NextResponse.json({ order: fulfilled });
    }

    throw new ClientError("Не удалось сохранить заказ", 409);
  } catch (error) {
    if (!(error instanceof ClientError)) {
      console.error(
        "[api/order POST]",
        error instanceof Error ? error.message : error,
      );
    }
    return jsonFromError(error);
  }
}

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const paymentId = params.get("paymentId");
    if (paymentId) {
      const order = await getOrderByPaymentId(paymentId);
      return NextResponse.json({ order, orders: order ? [order] : [] });
    }

    const phone = params.get("phone");
    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    const orders = await getOrdersByPhone(phone);
    return NextResponse.json({ orders });
  } catch (error) {
    return jsonFromError(error);
  }
}
