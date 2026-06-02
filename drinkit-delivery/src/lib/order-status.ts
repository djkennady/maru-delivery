import type { OrderStatus } from "@/types/user";

export const ORDER_STATUSES: OrderStatus[] = [
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  preparing: "Готовится",
  on_the_way: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  preparing: "bg-amber-100 text-amber-700",
  on_the_way: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-neutral-100 text-neutral-600",
};

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}
