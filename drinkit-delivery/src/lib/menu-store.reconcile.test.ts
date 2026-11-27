import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";

describe("menu reconcile", () => {
  let dataDir = "";

  beforeEach(async () => {
    dataDir = await mkdtemp(path.join(tmpdir(), "maru-menu-"));
    process.env.MARU_DATA_DIR = dataDir;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NETLIFY;
    delete process.env.VERCEL;
  });

  afterEach(async () => {
    delete process.env.MARU_DATA_DIR;
    await rm(dataDir, { recursive: true, force: true });
  });

  it("restores missing default products without wiping admin edits", async () => {
    const incomplete = {
      ...DEFAULT_MENU,
      menuVersion: 14,
      products: DEFAULT_MENU.products
        .filter((product) => product.categoryId !== "business-lunch")
        .map((product) =>
          product.id === "americano"
            ? { ...product, basePrice: 999, name: "Американо admin" }
            : product,
        ),
    };

    await writeFile(
      path.join(dataDir, "menu.json"),
      JSON.stringify(incomplete),
      "utf-8",
    );

    const { getMenu } = await import("@/lib/menu-store");
    const menu = await getMenu();

    expect(
      menu.products.some((product) => product.id === "business-combo-1"),
    ).toBe(true);
    const americano = menu.products.find((product) => product.id === "americano");
    expect(americano?.basePrice).toBe(999);
    expect(americano?.name).toBe("Американо admin");

    const saved = JSON.parse(
      await readFile(path.join(dataDir, "menu.json"), "utf-8"),
    ) as { products: Array<{ id: string }> };
    expect(saved.products.some((product) => product.id === "business-combo-1")).toBe(
      true,
    );
  });
});
