import type { LocalizedString } from "@/types/venue";

export type DeliveryCategoryId =
  | "new"
  | "coffee"
  | "tea"
  | "cold"
  | "food"
  | "desserts";

export type ProductTag = "hit" | "new";

export type ProductSize = "s" | "m" | "l";

export type MilkOption = "regular" | "oat" | "almond" | "none";

export interface DeliveryCategory {
  id: DeliveryCategoryId;
  name: LocalizedString;
}

export interface DeliveryProduct {
  id: string;
  categoryId: DeliveryCategoryId;
  name: LocalizedString;
  description: LocalizedString;
  emoji: string;
  basePrice: number;
  sizes?: Partial<Record<ProductSize, number>>;
  customizable?: boolean;
  tags?: ProductTag[];
}

export interface CartItemOptions {
  size: ProductSize;
  milk: MilkOption;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  options: CartItemOptions;
  unitPrice: number;
}

export interface DeliveryOrder {
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: CartItem[];
  total: number;
}
