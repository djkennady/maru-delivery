/** Pickup-only mode until delivery and the new bonus program are ready. */
export const FULFILLMENT_MODE = "pickup" as const;
export const SHOW_LOYALTY_BONUSES = false;
export const PICKUP_DISCOUNT_RATE = 0.1;

export function getPickupDiscount(subtotal: number): number {
  const value = Number.isFinite(subtotal) ? subtotal : 0;
  return Math.round(value * PICKUP_DISCOUNT_RATE);
}
