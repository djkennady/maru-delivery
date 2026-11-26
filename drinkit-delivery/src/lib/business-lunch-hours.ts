import type { Category, Product } from "@/types/menu";

export const BUSINESS_LUNCH_CATEGORY_ID = "business-lunch";
export const BUSINESS_LUNCH_OPENS_AT_MINUTES = 11 * 60 + 30;
export const BUSINESS_LUNCH_CLOSES_AT_MINUTES = 14 * 60;
export const BUSINESS_LUNCH_UNAVAILABLE_MESSAGE =
  "Бизнес-ланч доступен с 11:30 до 14:00 МСК";

function moscowMinutes(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",

    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return hour * 60 + minute;
}

/** Business lunch from 11:30 inclusive to 14:00 exclusive, Moscow time. */
export function isBusinessLunchMenuOpen(now: Date = new Date()): boolean {
  const minutes = moscowMinutes(now);
  return (
    minutes >= BUSINESS_LUNCH_OPENS_AT_MINUTES &&
    minutes < BUSINESS_LUNCH_CLOSES_AT_MINUTES
  );
}

export function isBusinessLunchCategory(categoryId: string | undefined): boolean {
  return categoryId === BUSINESS_LUNCH_CATEGORY_ID;
}

export function isBusinessLunchProduct(
  product: Pick<Product, "categoryId"> | undefined,
): boolean {
  return isBusinessLunchCategory(product?.categoryId);
}

export function canOrderBusinessLunchProduct(
  product: Pick<Product, "categoryId">,
  now: Date = new Date(),
): boolean {
  return !isBusinessLunchProduct(product) || isBusinessLunchMenuOpen(now);
}

export function filterBusinessLunchCategories<T extends Pick<Category, "id">>(
  categories: T[],
  now: Date = new Date(),
): T[] {
  if (isBusinessLunchMenuOpen(now)) return categories;
  return categories.filter((category) => !isBusinessLunchCategory(category.id));
}

export function filterBusinessLunchProducts<
  T extends Pick<Product, "categoryId">,
>(products: T[], now: Date = new Date()): T[] {
  if (isBusinessLunchMenuOpen(now)) return products;
  return products.filter((product) => !isBusinessLunchProduct(product));
}
