import { NextResponse } from "next/server";
import { confirmSbpSession } from "@/lib/sbp-payments-store";
import { createOrder, getOrderByPaymentId, getOrdersByPhone } from "@/lib/orders-store";
import { syncOrderWithRkeeper } from "@/lib/rkeeper";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.name ||
      !body.phone ||
      !body.address ||
      !body.items?.length ||
      typeof body.total !== "number" ||
      !body.paymentId ||
      !body.paymentMethod
    ) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const existing = await getOrderByPaymentId(body.paymentId);
    if (existing) {
      return NextResponse.json({ order: existing });
    }

    if (body.paymentMethod === "sbp" || body.paymentMethod === "card") {
      const session = await confirmSbpSession(body.paymentId);
      if (!session || session.status !== "paid") {
        return NextResponse.json(
          { error: "Оплата ещё не подтверждена банком." },
          { status: 402 },
        );
      }
    }

    const order = await createOrder({
      name: body.name,
      phone: body.phone,
      address: body.address,
      comment: body.comment,
      items: body.items,
      subtotal: body.subtotal ?? body.total,
      deliveryFee: body.deliveryFee ?? 0,
      giftDiscount: body.giftDiscount,
      appliedGift: body.appliedGift,
      total: body.total,
      paymentStatus: "paid",
      paymentMethod: body.paymentMethod,
      cardLast4: body.cardLast4 ?? "----",
      cardBrand: body.cardBrand ?? (body.paymentMethod === "sbp" ? "СБП" : "Card"),
      paymentId: body.paymentId,
    });

    const rkeeper = await syncOrderWithRkeeper(order);

    return NextResponse.json({ order, rkeeper });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось сохранить заказ";
    console.error("[api/order POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const phone = new URL(request.url).searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    const orders = await getOrdersByPhone(phone);
    return NextResponse.json({ orders });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить заказы";
    console.error("[api/order GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
