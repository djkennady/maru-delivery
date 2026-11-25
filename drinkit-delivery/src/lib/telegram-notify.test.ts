import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { OrderRecord } from "@/types/user";

vi.mock("@/lib/supabase-server", () => ({
  isSupabaseEnabled: () => false,
  getSupabaseServerClient: () => null,
}));

vi.mock("@/lib/menu-store", () => ({
  getMenu: vi.fn(async () => ({ products: [] })),
}));

function sampleOrder(paymentId: string): OrderRecord {
  return {
    id: `order-${paymentId}`,
    createdAt: new Date().toISOString(),
    name: "Тест",
    phone: "+79990001122",
    address: "Самовывоз",
    items: [],
    subtotal: 200,
    deliveryFee: 0,
    total: 200,
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "sbp",
    cardLast4: "----",
    cardBrand: "СБП",
    paymentId,
  };
}

describe("ensureAdminsNotifiedAboutOrder idempotency", () => {
  let dataDir = "";
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "maru-tg-"));
    process.env.MARU_DATA_DIR = dataDir;
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_ADMIN_CHAT_IDS = "111";
    vi.resetModules();

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("setWebhook") || url.includes("getMe")) {
        return new Response(JSON.stringify({ ok: true, result: { username: "bot" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      if (url.includes("sendMessage")) {
        return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true, result: {} }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;
  });

  afterEach(async () => {
    globalThis.fetch = originalFetch;
    delete process.env.MARU_DATA_DIR;
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_ADMIN_CHAT_IDS;
    await fs.rm(dataDir, { recursive: true, force: true });
  });

  it("sends only once when webhook and client fulfill race", async () => {
    const { ensureAdminsNotifiedAboutOrder } = await import("@/lib/telegram");
    const order = sampleOrder(`race-${Date.now()}`);

    await Promise.all([
      ensureAdminsNotifiedAboutOrder(order),
      ensureAdminsNotifiedAboutOrder(order),
      ensureAdminsNotifiedAboutOrder(order),
    ]);

    const sendCalls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([input]) => String(input).includes("sendMessage"),
    );
    expect(sendCalls).toHaveLength(1);
  });

  it("skips a later retry after a successful notify", async () => {
    const { ensureAdminsNotifiedAboutOrder } = await import("@/lib/telegram");
    const order = sampleOrder(`retry-${Date.now()}`);

    await ensureAdminsNotifiedAboutOrder(order);
    await ensureAdminsNotifiedAboutOrder(order);

    const sendCalls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([input]) => String(input).includes("sendMessage"),
    );
    expect(sendCalls).toHaveLength(1);
  });
});
