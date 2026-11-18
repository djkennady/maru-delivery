import type { Product } from "@/types/menu";

export const STOPPED_UNAVAILABLE_MESSAGE =
  "Позиция временно недоступна (стоп-лист)";

export function isProductStopped(
  product: Pick<Product, "stopped"> | undefined | null,
): boolean {
  return Boolean(product?.stopped);
}

export function canOrderProduct(
  product: Pick<Product, "stopped"> | undefined | null,
): boolean {
  return Boolean(product) && !isProductStopped(product);
}

export function filterAvailableProducts<T extends Pick<Product, "stopped">>(
  products: T[],
): T[] {
  return products.filter((product) => !isProductStopped(product));
}
