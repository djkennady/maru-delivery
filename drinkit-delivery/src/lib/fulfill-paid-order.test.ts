import { beforeEach, describe, expect, it, vi } from "vitest";

const getOrderByPaymentId = vi.fn();
const getPaymentOrderDraft = vi.fn();
const getSbpSession = vi.fn();
const createOrder = vi.fn();
const syncOrderWithRkeeper = vi.fn();
const ensureAdminsNotifiedAboutOrder = vi.fn();

vi.mock("@/lib/orders-store", () => ({
  getOrderByPaymentId: (...args: unknown[]) => getOrderByPaymentId(...args),
  createOrder: (...args: unknown[]) => createOrder(...args),
}));

vi.mock("@/lib/payment-order-draft", () => ({
  getPaymentOrderDraft: (...args: unknown[]) => getPaymentOrderDraft(...args),
}));

vi.mock("@/lib/sbp-payments-store", () => ({
  getSbpSession: (...args: unknown[]) => getSbpSession(...args),
}));

vi.mock("@/lib/rkeeper", () => ({
  syncOrderWithRkeeper: (...args: unknown[]) => syncOrderWithRkeeper(...args),
}));

vi.mock("@/lib/telegram", () => ({
  ensureAdminsNotifiedAboutOrder: (...args: unknown[]) =>
    ensureAdminsNotifiedAboutOrder(...args),
}));

describe("fulfillPaidPayment amount guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not create an order when the paid session amount differs from the draft", async () => {
    getOrderByPaymentId.mockResolvedValue(null);
    getSbpSession.mockResolvedValue({ id: "sbp-1", status: "paid", amount: 1 });
    getPaymentOrderDraft.mockResolvedValue({
      name: "Тест",
      phone: "+79990001122",
      address: "Самовывоз",
      items: [],
      subtotal: 350,
      deliveryFee: 0,
      total: 350,
      paymentMethod: "sbp",
    });

    const { fulfillPaidPayment } = await import("@/lib/fulfill-paid-order");
    const result = await fulfillPaidPayment("sbp-1");
    expect(result).toBeNull();
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("creates a paid order when session amount matches the draft", async () => {
    getOrderByPaymentId.mockResolvedValue(null);
    getSbpSession.mockResolvedValue({ id: "sbp-1", status: "paid", amount: 207 });
    getPaymentOrderDraft.mockResolvedValue({
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
    });
    createOrder.mockImplementation(async (input: { total: number }) => ({
      id: "order-1",
      ...input,
      paymentStatus: "paid",
    }));
    syncOrderWithRkeeper.mockResolvedValue(undefined);
    ensureAdminsNotifiedAboutOrder.mockResolvedValue(undefined);

    const { fulfillPaidPayment } = await import("@/lib/fulfill-paid-order");
    const result = await fulfillPaidPayment("sbp-1");
    expect(result?.total).toBe(207);
    expect(createOrder).toHaveBeenCalledTimes(1);
  });
});
