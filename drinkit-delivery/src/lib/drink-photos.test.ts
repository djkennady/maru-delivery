import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { HALL_SECTIONS } from "@/data/hall-menu";
import {
  DRINK_PHOTO_BY_PRODUCT_ID,
  DRINK_PHOTO_PAIRS,
  STUDIO_DRINK_PHOTOS,
} from "@/lib/drink-photos";
import { getProductImage } from "@/lib/media";

describe("drink photo assignments", () => {
  it("maps each pair to one existing pickup product and hall item", () => {
    const products = new Map(DEFAULT_MENU.products.map((item) => [item.id, item]));
    const hallNames = new Set(
      HALL_SECTIONS.flatMap((section) => section.items.map((item) => item.name)),
    );

    const ids = DRINK_PHOTO_PAIRS.map((pair) => pair.productId);
    expect(new Set(ids).size).toBe(ids.length);

    const primaries = DRINK_PHOTO_PAIRS.map((pair) => pair.primary);
    expect(new Set(primaries).size).toBe(primaries.length);

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
    expect(getProductImage("raf-vanilla", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/drinks/0128.webp",
    );
    expect(getProductImage("smoothie-tropical", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/drinks/0160.webp",
    );
    expect(getProductImage("filter-coffee", "https://images.pexels.com/x.jpg")).toBe(
      "/hall-menu/drinks/filter-coffee.webp",
    );
  });

  it("does not invent stock or sibling photos for unfinished SKUs", () => {
    expect(getProductImage("americano")).toBe("/hall-menu/drinks/americano.webp");
    expect(getProductImage("espresso")).toBe("/hall-menu/drinks/espresso.webp");
    expect(getProductImage("cappuccino")).toBe("/hall-menu/drinks/cappuccino.webp");
    expect(getProductImage("latte")).toBe("/hall-menu/drinks/latte.webp");
    expect(getProductImage("flat-white")).toBe("/hall-menu/drinks/flat-white.webp");
    expect(getProductImage("salted-caramel-latte")).toBe("");
    expect(getProductImage("iced-pistachio-latte")).toBe("");
    expect(getProductImage("hot-chocolate")).toBe("");
    expect(getProductImage("cocoa-salted-caramel")).toBe("");
    expect(getProductImage("cold-brew-tonic")).toBe("");
    expect(getProductImage("cold-brew-classic")).toBe("");
    expect(getProductImage("tea-apple-cinnamon")).toBe("");
    expect(getProductImage("tea-peach-jasmine")).toBe("");
    expect(getProductImage("tea-assam")).toBe("");
    expect(getProductImage("fresh-orange")).toBe("");
  });

  it("maps studio singles to pickup products and local webp files", () => {
    const products = new Map(DEFAULT_MENU.products.map((item) => [item.id, item]));
    const hallNames = new Set(
      HALL_SECTIONS.flatMap((section) => section.items.map((item) => item.name)),
    );
    const publicRoot = resolve(process.cwd(), "public");

    for (const item of STUDIO_DRINK_PHOTOS) {
      expect(products.get(item.productId), item.productId).toBeTruthy();
      expect(hallNames.has(item.hallName), item.hallName).toBe(true);
      expect(item.path).toMatch(/^\/hall-menu\/drinks\/[\w-]+\.webp$/);
      expect(existsSync(resolve(publicRoot, item.path.slice(1))), item.path).toBe(true);
    }
  });

  it("keeps dedicated catalog frames on disk", () => {
    const publicRoot = resolve(process.cwd(), "public");
    for (const [productId, path] of Object.entries(DRINK_PHOTO_BY_PRODUCT_ID)) {
      expect(path.startsWith("/hall-menu/drinks/"), productId).toBe(true);
      expect(path.includes("/stock/"), productId).toBe(false);
      expect(existsSync(resolve(publicRoot, path.slice(1))), path).toBe(true);
    }
  });

  it("leaves unfinished hall drinks without photos", () => {
    const emptyExpected = new Set([
      "Латте солёная карамель",
      "Клубничная матча",
      "Колд брю классический",
      "Колд брю тоник",
      "Айс фисташковый латте",
      "Ассам",
      "Сенча",
      "Молочный",
      "Эрл Грей",
      "Жасмин",
      "Татарский",
      "Ройбуш",
      "Алтайский",
      "Яблоко · Корица · Ваниль",
      "Апельсиновый фреш",
      "Грейпфрутовый фреш",
      "Апельсин · Морковь",
      "Какао солёная карамель",
      "Горячий шоколад",
      "Вода с газом / без газа",
      "Cola Zero",
      "Тоник",
    ]);

    const missing = HALL_SECTIONS.filter((section) => section.kind === "drinks")
      .flatMap((section) =>
        section.items
          .filter((item) => !item.photo)
          .map((item) => item.name),
      );

    for (const name of emptyExpected) {
      expect(missing, name).toContain(name);
    }

    // Author-tea «Персик · Жасмин» has no dedicated tea frame (summer drink keeps 0166).
    const authorPeach = HALL_SECTIONS.find((section) => section.id === "author-tea")
      ?.items.find((item) => item.name === "Персик · Жасмин");
    expect(authorPeach?.photo).toBeUndefined();

    const summerPeach = HALL_SECTIONS.find((section) => section.id === "summer")
      ?.items.find((item) => item.name === "Персик · Жасмин");
    expect(summerPeach?.photo).toBe("/hall-menu/drinks/0166.webp");
  });
});
