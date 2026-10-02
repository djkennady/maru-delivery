import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { getPickupDiscount } from "@/lib/fulfillment";
import { getProductPrice } from "@/lib/pricing";
import type { PaymentOrderDraft } from "@/types/user";

const createSbpSession = vi.fn();
const confirmSbpSession = vi.fn();
const getSbpSession = vi.fn();
const syncSbpSessionWithBank = vi.fn();
const getMenu = vi.fn(async () => DEFAULT_MENU);
const getOrderByPaymentId = vi.fn();
const getOrdersByPhone = vi.fn();
const getPaymentOrderDraft = vi.fn();
const savePaymentOrderDraft = vi.fn();
const fulfillPaidPayment = vi.fn();

vi.mock("@/lib/menu-store", () => ({
  getMenu: () => getMenu(),
}));

vi.mock("@/lib/sbp-payments-store", () => ({
  createSbpSession: (...args: unknown[]) => createSbpSession(...args),
  confirmSbpSession: (...args: unknown[]) => confirmSbpSession(...args),
  getSbpSession: (...args: unknown[]) => getSbpSession(...args),
  syncSbpSessionWithBank: (...args: unknown[]) => syncSbpSessionWithBank(...args),
}));

vi.mock("@/lib/orders-store", () => ({
  getOrderByPaymentId: (...args: unknown[]) => getOrderByPaymentId(...args),
  getOrdersByPhone: (...args: unknown[]) => getOrdersByPhone(...args),
}));

vi.mock("@/lib/payment-order-draft", () => ({
  getPaymentOrderDraft: (...args: unknown[]) => getPaymentOrderDraft(...args),
  savePaymentOrderDraft: (...args: unknown[]) => savePaymentOrderDraft(...args),
  savePaymentOrderDraftIfAbsent: vi.fn(),
  normalizePaymentOrderDraft: (value: unknown) => value,
}));

vi.mock("@/lib/fulfill-paid-order", () => ({
  fulfillPaidPayment: (...args: unknown[]) => fulfillPaidPayment(...args),
}));

vi.mock("qrcode", () => ({
  default: {
    toDataURL: async () => "data:image/png;base64,qq",
  },
}));

function catalogTotal() {
  const product = DEFAULT_MENU.products.find((item) => item.id === "americano");
  if (!product) throw new Error("americano missing");
  const unit = getProductPrice(product, { size: "m", milk: "regular" });
  return { unit, total: unit - getPickupDiscount(unit) };
}

function checkoutBody(amount: number, extra: Record<string, unknown> = {}) {
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
      paymentMethod: "sbp",
    },
    ...extra,
  };
}

describe("payment and order APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMenu.mockResolvedValue(DEFAULT_MENU);
  });

  it("rejects amount=1 when the catalog total is 207", async () => {
    const { POST } = await import("@/app/api/payment/sbp/route");
    const response = await POST(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(checkoutBody(1)),
      }),
    );
    expect(response.status).toBe(400);
    expect(createSbpSession).not.toHaveBeenCalled();
  });

  it("creates a normal pickup payment from catalog prices", async () => {
    const { total } = catalogTotal();
    createSbpSession.mockImplementation(
      async (amount: number, phone: string, draft: PaymentOrderDraft) => ({
        id: "sbp-test",
        amount,
        phone,
        status: "pending",
        qrPayload: "payload",
        createdAt: "2026-01-01T00:00:00.000Z",
        expiresAt: "2026-01-01T00:15:00.000Z",
        draft,
      }),
    );

    const { POST } = await import("@/app/api/payment/sbp/route");
    const response = await POST(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(checkoutBody(total)),
      }),
    );
    const data = (await response.json()) as {
      session: { amount: number; id: string };
    };

    expect(response.status).toBe(200);
    expect(data.session.amount).toBe(207);
    expect(createSbpSession.mock.calls[0][0]).toBe(207);
    expect(createSbpSession.mock.calls[0][2].total).toBe(207);
    expect(createSbpSession.mock.calls[0][2].items[0].unitPrice).toBe(230);
  });

  it("returns 400 for damaged JSON and amount 0", async () => {
    const { POST } = await import("@/app/api/payment/sbp/route");
    const badJson = await POST(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{not-json",
      }),
    );
    expect(badJson.status).toBe(400);

    const zero = await POST(
      new Request("http://local/api/payment/sbp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(checkoutBody(0)),
      }),
    );
    expect(zero.status).toBe(400);
  });

  it("does not overwrite the original draft after payment starts", async () => {
    const original: PaymentOrderDraft = {
      name: "Тест",
      phone: "+79990001122",
      address: "Самовывоз",
      items: [
        {
          id: "line-1",
          productId: "americano",
          quantity: 1,
          options: { size: "m", milk: "regular" },
          unitPrice: 230,
        },
      ],
      subtotal: 230,
      deliveryFee: 0,
      giftDiscount: 23,
      total: 207,
      paymentMethod: "sbp",
    };

    getOrderByPaymentId.mockResolvedValue(null);
    getPaymentOrderDraft.mockResolvedValue(original);
    confirmSbpSession.mockResolvedValue({
      id: "sbp-test",
      amount: 207,
      status: "paid",
    });
    fulfillPaidPayment.mockResolvedValue({
      id: "order-1",
      paymentId: "sbp-test",
      total: 207,
      paymentStatus: "paid",
    });

    const { POST } = await import("@/app/api/order/route");
    const response = await POST(
      new Request("http://local/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          paymentId: "sbp-test",
          name: "Другой",
          phone: "+79990001122",
          address: "Другой адрес",
          items: original.items,
          subtotal: 9999,
          total: 9999,
          paymentMethod: "sbp",
        }),
      }),
    );
    const data = (await response.json()) as { order: { total: number } };

    expect(response.status).toBe(200);
    expect(data.order.total).toBe(207);
    expect(savePaymentOrderDraft).not.toHaveBeenCalled();
    expect(fulfillPaidPayment).toHaveBeenCalledWith("sbp-test");
  });

  it("returns the same order on repeated confirm", async () => {
    const order = { id: "order-1", paymentId: "sbp-test", total: 207 };
    getOrderByPaymentId.mockResolvedValue(order);

    const { POST } = await import("@/app/api/order/route");
    const first = await POST(
      new Request("http://local/api/order", {
        method: "POST",
        body: JSON.stringify({ paymentId: "sbp-test" }),
      }),
    );
    const second = await POST(
      new Request("http://local/api/order", {
        method: "POST",
        body: JSON.stringify({ paymentId: "sbp-test" }),
      }),
    );

    expect((await first.json()).order.id).toBe("order-1");
    expect((await second.json()).order.id).toBe("order-1");
    expect(fulfillPaidPayment).not.toHaveBeenCalled();
  });
});
