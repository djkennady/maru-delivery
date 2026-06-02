import type { PaymentMethod, PaymentStatus } from "@/types/user";

export function getPaymentLabel(order: {
  paymentMethod: PaymentMethod;
  cardBrand: string;
  cardLast4: string;
}): string {
  if (order.paymentMethod === "sbp") {
    return "СБП";
  }
  return `${order.cardBrand} ·••• ${order.cardLast4}`;
}

export function buildOrderPayment(
  method: PaymentMethod,
  paymentId: string,
): {
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId: string;
  cardLast4: string;
  cardBrand: string;
} {
  if (method === "sbp") {
    return {
      paymentStatus: "paid",
      paymentMethod: "sbp",
      paymentId,
      cardLast4: "----",
      cardBrand: "СБП",
    };
  }

  return {
    paymentStatus: "paid",
    paymentMethod: "card",
    paymentId,
    cardLast4: "0000",
    cardBrand: "Card",
  };
}
