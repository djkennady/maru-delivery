import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { FOOD_PHOTO_BY_PRODUCT_ID } from "@/lib/food-photos";
import { getProductImage } from "@/lib/media";

describe("food photo assignments", () => {
  it("maps each entry to an existing pickup product and local webp", () => {
    const products = new Map(DEFAULT_MENU.products.map((item) => [item.id, item]));
    const publicRoot = resolve(process.cwd(), "public");

    for (const [productId, path] of Object.entries(FOOD_PHOTO_BY_PRODUCT_ID)) {
      expect(products.get(productId), productId).toBeTruthy();
      expect(path).toMatch(/^\/hall-menu\/dishes\/\d{4}\.webp$/);
      expect(existsSync(resolve(publicRoot, path.slice(1))), path).toBe(true);
    }
  });

  it("overrides pexels fallbacks for assigned food", () => {
    expect(getProductImage("english-breakfast", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/dishes/0005.webp",
    );
    expect(getProductImage("salad-caesar-chicken", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/dishes/0036.webp",
    );
    expect(getProductImage("honey-cake", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/dishes/0086.webp",
    );
    expect(getProductImage("burger-beef", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/dishes/0067.webp",
    );
  });
});
