import type { Category, Product } from "@/types/menu";

export const BREAKFAST_CATEGORY_ID = "breakfast";
export const MOSCOW_TIME_ZONE = "Europe/Moscow";
export const BREAKFAST_OPENS_AT_MINUTES = 8 * 60;
export const BREAKFAST_CLOSES_AT_MINUTES = 11 * 60;
export const BREAKFAST_UNAVAILABLE_MESSAGE =
  "Завтраки доступны с 8:00 до 11:00 МСК";

export function getMoscowMinutes(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MOSCOW_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return 0;
  }
  return hour * 60 + minute;
}

/** Breakfast is available from 08:00 inclusive to 11:00 exclusive, Moscow time. */
export function isBreakfastMenuOpen(now: Date = new Date()): boolean {
  const minutes = getMoscowMinutes(now);
  return (
    minutes >= BREAKFAST_OPENS_AT_MINUTES &&
    minutes < BREAKFAST_CLOSES_AT_MINUTES
  );
}

export function isBreakfastCategory(categoryId: string | undefined): boolean {
  return categoryId === BREAKFAST_CATEGORY_ID;
}

export function isBreakfastProduct(
  product: Pick<Product, "categoryId"> | undefined,
): boolean {
  return isBreakfastCategory(product?.categoryId);
}

export function canOrderBreakfastProduct(
  product: Pick<Product, "categoryId">,
  now: Date = new Date(),
): boolean {
  return !isBreakfastProduct(product) || isBreakfastMenuOpen(now);
}

export function filterShopCategories<T extends Pick<Category, "id">>(
  categories: T[],
  now: Date = new Date(),
): T[] {
  if (isBreakfastMenuOpen(now)) return categories;
  return categories.filter((category) => !isBreakfastCategory(category.id));
}

export function filterShopProducts<T extends Pick<Product, "categoryId">>(
  products: T[],
  now: Date = new Date(),
): T[] {
  if (isBreakfastMenuOpen(now)) return products;
  return products.filter((product) => !isBreakfastProduct(product));
}
