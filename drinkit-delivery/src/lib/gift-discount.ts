import type { ClaimedGift } from "@/lib/loyalty-gifts";
import { getDefaultOptions } from "@/lib/pricing";
import type { CartItem, Product } from "@/types/menu";

export interface GiftDiscountResult {
  discount: number;
  deliveryFee: number;
  label: string;
  orderNote: string;
  bonusProductId?: string;
  bonusProductName?: string;
}

export const GIFT_PRODUCT_MAP: Record<string, string> = {
  cookie: "cookie",
  croissant: "croissant",
  dessert: "cheesecake",
  "coffee-premium": "raf-vanilla",
};

const NOTE_ONLY_GIFTS = new Set(["syrup"]);

export function isItemGift(rewardId: string): boolean {
  return rewardId in GIFT_PRODUCT_MAP;
}

export function buildGiftBonusItem(
  gift: ClaimedGift,
  getProduct: (id: string) => Product | undefined,
): CartItem | null {
  const productId = GIFT_PRODUCT_MAP[gift.rewardId];
  if (!productId) return null;

  const product = getProduct(productId);
  if (!product) return null;

  return {
    id: `gift-item-${gift.id}`,
    productId,
    quantity: 1,
    options: getDefaultOptions(product),
    unitPrice: 0,
  };
}

export function calculateGiftDiscount(
  gift: ClaimedGift,
  subtotal: number,
  baseDeliveryFee: number,
  isFreeDelivery: boolean,
  getProduct?: (id: string) => Product | undefined,
): GiftDiscountResult {
  const safeSubtotal = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0;
  const safeBaseDeliveryFee = Number.isFinite(baseDeliveryFee)
    ? Math.max(0, baseDeliveryFee)
    : 0;
  const baseDelivery = isFreeDelivery ? 0 : safeBaseDeliveryFee;

  switch (gift.rewardId) {
    case "discount-10":
      return {
        discount: Math.round(safeSubtotal * 0.1),
        deliveryFee: baseDelivery,
        label: gift.title,
        orderNote: `Подарок: ${gift.title}`,
      };
    case "discount-15":
      return {
        discount: Math.round(safeSubtotal * 0.15),
        deliveryFee: baseDelivery,
        label: gift.title,
        orderNote: `Подарок: ${gift.title}`,
      };
    case "discount-20":
      return {
        discount: Math.round(safeSubtotal * 0.2),
        deliveryFee: baseDelivery,
        label: gift.title,
        orderNote: `Подарок: ${gift.title}`,
      };
    case "delivery-free":
      return {
        discount: 0,
        deliveryFee: 0,
        label: gift.title,
        orderNote: `Подарок: ${gift.title}`,
      };
    default: {
      if (isItemGift(gift.rewardId)) {
        const productId = GIFT_PRODUCT_MAP[gift.rewardId];
        const product = getProduct?.(productId);
        if (!product) {
          return {
            discount: 0,
            deliveryFee: baseDelivery,
            label: gift.title,
            orderNote: `Подарок: ${gift.title}`,
          };
        }

        return {
          discount: 0,
          deliveryFee: baseDelivery,
          label: gift.title,
          orderNote: `Подарок: ${gift.title} (${product.name})`,
          bonusProductId: productId,
          bonusProductName: product.name,
        };
      }

      if (NOTE_ONLY_GIFTS.has(gift.rewardId)) {
        return {
          discount: 0,
          deliveryFee: baseDelivery,
          label: gift.title,
          orderNote: `Подарок: ${gift.title}`,
        };
      }

      return {
        discount: 0,
        deliveryFee: baseDelivery,
        label: gift.title,
        orderNote: `Подарок: ${gift.title}`,
      };
    }
  }
}

export function calculateOrderTotal(
  subtotal: number,
  deliveryFee: number,
  discount: number,
): number {
  const safeSubtotal = Number.isFinite(subtotal) ? subtotal : 0;
  const safeDeliveryFee = Number.isFinite(deliveryFee) ? deliveryFee : 0;
  const safeDiscount = Number.isFinite(discount) ? discount : 0;
  return Math.max(0, safeSubtotal - safeDiscount + safeDeliveryFee);
}

export function getGiftEffectLabel(effect: GiftDiscountResult): string {
  if (effect.bonusProductName) {
    return `+ ${effect.bonusProductName} бесплатно`;
  }
  if (effect.discount > 0) {
    return `скидка`;
  }
  if (effect.deliveryFee === 0) {
    return "0 ₽ доставка";
  }
  return "Бонус";
}
