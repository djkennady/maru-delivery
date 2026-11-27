import { describe, expect, it } from "vitest";
import { isPickupOpen } from "@/lib/pickup-hours";

/** Moscow is UTC+3 without DST. */
function utc(iso: string): Date {
  return new Date(iso);
}

describe("isPickupOpen", () => {
  it("opens at 08:00 MSK and stays open through 18:29", () => {
    expect(isPickupOpen(utc("2026-10-06T04:59:00.000Z"))).toBe(false);
    expect(isPickupOpen(utc("2026-10-06T05:00:00.000Z"))).toBe(true);
    expect(isPickupOpen(utc("2026-10-06T12:00:00.000Z"))).toBe(true);
    expect(isPickupOpen(utc("2026-10-06T15:29:00.000Z"))).toBe(true);
  });

  it("closes at 18:30 MSK every day", () => {
    expect(isPickupOpen(utc("2026-10-06T15:30:00.000Z"))).toBe(false);
    expect(isPickupOpen(utc("2026-10-06T16:00:00.000Z"))).toBe(false);
    expect(isPickupOpen(utc("2026-10-06T20:00:00.000Z"))).toBe(false);
  });
});
