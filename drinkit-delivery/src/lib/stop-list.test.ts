import { describe, expect, it } from "vitest";
import {
  canOrderProduct,
  filterAvailableProducts,
  isProductStopped,
} from "@/lib/stop-list";

describe("stop-list", () => {
  it("treats missing stopped as available", () => {
    expect(isProductStopped({})).toBe(false);
    expect(isProductStopped({ stopped: false })).toBe(false);
    expect(canOrderProduct({ stopped: false })).toBe(true);
  });

  it("flags stopped products", () => {
    expect(isProductStopped({ stopped: true })).toBe(true);
    expect(canOrderProduct({ stopped: true })).toBe(false);
    expect(canOrderProduct(undefined)).toBe(false);
  });

  it("filters stopped products from the shop catalog", () => {
    const products = [
      { id: "a", stopped: true },
      { id: "b" },
      { id: "c", stopped: false },
    ];
    expect(filterAvailableProducts(products).map((p) => p.id)).toEqual([
      "b",
      "c",
    ]);
  });
});
