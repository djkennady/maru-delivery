import { promises as fs } from "fs";
import path from "path";

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
  await ensureStore();
  const raw = await fs.readFile(SBP_FILE, "utf-8");
  const parsed = JSON.parse(raw) as SbpPaymentSession[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeSessions(sessions: SbpPaymentSession[]) {
  await ensureStore();
  await fs.writeFile(SBP_FILE, JSON.stringify(sessions, null, 2), "utf-8");
}

function createSessionId(): string {
  return `sbp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
  if (amount <= 0) {
    throw new Error("Invalid amount");
  }

  const sessions = await readSessions();
  const now = Date.now();
  const id = createSessionId();
  const session: SbpPaymentSession = {
    id,
    amount,
    phone,
    status: "pending",
    qrPayload: buildQrPayload(id, amount),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 15 * 60 * 1000).toISOString(),
  };

  sessions.unshift(session);
  await writeSessions(sessions.slice(0, 100));
  return session;
}

export async function getSbpSession(id: string): Promise<SbpPaymentSession | null> {
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

export async function confirmSbpSession(id: string): Promise<SbpPaymentSession | null> {
  const sessions = await readSessions();
  const index = sessions.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const session = sessions[index];
  if (session.status === "expired") return session;
  if (session.status === "paid") return session;

  const paidSession: SbpPaymentSession = {
    ...session,
    status: "paid",
    paidAt: new Date().toISOString(),
  };

  sessions[index] = paidSession;
  await writeSessions(sessions);
  return paidSession;
}
