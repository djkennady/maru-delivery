import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { getPickupDiscount } from "@/lib/fulfillment";
import { getProductPrice } from "@/lib/pricing";

const alfa = vi.hoisted(() => ({
  createAlfaSbpQr: vi.fn(),
  registerAlfaOrder: vi.fn(),
  getAlfaOrderStatus: vi.fn(),
  captureAlfaHold: vi.fn(),
}));

const telegram = vi.hoisted(() => ({
  ensureAdminsNotifiedAboutOrder: vi.fn(async () => undefined),
  notifyAdminsAboutOrder: vi.fn(async () => true),
}));

vi.mock("@/lib/alfa-sbp", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/alfa-sbp")>();
  return {
    ...actual,
    isAlfaSbpConfigured: () => true,
    createAlfaSbpQr: alfa.createAlfaSbpQr,
    registerAlfaOrder: alfa.registerAlfaOrder,
    getAlfaOrderStatus: alfa.getAlfaOrderStatus,
    captureAlfaHold: alfa.captureAlfaHold,
  };
});

vi.mock("@/lib/telegram", () => ({
  ensureAdminsNotifiedAboutOrder: telegram.ensureAdminsNotifiedAboutOrder,
  notifyAdminsAboutOrder: telegram.notifyAdminsAboutOrder,
}));

function catalogQuote() {
  const product = DEFAULT_MENU.products.find((item) => item.id === "americano");
  if (!product) throw new Error("americano missing");
  const unit = getProductPrice(product, { size: "m", milk: "regular" });
  return { unit, total: unit - getPickupDiscount(unit) };
}

function checkoutBody(amount: number, paymentMethod: "sbp" | "card") {
  return {
    amount,
    phone: "+79990001122",
    order: {
      name: "Тест",
      phone: "+79990001122",
      address: "Самовывоз",
      items: [
        {
          id: "line-1",
          productId: "americano",
          quantity: 1,
          options: { size: "m", milk: "regular" },
          unitPrice: 1,
        },
      ],
      subtotal: 1,
      deliveryFee: 0,
      total: 1,
      paymentMethod,
    },
  };
}

