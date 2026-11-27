import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { uniqueSlug } from "@/lib/slug";
import {
  assertPersistentStorageAvailable,
  getSupabaseServerClient,
  isSupabaseEnabled,
} from "@/lib/supabase-server";
import { dataFile } from "@/lib/data-file";
import { catalogProductImageUrl } from "@/lib/media";
import type {
  Category,
  CategoryInput,
  MenuData,
  Product,
  ProductInput,
  ProductTag,
} from "@/types/menu";

function menuFile(): string {
  return dataFile("menu.json");
}
const APP_STATE_TABLE = "app_state";
const MENU_STATE_KEY = "menu";
export const CURRENT_MENU_VERSION = 14;

/** Retired SKUs — strip even if an older persisted menu still contains them. */
const REMOVED_PRODUCT_IDS = new Set([
  "nitro-black",
  "nitro-vanilla",
  "nitro-orange",
  "shot-pistachio",
  "shot-orange",
  "shot-salted-caramel",
  "shot-coconut",
  "coffee-tasting-set",
  "english-breakfast",
  "french-breakfast",
  "russian-breakfast",
  "build-your-breakfast",
  "blinchiki",
  "syrniki",
]);

async function ensureStore() {
  const dir = path.dirname(menuFile());
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(menuFile());
  } catch {
    await fs.writeFile(
      menuFile(),
      JSON.stringify(DEFAULT_MENU, null, 2),
      "utf-8",
    );
  }
}

