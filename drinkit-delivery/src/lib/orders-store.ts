import { promises as fs } from "fs";
import path from "path";
import {
  assertPersistentStorageAvailable,
  getSupabaseServerClient,
  isSupabaseEnabled,
} from "@/lib/supabase-server";
import type { NewOrderInput, OrderRecord, OrderStatus } from "@/types/user";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
const ORDERS_TABLE = "orders";

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
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Supabase orders read failed: ${error.message}`);
    }

    return (data ?? []).map((row) =>
      normalizeOrder({
        id: row.id,
        createdAt: row.created_at,
        name: row.name,
        phone: row.phone,
        address: row.address,
        comment: row.comment ?? undefined,
        items: row.items,
        subtotal: row.subtotal,
        deliveryFee: row.delivery_fee,
        giftDiscount: row.gift_discount ?? undefined,
        appliedGift: row.applied_gift ?? undefined,
        total: row.total,
        status: row.status,
        paymentStatus: row.payment_status,
        paymentMethod: row.payment_method,
        cardLast4: row.card_last4,
        cardBrand: row.card_brand,
        paymentId: row.payment_id,
      }),
    );
  }

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
  if (isSupabaseEnabled()) return;
  await ensureStore();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function createOrder(input: NewOrderInput): Promise<OrderRecord> {
  assertPersistentStorageAvailable();

  const record: OrderRecord = {
    ...input,
    id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "preparing",
  };

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return record;

    const { error } = await supabase.from(ORDERS_TABLE).insert({
      id: record.id,
      created_at: record.createdAt,
      name: record.name,
      phone: record.phone,
      address: record.address,
      comment: record.comment ?? null,
      items: record.items,
      subtotal: Math.round(record.subtotal),
      delivery_fee: Math.round(record.deliveryFee),
      gift_discount:
        record.giftDiscount == null ? null : Math.round(record.giftDiscount),
      applied_gift: record.appliedGift ?? null,
      total: Math.round(record.total),
      status: record.status,
      payment_status: record.paymentStatus,
      payment_method: record.paymentMethod,
      card_last4: record.cardLast4,
      card_brand: record.cardBrand,
      payment_id: record.paymentId,
    });

    if (error) {
      throw new Error(`Supabase order create failed: ${error.message}`);
    }
    return record;
  }

  const orders = await readOrders();
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
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase order update failed: ${error.message}`);
    }
    if (!data) return null;

    return normalizeOrder({
      id: data.id,
      createdAt: data.created_at,
      name: data.name,
      phone: data.phone,
      address: data.address,
      comment: data.comment ?? undefined,
      items: data.items,
      subtotal: data.subtotal,
      deliveryFee: data.delivery_fee,
      giftDiscount: data.gift_discount ?? undefined,
      appliedGift: data.applied_gift ?? undefined,
      total: data.total,
      status: data.status,
      paymentStatus: data.payment_status,
      paymentMethod: data.payment_method,
      cardLast4: data.card_last4,
      cardBrand: data.card_brand,
      paymentId: data.payment_id,
    });
  }

  const orders = await readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status };
  await writeOrders(orders);
  return orders[index];
}
