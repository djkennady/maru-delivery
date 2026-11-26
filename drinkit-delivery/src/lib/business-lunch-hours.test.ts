import { describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import {
  BUSINESS_LUNCH_CATEGORY_ID,
  filterBusinessLunchCategories,
  filterBusinessLunchProducts,
  isBusinessLunchMenuOpen,
} from "@/lib/business-lunch-hours";
import { filterShopCategories, filterShopProducts } from "@/lib/breakfast-hours";

function utc(iso: string): Date {
  return new Date(iso);
}

describe("isBusinessLunchMenuOpen", () => {
  it("opens at 11:30 MSK and stays open until 13:59", () => {
    expect(isBusinessLunchMenuOpen(utc("2026-10-06T08:29:00.000Z"))).toBe(false);
    expect(isBusinessLunchMenuOpen(utc("2026-10-06T08:30:00.000Z"))).toBe(true);
    expect(isBusinessLunchMenuOpen(utc("2026-10-06T10:59:00.000Z"))).toBe(true);
  });

  it("hides business lunch at 14:00 MSK", () => {
    expect(isBusinessLunchMenuOpen(utc("2026-10-06T11:00:00.000Z"))).toBe(false);
    expect(isBusinessLunchMenuOpen(utc("2026-10-06T05:00:00.000Z"))).toBe(false);
  });
});

describe("filterShop timed windows", () => {
  it("shows breakfast and hides business lunch at 09:00 MSK", () => {
    const now = utc("2026-10-06T06:00:00.000Z");
    expect(
      filterShopCategories(DEFAULT_MENU.categories, now).some(
        (category) => category.id === "breakfast",
      ),
    ).toBe(true);
    expect(
      filterShopCategories(DEFAULT_MENU.categories, now).some(
        (category) => category.id === BUSINESS_LUNCH_CATEGORY_ID,
      ),
    ).toBe(false);
    expect(
      filterShopProducts(DEFAULT_MENU.products, now).some(
        (product) => product.id === "fried-eggs-beefsteak",
      ),
    ).toBe(true);
    expect(
      filterShopProducts(DEFAULT_MENU.products, now).some(
        (product) => product.id === "business-combo-1",
      ),
    ).toBe(false);
  });

  it("shows business lunch and hides breakfast at 12:00 MSK", () => {
    const now = utc("2026-10-06T09:00:00.000Z");
    expect(
      filterBusinessLunchCategories(DEFAULT_MENU.categories, now).some(
        (category) => category.id === BUSINESS_LUNCH_CATEGORY_ID,
      ),
    ).toBe(true);
    expect(
      filterShopCategories(DEFAULT_MENU.categories, now).some(
        (category) => category.id === "breakfast",
      ),
    ).toBe(false);
    expect(
      filterBusinessLunchProducts(DEFAULT_MENU.products, now).some(
        (product) => product.id === "business-combo-1",
      ),
    ).toBe(true);
  });
});
