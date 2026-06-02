import { promises as fs } from "fs";
import path from "path";
import type { NewOrderInput, OrderRecord, OrderStatus } from "@/types/user";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

async function ensureStore() {
  const dir = path.dirname(ORDERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf-8");
  }
}

async function readOrders(): Promise<OrderRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(ORDERS_FILE, "utf-8");
  const parsed = JSON.parse(raw) as Partial<OrderRecord>[];
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizeOrder);
}

function normalizeOrder(order: Partial<OrderRecord>): OrderRecord {
  return {
    id: order.id ?? "",
    createdAt: order.createdAt ?? new Date().toISOString(),
    name: order.name ?? "",
    phone: order.phone ?? "",
    address: order.address ?? "",
    comment: order.comment,
    items: order.items ?? [],
    subtotal: order.subtotal ?? 0,
    deliveryFee: order.deliveryFee ?? 0,
    giftDiscount: order.giftDiscount,
    appliedGift: order.appliedGift,
    total: order.total ?? 0,
    status: order.status ?? "preparing",
    paymentStatus: order.paymentStatus ?? "paid",
    paymentMethod: order.paymentMethod ?? "card",
    cardLast4: order.cardLast4 ?? "0000",
    cardBrand: order.cardBrand ?? (order.paymentMethod === "sbp" ? "СБП" : "Card"),
    paymentId: order.paymentId ?? "legacy",
  };
}

async function writeOrders(orders: OrderRecord[]) {
  await ensureStore();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function createOrder(input: NewOrderInput): Promise<OrderRecord> {
  const orders = await readOrders();
  const record: OrderRecord = {
    ...input,
    id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "preparing",
  };
  orders.unshift(record);
  await writeOrders(orders);
  return record;
}

export async function getOrdersByPhone(phone: string): Promise<OrderRecord[]> {
  const normalized = normalizePhone(phone);
  if (!normalized) return [];
  const orders = await readOrders();
  return orders.filter(
    (order) => normalizePhone(order.phone) === normalized,
  );
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  return readOrders();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderRecord | null> {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status };
  await writeOrders(orders);
  return orders[index];
}
