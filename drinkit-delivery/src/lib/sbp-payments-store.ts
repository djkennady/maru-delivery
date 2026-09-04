import { promises as fs } from "fs";
import path from "path";
import {
  captureAlfaHold,
  cardPaymentReturnUrl,
  createAlfaSbpQr,
  decodeSbpQrStorage,
  encodeCardPaymentStorage,
  encodeSbpQrStorage,
  getAlfaOrderStatus,
  isAlfaPaymentRejected,
  isAlfaPaymentSuccessful,
  isAlfaSbpConfigured,
  registerAlfaOrder,
} from "@/lib/alfa-sbp";
import {
  assertPersistentStorageAvailable,
  getSupabaseServerClient,
  isCloudRuntime,
  isSupabaseEnabled,
} from "@/lib/supabase-server";

export type SbpPaymentStatus = "pending" | "paid" | "expired";

export interface SbpPaymentSession {
  id: string;
  amount: number;
  phone: string;
  status: SbpPaymentStatus;
  qrPayload: string;
  createdAt: string;
  expiresAt: string;
  paidAt?: string;
}

const SBP_FILE = path.join(process.cwd(), "data", "sbp-payments.json");
const SBP_TABLE = "sbp_payment_sessions";

async function ensureStore() {
  const dir = path.dirname(SBP_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(SBP_FILE);
  } catch {
    await fs.writeFile(SBP_FILE, "[]", "utf-8");
  }
}

async function readSessions(): Promise<SbpPaymentSession[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from(SBP_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Supabase SBP read failed: ${error.message}`);
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      amount: row.amount,
      phone: row.phone,
      status: row.status,
      qrPayload: row.qr_payload,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      paidAt: row.paid_at ?? undefined,
    }));
  }

  await ensureStore();
  const raw = await fs.readFile(SBP_FILE, "utf-8");
  const parsed = JSON.parse(raw) as SbpPaymentSession[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeSessions(sessions: SbpPaymentSession[]) {
  if (isSupabaseEnabled()) return;
  await ensureStore();
  await fs.writeFile(SBP_FILE, JSON.stringify(sessions, null, 2), "utf-8");
}

function createSessionId(prefix: "sbp" | "card"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildQrPayload(id: string, amount: number): string {
  const sumKopecks = Math.round(amount * 100);
  return [
    "ST00012",
    "Name=МАРУ",
    "PersonalAcc=40817810000000000000",
    `Sum=${sumKopecks}`,
    `Purpose=Заказ MARU ${id}`,
  ].join("|");
}

export async function createSbpSession(
  amount: number,
  phone: string,
): Promise<SbpPaymentSession> {
  assertPersistentStorageAvailable();

  if (amount <= 0) {
    throw new Error("Invalid amount");
  }

  const now = Date.now();
  const id = createSessionId("sbp");
  let qrPayload = buildQrPayload(id, amount);

  if (isAlfaSbpConfigured()) {
    const alfa = await createAlfaSbpQr({
      orderNumber: id,
      amountRub: amount,
      description: `Заказ MARU ${id}`,
    });
    qrPayload = encodeSbpQrStorage(alfa.mdOrder, alfa.payload);
  } else if (isCloudRuntime()) {
    throw new Error(
      "СБП Альфа-Банка не настроен. Добавьте ALFA_SBP_USERNAME и ALFA_SBP_PASSWORD в Netlify и сделайте redeploy.",
    );
  }

  const session: SbpPaymentSession = {
    id,
    amount,
    phone,
    status: "pending",
    qrPayload,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 15 * 60 * 1000).toISOString(),
  };

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return session;

    const { error } = await supabase.from(SBP_TABLE).insert({
      id: session.id,
      amount: session.amount,
      phone: session.phone,
      status: session.status,
      qr_payload: session.qrPayload,
      created_at: session.createdAt,
      expires_at: session.expiresAt,
      paid_at: null,
    });

    if (error) {
      throw new Error(`Supabase SBP create failed: ${error.message}`);
    }

    return session;
  }

  const sessions = await readSessions();
  sessions.unshift(session);
  await writeSessions(sessions.slice(0, 100));
  return session;
}

async function persistSession(session: SbpPaymentSession): Promise<SbpPaymentSession> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return session;

    const { error } = await supabase.from(SBP_TABLE).insert({
      id: session.id,
      amount: session.amount,
      phone: session.phone,
      status: session.status,
      qr_payload: session.qrPayload,
      created_at: session.createdAt,
      expires_at: session.expiresAt,
      paid_at: null,
    });

    if (error) {
      throw new Error(`Supabase SBP create failed: ${error.message}`);
    }

    return session;
  }

  const sessions = await readSessions();
  sessions.unshift(session);
  await writeSessions(sessions.slice(0, 100));
  return session;
}

export async function createCardSession(
  amount: number,
  phone: string,
  pageView: "DESKTOP" | "MOBILE" = "DESKTOP",
): Promise<{ session: SbpPaymentSession; paymentUrl: string }> {
  assertPersistentStorageAvailable();

  if (amount <= 0) {
    throw new Error("Invalid amount");
  }
  if (!isAlfaSbpConfigured()) {
    throw new Error(
      "Оплата картой не настроена. Добавьте ALFA_SBP_USERNAME и ALFA_SBP_PASSWORD в Netlify и сделайте redeploy.",
    );
  }

  const now = Date.now();
  const id = createSessionId("card");
  const alfa = await registerAlfaOrder({
    orderNumber: id,
    amountRub: amount,
    description: `Заказ MARU ${id}`,
    returnUrl: cardPaymentReturnUrl(id),
    failUrl: cardPaymentReturnUrl(id, true),
    pageView,
  });

  const session: SbpPaymentSession = {
    id,
    amount,
    phone,
    status: "pending",
    qrPayload: encodeCardPaymentStorage(alfa.mdOrder, alfa.formUrl),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 15 * 60 * 1000).toISOString(),
  };

  await persistSession(session);
  return { session, paymentUrl: alfa.formUrl };
}

export async function getSbpSession(id: string): Promise<SbpPaymentSession | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from(SBP_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase SBP fetch failed: ${error.message}`);
    }
    if (!data) return null;

    const session: SbpPaymentSession = {
      id: data.id,
      amount: data.amount,
      phone: data.phone,
      status: data.status,
      qrPayload: data.qr_payload,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      paidAt: data.paid_at ?? undefined,
    };

    if (
      session.status === "pending" &&
      new Date(session.expiresAt).getTime() < Date.now()
    ) {
      const { error: updateError } = await supabase
        .from(SBP_TABLE)
        .update({ status: "expired" })
        .eq("id", id);

      if (updateError) {
        throw new Error(`Supabase SBP expire update failed: ${updateError.message}`);
      }
      session.status = "expired";
    }

    return session;
  }

  const sessions = await readSessions();
  const session = sessions.find((item) => item.id === id);
  if (!session) return null;

  if (
    session.status === "pending" &&
    new Date(session.expiresAt).getTime() < Date.now()
  ) {
    session.status = "expired";
    await writeSessions(
      sessions.map((item) => (item.id === id ? session : item)),
    );
  }

  return session;
}

