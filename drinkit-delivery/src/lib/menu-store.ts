import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { uniqueSlug } from "@/lib/slug";
import type {
  Category,
  CategoryInput,
  MenuData,
  Product,
  ProductInput,
  ProductTag,
} from "@/types/menu";

const MENU_FILE = path.join(process.cwd(), "data", "menu.json");

async function ensureStore() {
  const dir = path.dirname(MENU_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(MENU_FILE);
  } catch {
    await fs.writeFile(
      MENU_FILE,
      JSON.stringify(DEFAULT_MENU, null, 2),
      "utf-8",
    );
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
  return {
    categories: Array.isArray(data.categories)
      ? data.categories.map(normalizeCategory)
      : DEFAULT_MENU.categories,
    products: Array.isArray(data.products)
      ? data.products.map(normalizeProduct)
      : DEFAULT_MENU.products,
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
  };
}

async function writeMenu(menu: MenuData) {
  const dir = path.dirname(MENU_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(MENU_FILE, JSON.stringify(menu, null, 2), "utf-8");
}

export async function getMenu(): Promise<MenuData> {
  await ensureStore();
  const raw = await fs.readFile(MENU_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Partial<MenuData>;
    return normalizeMenu(parsed);
  } catch {
    await writeMenu(DEFAULT_MENU);
    return DEFAULT_MENU;
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

  menu.products[index] = normalizeProduct({
    ...menu.products[index],
    ...input,
    id,
  });
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
