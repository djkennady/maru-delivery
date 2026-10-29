import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import {
  FOOD_PHOTO_BY_PRODUCT_ID,
  STUDIO_FOOD_PHOTOS,
} from "@/lib/food-photos";
import { getProductImage } from "@/lib/media";

describe("food photo assignments", () => {
  it("maps each entry to an existing pickup product and local webp", () => {
    const products = new Map(DEFAULT_MENU.products.map((item) => [item.id, item]));
    const publicRoot = resolve(process.cwd(), "public");

    for (const [productId, path] of Object.entries(FOOD_PHOTO_BY_PRODUCT_ID)) {
      expect(products.get(productId), productId).toBeTruthy();
      expect(path).toMatch(/^\/hall-menu\/dishes\//);
      expect(existsSync(resolve(publicRoot, path.slice(1))), path).toBe(true);
    }
  });

  it("keeps dedicated studio frames on disk", () => {
    const products = new Map(DEFAULT_MENU.products.map((item) => [item.id, item]));
    const publicRoot = resolve(process.cwd(), "public");

    for (const item of STUDIO_FOOD_PHOTOS) {
      expect(products.get(item.productId), item.productId).toBeTruthy();
      expect(item.path).toMatch(/^\/hall-menu\/dishes\/studio\/[\w-]+\.webp$/);
      expect(existsSync(resolve(publicRoot, item.path.slice(1))), item.path).toBe(
        true,
      );
    }
  });

  it("does not invent sibling photos for unfinished SKUs", () => {
    expect(getProductImage("shashlik-chicken-fillet", "https://images.pexels.com/x.jpg")).toBe(
      "",
    );
    expect(getProductImage("pasta-seafood", "https://images.pexels.com/x.jpg")).toBe("");
    expect(getProductImage("steak-butcher")).toBe("");
    expect(getProductImage("steak-butcher", "https://images.pexels.com/x.jpg")).toBe("");
    expect(getProductImage("croissant-chocolate")).toBe("");
    expect(getProductImage("build-your-breakfast")).toBe("");
  });

  it("keeps dedicated studio/hall frames", () => {
    expect(getProductImage("pizza-pepperoni", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/dishes/studio/pizza-pepperoni.webp",
    );
    expect(getProductImage("fries")).toBe("/hall-menu/dishes/studio/fries.webp");
    expect(getProductImage("english-breakfast")).toBe("/hall-menu/dishes/0005.webp");
    expect(getProductImage("shashlik-beef")).toBe("/hall-menu/dishes/0110.webp");
  });
});
