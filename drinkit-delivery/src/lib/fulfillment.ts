import { getMoscowMinutes } from "@/lib/breakfast-hours";

/** Pickup-only mode until delivery and the new bonus program are ready. */
export const FULFILLMENT_MODE = "pickup" as const;
export const SHOW_LOYALTY_BONUSES = false;

/** Base pickup discount outside happy hours. */
export const PICKUP_DISCOUNT_RATE = 0.1;
/** Happy-hour pickup discount (Moscow time). */
export const PICKUP_HAPPY_HOUR_RATE = 0.2;
/** Inclusive start: 11:30 MSK. */
export const PICKUP_HAPPY_HOUR_START_MINUTES = 11 * 60 + 30;
/** Exclusive end: 13:30 MSK. */
export const PICKUP_HAPPY_HOUR_END_MINUTES = 13 * 60 + 30;

export function isPickupHappyHour(now: Date = new Date()): boolean {
  const minutes = getMoscowMinutes(now);
  return (
    minutes >= PICKUP_HAPPY_HOUR_START_MINUTES &&
    minutes < PICKUP_HAPPY_HOUR_END_MINUTES
  );
}

export function getPickupDiscountRate(now: Date = new Date()): number {
  return isPickupHappyHour(now) ? PICKUP_HAPPY_HOUR_RATE : PICKUP_DISCOUNT_RATE;
}

/** Whole percent for UI labels: 10 or 20. */
export function getPickupDiscountPercent(now: Date = new Date()): number {
  return Math.round(getPickupDiscountRate(now) * 100);
}

export function getPickupDiscountLabel(now: Date = new Date()): string {
  return `Скидка ${getPickupDiscountPercent(now)}% за самовывоз`;
}

export function getPickupDiscount(subtotal: number, now: Date = new Date()): number {
  const value = Number.isFinite(subtotal) ? subtotal : 0;
  return Math.round(value * getPickupDiscountRate(now));
}
