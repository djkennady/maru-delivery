import type {
  CartItem,
  CartItemOptions,
  DeliveryProduct,
  MilkOption,
  ProductSize,
} from "@/types/delivery";

const MILK_SURCHARGE: Partial<Record<MilkOption, number>> = {
  oat: 40,
  almond: 40,
};

export function getDefaultSize(product: DeliveryProduct): ProductSize {
  if (product.sizes?.m) return "m";
  if (product.sizes?.s) return "s";
  return "l";
}

export function getProductPrice(
  product: DeliveryProduct,
  options: CartItemOptions,
): number {
  const sizePrice =
    product.sizes?.[options.size] ?? product.basePrice;
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
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getDefaultOptions(product: DeliveryProduct): CartItemOptions {
  return {
    size: getDefaultSize(product),
    milk: "regular",
  };
}
