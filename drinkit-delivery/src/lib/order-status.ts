import type { OrderStatus } from "@/types/user";

export const ORDER_STATUSES: OrderStatus[] = [
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];

export const PICKUP_STATUS_BUTTONS: Exclude<OrderStatus, "cancelled">[] = [
  "preparing",
  "on_the_way",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  preparing: "Заказ принят",
  on_the_way: "Готов к выдаче",
  delivered: "Выдан",
  cancelled: "Отменён",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  preparing: "bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30",
  on_the_way: "bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30",
  delivered: "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30",
  cancelled: "bg-white/10 text-white/55 ring-1 ring-white/15",
};

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}
