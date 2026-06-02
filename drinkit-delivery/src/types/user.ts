import type { CartItem } from "@/types/menu";

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
}

export type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "card" | "sbp";

export type PaymentStatus = "paid" | "failed";

export interface AppliedGift {
  id: string;
  title: string;
  emoji: string;
  discount: number;
  bonusProductId?: string;
  bonusProductName?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  giftDiscount?: number;
  appliedGift?: AppliedGift;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  cardLast4: string;
  cardBrand: string;
  paymentId: string;
}

export interface NewOrderInput {
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  giftDiscount?: number;
  appliedGift?: AppliedGift;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  cardLast4: string;
  cardBrand: string;
  paymentId: string;
}
