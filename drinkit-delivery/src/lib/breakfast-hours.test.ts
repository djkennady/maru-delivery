import { describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import {
  BREAKFAST_CATEGORY_ID,
  filterShopCategories,
  filterShopProducts,
  isBreakfastMenuOpen,
} from "@/lib/breakfast-hours";

/** Moscow is UTC+3 without DST. */
function utc(iso: string) {
  return new Date(iso);
}

describe("isBreakfastMenuOpen", () => {
  it("opens at 08:00 MSK and stays open until 10:59", () => {
    expect(isBreakfastMenuOpen(utc("2026-10-06T04:59:00.000Z"))).toBe(false);
    expect(isBreakfastMenuOpen(utc("2026-10-06T05:00:00.000Z"))).toBe(true);
    expect(isBreakfastMenuOpen(utc("2026-10-06T07:59:00.000Z"))).toBe(true);
  });

  it("hides breakfast at 11:00 MSK", () => {
    expect(isBreakfastMenuOpen(utc("2026-10-06T08:00:00.000Z"))).toBe(false);
    expect(isBreakfastMenuOpen(utc("2026-10-06T20:00:00.000Z"))).toBe(false);
  });
});

describe("filterShopCatalog", () => {
  it("keeps breakfast while the window is open", () => {
    const now = utc("2026-10-06T06:00:00.000Z");
    expect(
      filterShopCategories(DEFAULT_MENU.categories, now).some(
        (category) => category.id === BREAKFAST_CATEGORY_ID,
      ),
    ).toBe(true);
    expect(
      filterShopProducts(DEFAULT_MENU.products, now).some(
        (product) => product.categoryId === BREAKFAST_CATEGORY_ID,
      ),
    ).toBe(true);
  });

  it("hides breakfast category and dishes after 11:00 MSK", () => {
    const now = utc("2026-10-06T08:00:00.000Z");
    expect(
      filterShopCategories(DEFAULT_MENU.categories, now).some(
        (category) => category.id === BREAKFAST_CATEGORY_ID,
      ),
    ).toBe(false);
    expect(
      filterShopProducts(DEFAULT_MENU.products, now).some(
        (product) => product.categoryId === BREAKFAST_CATEGORY_ID,
      ),
    ).toBe(false);
  });
});
