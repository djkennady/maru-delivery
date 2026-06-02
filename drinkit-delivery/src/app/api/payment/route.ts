import { NextResponse } from "next/server";
import { processDemoPayment } from "@/lib/card-payment";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.cardNumber ||
      !body.expiry ||
      !body.cvc ||
      !body.cardholder ||
      typeof body.amount !== "number"
    ) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const result = processDemoPayment(
      {
        cardNumber: body.cardNumber,
        expiry: body.expiry,
        cvc: body.cvc,
        cardholder: body.cardholder,
      },
      body.amount,
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 402 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