async function json(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

describe("checkout payment integration", () => {
  let dataDir = "";

  beforeEach(async () => {
    dataDir = await mkdtemp(path.join(tmpdir(), "maru-checkout-"));
    process.env.MARU_DATA_DIR = dataDir;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NETLIFY;
    delete process.env.VERCEL;
    delete process.env.TELEGRAM_BOT_TOKEN;

    await writeFile(
      path.join(dataDir, "menu.json"),
      JSON.stringify(DEFAULT_MENU),
      "utf-8",
    );
    await writeFile(path.join(dataDir, "orders.json"), "[]", "utf-8");
    await writeFile(path.join(dataDir, "sbp-payments.json"), "[]", "utf-8");

    alfa.createAlfaSbpQr.mockImplementation(
      async (input: { orderNumber: string }) => ({
        mdOrder: `md-${input.orderNumber}`,
        payload: `qr-${input.orderNumber}`,
      }),
    );
    alfa.registerAlfaOrder.mockImplementation(
      async (input: { orderNumber: string }) => ({
        mdOrder: `md-${input.orderNumber}`,
        formUrl: `https://pay.test/${input.orderNumber}`,
      }),
    );
    alfa.getAlfaOrderStatus.mockImplementation(
      async (input: { orderNumber?: string; orderId?: string }) => ({
        orderNumber: input.orderNumber ?? String(input.orderId ?? "").replace(/^md-/, ""),
        orderId: input.orderId,
        orderStatus: 2,
      }),
    );
    alfa.captureAlfaHold.mockResolvedValue(undefined);
    telegram.ensureAdminsNotifiedAboutOrder.mockClear();
  });

  afterEach(async () => {
    delete process.env.MARU_DATA_DIR;
    if (dataDir) await rm(dataDir, { recursive: true, force: true });
  });

  it("creates, confirms, and does not duplicate an SBP order", async () => {
    const { total } = catalogQuote();
    const { POST: createPayment } = await import("@/app/api/payment/sbp/route");
    const created = await createPayment(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(checkoutBody(total, "sbp")),
      }),
    );
    expect(created.status).toBe(200);
    const createdBody = await json(created);
    const session = createdBody.session as { id: string; amount: number; status: string };
    expect(session.amount).toBe(207);
    expect(session.status).toBe("pending");
    expect(alfa.createAlfaSbpQr).toHaveBeenCalled();

    const confirm = await createPayment(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "confirm", paymentId: session.id }),
      }),
    );
    expect(confirm.status).toBe(200);
    expect(((await json(confirm)).session as { status: string }).status).toBe("paid");

    const { POST: createOrder } = await import("@/app/api/order/route");
    const first = await createOrder(
      new Request("http://local/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentId: session.id }),
      }),
    );
    const firstBody = await json(first);
    const order = firstBody.order as { id: string; total: number; paymentId: string };
    expect(first.status).toBe(200);
    expect(order.total).toBe(207);
    expect(order.paymentId).toBe(session.id);

    const second = await createOrder(
      new Request("http://local/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentId: session.id }),
      }),
    );
    const secondBody = await json(second);
    expect((secondBody.order as { id: string }).id).toBe(order.id);

    const saved = JSON.parse(
      await readFile(path.join(dataDir, "orders.json"), "utf-8"),
    ) as Array<{ id: string }>;
    expect(saved).toHaveLength(1);
    expect(telegram.ensureAdminsNotifiedAboutOrder).toHaveBeenCalled();
  });

  it("keeps the original draft if a later request tries to replace it", async () => {
    const { total } = catalogQuote();
    const { POST: createPayment } = await import("@/app/api/payment/sbp/route");
    const created = await createPayment(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(checkoutBody(total, "sbp")),
      }),
    );
    const paymentId = ((await json(created)).session as { id: string }).id;

    const { POST: createOrder } = await import("@/app/api/order/route");
    await createOrder(
      new Request("http://local/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          paymentId,
          name: "Другой",
          phone: "+79990001122",
          address: "Другой адрес",
          items: checkoutBody(9999, "sbp").order.items,
          subtotal: 9999,
          total: 9999,
          paymentMethod: "sbp",
        }),
      }),
    );

    const drafts = JSON.parse(
      await readFile(path.join(dataDir, "payment-drafts.json"), "utf-8"),
    ) as Record<string, { total: number }>;
    expect(drafts[paymentId].total).toBe(207);

    const confirm = await createPayment(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "confirm", paymentId }),
      }),
    );
    expect(confirm.status).toBe(200);

    const ordered = await createOrder(
      new Request("http://local/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentId, total: 9999 }),
      }),
    );
    expect(((await json(ordered)).order as { total: number }).total).toBe(207);
  });

  it("creates a card payment against the mocked bank and fulfills once", async () => {
    const { total } = catalogQuote();
    const { POST: createPayment } = await import("@/app/api/payment/route");
    const created = await createPayment(
      new Request("http://local/api/payment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...checkoutBody(total, "card"),
          pageView: "DESKTOP",
        }),
      }),
    );
    const createdBody = await json(created);
    expect(created.status).toBe(200);
    expect(createdBody.paymentUrl).toMatch(/^https:\/\/pay\.test\//);
    const paymentId = createdBody.paymentId as string;
    expect(alfa.registerAlfaOrder).toHaveBeenCalled();

    const confirm = await createPayment(
      new Request("http://local/api/payment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "confirm", paymentId }),
      }),
    );
    expect(((await json(confirm)).session as { status: string }).status).toBe("paid");

    const { POST: createOrder } = await import("@/app/api/order/route");
    const first = await createOrder(
      new Request("http://local/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentId }),
      }),
    );
    const order = (await json(first)).order as { id: string; total: number };
    expect(order.total).toBe(207);

    const second = await createOrder(
      new Request("http://local/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentId }),
      }),
    );
    expect(((await json(second)).order as { id: string }).id).toBe(order.id);

    const saved = JSON.parse(
      await readFile(path.join(dataDir, "orders.json"), "utf-8"),
    ) as unknown[];
    expect(saved).toHaveLength(1);
  });
});