async function markSbpSessionPaid(id: string): Promise<SbpPaymentSession | null> {
  const paidAt = new Date().toISOString();

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from(SBP_TABLE)
      .update({ status: "paid", paid_at: paidAt })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase SBP confirm failed: ${error.message}`);
    }
    if (!data) return null;

    return {
      id: data.id,
      amount: data.amount,
      phone: data.phone,
      status: data.status,
      qrPayload: data.qr_payload,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      paidAt: data.paid_at ?? undefined,
    };
  }

  const sessions = await readSessions();
  const index = sessions.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const paidSession: SbpPaymentSession = {
    ...sessions[index],
    status: "paid",
    paidAt,
  };
  sessions[index] = paidSession;
  await writeSessions(sessions);
  return paidSession;
}

async function markSbpSessionExpired(id: string): Promise<SbpPaymentSession | null> {
  const current = await getSbpSession(id);
  if (!current) return null;
  if (current.status !== "pending") return current;

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseServerClient();
    if (!supabase) return current;

    const { error } = await supabase
      .from(SBP_TABLE)
      .update({ status: "expired" })
      .eq("id", id);

    if (error) {
      throw new Error(`Supabase SBP expire update failed: ${error.message}`);
    }
    return { ...current, status: "expired" };
  }

  const sessions = await readSessions();
  const next = sessions.map((item) =>
    item.id === id ? { ...item, status: "expired" as const } : item,
  );
  await writeSessions(next);
  return { ...current, status: "expired" };
}

export async function syncSbpSessionWithBank(
  id: string,
): Promise<SbpPaymentSession | null> {
  const session = await getSbpSession(id);
  if (!session) return null;
  if (session.status !== "pending") return session;
  if (!isAlfaSbpConfigured()) return session;

  const stored = decodeSbpQrStorage(session.qrPayload);
  const status = await getAlfaOrderStatus({
    orderNumber: session.id,
    orderId: stored.mdOrder,
  });

  if (isAlfaPaymentSuccessful(status.orderStatus)) {
    if (status.orderStatus === 1 && stored.mdOrder) {
      try {
        await captureAlfaHold(stored.mdOrder, status.amountKopecks);
      } catch {
        /* холд можно завершить в кабинете банка */
      }
    }
    return markSbpSessionPaid(id);
  }

  if (isAlfaPaymentRejected(status.orderStatus)) {
    return markSbpSessionExpired(id);
  }

  return session;
}

export async function syncSbpSessionByAlfaIds(input: {
  orderNumber?: string;
  orderId?: string;
}): Promise<SbpPaymentSession | null> {
  if (input.orderNumber) {
    return syncSbpSessionWithBank(input.orderNumber);
  }

  if (!input.orderId || !isAlfaSbpConfigured()) return null;

  const status = await getAlfaOrderStatus({ orderId: input.orderId });
  if (!status.orderNumber) return null;
  return syncSbpSessionWithBank(status.orderNumber);
}

export async function confirmSbpSession(id: string): Promise<SbpPaymentSession | null> {
  if (isAlfaSbpConfigured()) {
    return syncSbpSessionWithBank(id);
  }

  const current = await getSbpSession(id);
  if (!current) return null;
  if (current.status === "expired" || current.status === "paid") return current;
  return markSbpSessionPaid(id);
}
