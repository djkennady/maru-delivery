import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { HALL_SECTIONS } from "@/data/hall-menu";
import { DRINK_PHOTO_PAIRS, STOCK_DRINK_PHOTOS } from "@/lib/drink-photos";
import { getProductImage } from "@/lib/media";

describe("drink photo assignments", () => {
  it("maps each pair to one existing pickup product and hall item", () => {
    const products = new Map(DEFAULT_MENU.products.map((item) => [item.id, item]));
    const hallNames = new Set(
      HALL_SECTIONS.flatMap((section) => section.items.map((item) => item.name)),
    );

    const ids = DRINK_PHOTO_PAIRS.map((pair) => pair.productId);
    expect(new Set(ids).size).toBe(ids.length);

    for (const pair of DRINK_PHOTO_PAIRS) {
      const product = products.get(pair.productId);
      expect(product, pair.productId).toBeTruthy();
      expect(hallNames.has(pair.hallName), pair.hallName).toBe(true);
      expect(pair.primary).toMatch(/^\/hall-menu\/drinks\/\d{4}\.webp$/);
      expect(pair.alt).toMatch(/^\/hall-menu\/drinks\/\d{4}\.webp$/);
      expect(pair.primary).not.toBe(pair.alt);
    }
  });

  it("overrides pexels fallbacks for assigned drinks", () => {
    expect(getProductImage("iced-latte", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/drinks/0127.webp",
    );
    expect(getProductImage("americano", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/drinks/stock/americano.webp",
    );
  });

  it("maps stock photos to pickup products and local webp files", () => {
    const products = new Map(DEFAULT_MENU.products.map((item) => [item.id, item]));
    const hallNames = new Set(
      HALL_SECTIONS.flatMap((section) => section.items.map((item) => item.name)),
    );
    const publicRoot = resolve(process.cwd(), "public");

    const ids = STOCK_DRINK_PHOTOS.map((item) => item.productId);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of STOCK_DRINK_PHOTOS) {
      expect(products.get(item.productId), item.productId).toBeTruthy();
      expect(item.path).toMatch(/^\/hall-menu\/drinks\/stock\/[\w-]+\.webp$/);
      expect(existsSync(resolve(publicRoot, item.path.slice(1))), item.path).toBe(true);
      if (item.hallName) {
        expect(hallNames.has(item.hallName), item.hallName).toBe(true);
      }
    }
  });

  it("gives every hall drink a photo", () => {
    const missing = HALL_SECTIONS.filter((section) => section.kind === "drinks")
      .flatMap((section) =>
        section.items.filter((item) => !item.photo).map((item) => `${section.id}:${item.name}`),
      );
    expect(missing).toEqual([]);
  });
});