async function readMenuFromSupabase(): Promise<MenuData | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(APP_STATE_TABLE)
    .select("value")
    .eq("key", MENU_STATE_KEY)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase menu read failed: ${error.message}`);
  }

  const value = (data as { value?: unknown } | null)?.value;
  if (!value || typeof value !== "object") {
    return null;
  }

  return normalizeMenu(value as Partial<MenuData>);
}

async function writeMenuToSupabase(menu: MenuData) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase client unavailable for menu write");
  }

  const { error } = await supabase.from(APP_STATE_TABLE).upsert(
    {
      key: MENU_STATE_KEY,
      value: menu,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    throw new Error(`Supabase menu write failed: ${error.message}`);
  }
}

function normalizeProduct(product: Partial<Product>): Product {
  const tags = Array.isArray(product.tags)
    ? product.tags.filter(
        (tag): tag is ProductTag => tag === "hit" || tag === "new",
      )
    : undefined;

  return {
    id: product.id ?? "",
    categoryId: product.categoryId ?? "coffee",
    name: product.name ?? "Без названия",
    description: product.description ?? "",
    emoji: product.emoji ?? "☕",
    basePrice: Number(product.basePrice) || 0,
    sizes: product.sizes,
    customizable: Boolean(product.customizable),
    tags: tags?.length ? tags : undefined,
    imageUrl: product.imageUrl,
    group: product.group?.trim() || undefined,
    rkeeperCode: product.rkeeperCode?.trim() || undefined,
    stopped: Boolean(product.stopped) || undefined,
  };
}

function normalizeCategory(category: Partial<Category>): Category {
  return {
    id: category.id ?? "",
    name: category.name ?? "Категория",
    imageUrl: category.imageUrl,
  };
}

function normalizeMenu(data: Partial<MenuData>): MenuData {
  const products = Array.isArray(data.products)
    ? data.products
        .map(normalizeProduct)
        .filter((product) => !REMOVED_PRODUCT_IDS.has(product.id))
    : DEFAULT_MENU.products;

  return {
    categories: Array.isArray(data.categories)
      ? data.categories.map(normalizeCategory)
      : DEFAULT_MENU.categories,
    products,
    settings: {
      deliveryFee:
        Number(data.settings?.deliveryFee) || DEFAULT_MENU.settings.deliveryFee,
      freeDeliveryFrom:
        Number(data.settings?.freeDeliveryFrom) ||
        DEFAULT_MENU.settings.freeDeliveryFrom,
      estimatedMinutes:
        data.settings?.estimatedMinutes ||
        DEFAULT_MENU.settings.estimatedMinutes,
    },
    menuVersion: Number(data.menuVersion) || 1,
  };
}

function applyCatalogPhotos(menu: MenuData): MenuData {
  return {
    ...menu,
    products: menu.products
      .filter((product) => !REMOVED_PRODUCT_IDS.has(product.id))
      .map((product) => {
        const imageUrl = catalogProductImageUrl(
          product.id,
          product.imageUrl,
          product.categoryId,
        );
        if (imageUrl === product.imageUrl) return product;
        return { ...product, imageUrl: imageUrl || undefined };
      }),
  };
}

function withCurrentMenuVersion(menu: MenuData): MenuData {
  return applyCatalogPhotos({
    ...menu,
    menuVersion: CURRENT_MENU_VERSION,
  });
}

/**
 * Keep admin edits, but restore any categories/products that vanished from the
 * stored catalog (e.g. business-lunch missing after a partial reseed).
 */
function reconcileMenuWithDefaults(menu: MenuData): MenuData {
  const categories = [...menu.categories];
  for (const category of DEFAULT_MENU.categories) {
    if (!categories.some((item) => item.id === category.id)) {
      categories.push(category);
    }
  }

  const products = menu.products.filter(
    (product) => !REMOVED_PRODUCT_IDS.has(product.id),
  );
  const ids = new Set(products.map((product) => product.id));
  for (const product of DEFAULT_MENU.products) {
    if (REMOVED_PRODUCT_IDS.has(product.id) || ids.has(product.id)) continue;
    products.push(product);
    ids.add(product.id);
  }

  return {
    ...menu,
    categories,
    products,
    menuVersion: CURRENT_MENU_VERSION,
  };
}

function needsMenuReseed(menu: MenuData): boolean {
  if (menu.products.length === 0) return true;
  if ((menu.menuVersion ?? 1) < CURRENT_MENU_VERSION) return true;
  if (menu.products.some((product) => REMOVED_PRODUCT_IDS.has(product.id))) {
    return true;
  }

  const hasGroupedProducts = menu.products.some((product) =>
    Boolean(product.group?.trim()),
  );
  return !hasGroupedProducts;
}

function needsMenuReconcile(menu: MenuData): boolean {
  const missingCategory = DEFAULT_MENU.categories.some(
    (category) => !menu.categories.some((item) => item.id === category.id),
  );
  if (missingCategory) return true;

  return DEFAULT_MENU.products.some(
    (product) =>
      !REMOVED_PRODUCT_IDS.has(product.id) &&
      !menu.products.some((item) => item.id === product.id),
  );
}

async function writeMenu(menu: MenuData) {
  const payload: MenuData = {
    ...menu,
    menuVersion: menu.menuVersion ?? CURRENT_MENU_VERSION,
  };

  if (isSupabaseEnabled()) {
    await writeMenuToSupabase(payload);
    return;
  }

  assertPersistentStorageAvailable();

  const dir = path.dirname(menuFile());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(menuFile(), JSON.stringify(payload, null, 2), "utf-8");
}

export async function resetMenuToDefaults(): Promise<MenuData> {
  const menu = withCurrentMenuVersion(DEFAULT_MENU);
  try {
    await writeMenu(menu);
  } catch (error) {
    console.error("resetMenuToDefaults write failed:", error);
  }
  return menu;
}

export async function getMenu(): Promise<MenuData> {
  if (isSupabaseEnabled()) {
    try {
      const supabaseMenu = await readMenuFromSupabase();
      if (!supabaseMenu || needsMenuReseed(supabaseMenu)) {
        return await resetMenuToDefaults();
      }

      if (needsMenuReconcile(supabaseMenu)) {
        const reconciled = reconcileMenuWithDefaults(supabaseMenu);
        try {
          await writeMenu(reconciled);
        } catch (error) {
          console.error("getMenu reconcile write failed:", error);
        }
        return applyCatalogPhotos(reconciled);
      }

      return applyCatalogPhotos(supabaseMenu);
    } catch (error) {
      console.error("getMenu supabase error:", error);
      return withCurrentMenuVersion(DEFAULT_MENU);
    }
  }

  await ensureStore();
  const raw = await fs.readFile(menuFile(), "utf-8");
  try {
    const parsed = normalizeMenu(JSON.parse(raw) as Partial<MenuData>);
    if (needsMenuReseed(parsed)) {
      return await resetMenuToDefaults();
    }
    if (needsMenuReconcile(parsed)) {
      const reconciled = reconcileMenuWithDefaults(parsed);
      try {
        await writeMenu(reconciled);
      } catch (error) {
        console.error("getMenu reconcile write failed:", error);
      }
      return applyCatalogPhotos(reconciled);
    }
    return applyCatalogPhotos(parsed);
  } catch {
    await writeMenu(DEFAULT_MENU);
    return applyCatalogPhotos(DEFAULT_MENU);
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const menu = await getMenu();
  const ids = new Set(menu.products.map((product) => product.id));
  const id = input.id?.trim()
    ? uniqueSlug(input.id, ids)
    : uniqueSlug(input.name, ids);

  const product = normalizeProduct({ ...input, id });
  menu.products.push(product);
  await writeMenu(menu);
  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<Product | null> {
  const menu = await getMenu();
  const index = menu.products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  const previous = menu.products[index];
  const nextInput: Partial<Product> = {
    ...previous,
    ...input,
    id,
  };

  if (Object.prototype.hasOwnProperty.call(input, "tags")) {
    nextInput.tags = Array.isArray(input.tags) ? input.tags : [];
  }

  menu.products[index] = normalizeProduct(nextInput);
  await writeMenu(menu);
  return menu.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const menu = await getMenu();
  const nextProducts = menu.products.filter((product) => product.id !== id);
  if (nextProducts.length === menu.products.length) return false;
  menu.products = nextProducts;
  await writeMenu(menu);
  return true;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const menu = await getMenu();
  const ids = new Set(menu.categories.map((category) => category.id));
  const id = input.id?.trim()
    ? uniqueSlug(input.id, ids)
    : uniqueSlug(input.name, ids);

  const category = normalizeCategory({ ...input, id });
  menu.categories.push(category);
  await writeMenu(menu);
  return category;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const menu = await getMenu();
  return menu.products.find((product) => product.id === id);
}
