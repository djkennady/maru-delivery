import { getMoscowMinutes } from "@/lib/breakfast-hours";

/** Pickup opens with the cafe breakfast window (Moscow). */
export const PICKUP_OPENS_AT_MINUTES = 8 * 60;
/** Exclusive end: last orders before 18:30 MSK, every day. */
export const PICKUP_CLOSES_AT_MINUTES = 18 * 60 + 30;

export const PICKUP_HOURS_LABEL = "ежедневно 8:00–18:30";
export const PICKUP_CLOSED_MESSAGE =
  "Самовывоз принимает заказы ежедневно с 8:00 до 18:30 МСК";

/** Pickup orders from 08:00 inclusive to 18:30 exclusive, Moscow time. */
export function isPickupOpen(now: Date = new Date()): boolean {
  const minutes = getMoscowMinutes(now);
  return (
    minutes >= PICKUP_OPENS_AT_MINUTES && minutes < PICKUP_CLOSES_AT_MINUTES
  );
}
