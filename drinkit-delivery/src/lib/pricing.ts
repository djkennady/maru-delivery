import type {
  CartItem,
  CartItemOptions,
  MilkOption,
  Product,
  ProductSize,
} from "@/types/menu";

const MILK_SURCHARGE: Partial<Record<MilkOption, number>> = {
  oat: 40,
  almond: 40,
};

export function formatPrice(price: number): string {
  const value = Number.isFinite(price) ? price : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getDefaultSize(product: Product): ProductSize {
  if (product.sizes?.m) return "m";
  if (product.sizes?.s) return "s";
  return "l";
}

export function getProductPrice(
  product: Product,
  options: CartItemOptions,
): number {
  const sizePrice = product.sizes?.[options.size] ?? product.basePrice;
  const milkExtra = MILK_SURCHARGE[options.milk] ?? 0;
  return sizePrice + milkExtra;
}

export function getCartItemKey(
  productId: string,
  options: CartItemOptions,
): string {
  return `${productId}:${options.size}:${options.milk}`;
}

export function createCartItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
    const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
    return sum + unitPrice * quantity;
  }, 0);
}

export function normalizeCartItem(item: Partial<CartItem>): CartItem | null {
  if (!item.productId || !item.id) return null;

  const options =
    item.options?.size && item.options?.milk
      ? item.options
      : { size: "m" as const, milk: "regular" as const };

  return {
    id: item.id,
    productId: item.productId,
    quantity: Math.max(1, item.quantity ?? 1),
    options,
    unitPrice:
      typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice)
        ? item.unitPrice
        : 0,
  };
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getDefaultOptions(product: Product): CartItemOptions {
  return {
    size: getDefaultSize(product),
    milk: "regular",
  };
}
