import { createOrder, getOrderByPaymentId } from "@/lib/orders-store";
import { getPaymentOrderDraft } from "@/lib/payment-order-draft";
import { getSbpSession } from "@/lib/sbp-payments-store";
import { syncOrderWithRkeeper } from "@/lib/rkeeper";
import { ensureAdminsNotifiedAboutOrder } from "@/lib/telegram";
import type { OrderRecord } from "@/types/user";

export async function fulfillPaidPayment(
  paymentId: string,
): Promise<OrderRecord | null> {
  if (!paymentId) return null;

  const existing = await getOrderByPaymentId(paymentId);
  if (existing) {
    try {
      await ensureAdminsNotifiedAboutOrder(existing);
    } catch (error) {
      console.error(
        "[telegram] notify retry failed",
        error instanceof Error ? error.message : error,
      );
    }
    return existing;
  }

  const session = await getSbpSession(paymentId);
  if (!session || session.status !== "paid") return null;

  const draft = await getPaymentOrderDraft(paymentId);
  if (!draft) {
    console.error("[order] payment is paid but checkout draft is missing", paymentId);
    return null;
  }

  const order = await createOrder({
    name: draft.name,
    phone: draft.phone,
    address: draft.address,
    comment: draft.comment,
    items: draft.items,
    subtotal: draft.subtotal,
    deliveryFee: draft.deliveryFee,
    giftDiscount: draft.giftDiscount,
    appliedGift: draft.appliedGift,
    total: draft.total,
    paymentStatus: "paid",
    paymentMethod: draft.paymentMethod,
    cardLast4: "----",
    cardBrand: draft.paymentMethod === "sbp" ? "СБП" : "Карта",
    paymentId,
  });

  try {
    await syncOrderWithRkeeper(order);
  } catch (error) {
    console.error(
      "[rkeeper] sync failed",
      error instanceof Error ? error.message : error,
    );
  }

  try {
    await ensureAdminsNotifiedAboutOrder(order);
  } catch (error) {
    console.error(
      "[telegram] notify failed",
      error instanceof Error ? error.message : error,
    );
  }

  return order;
}
