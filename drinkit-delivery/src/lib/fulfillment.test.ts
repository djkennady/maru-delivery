import { describe, expect, it } from "vitest";
import {
  getPickupDiscount,
  getPickupDiscountPercent,
  getPickupDiscountRate,
  isPickupHappyHour,
  PICKUP_DISCOUNT_RATE,
  PICKUP_HAPPY_HOUR_RATE,
} from "@/lib/fulfillment";

/** Build a Date that is `hours:minutes` in Europe/Moscow. */
function atMoscow(hours: number, minutes: number): Date {
  const utcGuess = Date.UTC(2026, 5, 15, hours - 3, minutes, 0);
  return new Date(utcGuess);
}

describe("pickup discount happy hours", () => {
  it("is 10% outside 11:30–13:30 MSK", () => {
    expect(isPickupHappyHour(atMoscow(11, 29))).toBe(false);
    expect(isPickupHappyHour(atMoscow(13, 30))).toBe(false);
    expect(isPickupHappyHour(atMoscow(9, 0))).toBe(false);
    expect(getPickupDiscountRate(atMoscow(10, 0))).toBe(PICKUP_DISCOUNT_RATE);
    expect(getPickupDiscountPercent(atMoscow(18, 0))).toBe(10);
    expect(getPickupDiscount(1000, atMoscow(18, 0))).toBe(100);
  });

  it("is 20% from 11:30 inclusive to 13:30 exclusive MSK", () => {
    expect(isPickupHappyHour(atMoscow(11, 30))).toBe(true);
    expect(isPickupHappyHour(atMoscow(12, 0))).toBe(true);
    expect(isPickupHappyHour(atMoscow(13, 29))).toBe(true);
    expect(getPickupDiscountRate(atMoscow(12, 15))).toBe(PICKUP_HAPPY_HOUR_RATE);
    expect(getPickupDiscountPercent(atMoscow(12, 15))).toBe(20);
    expect(getPickupDiscount(1000, atMoscow(12, 15))).toBe(200);
  });
});
