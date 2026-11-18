import { describe, expect, it } from "vitest";
import { DEFAULT_MENU } from "@/data/menu-defaults";
import { ClientError } from "@/lib/api-error";
import { quoteCheckout } from "@/lib/checkout-quote";
import { getPickupDiscount } from "@/lib/fulfillment";
import { getProductPrice } from "@/lib/pricing";

const americano = DEFAULT_MENU.products.find((product) => product.id === "americano");
/** Fixed Moscow evening — outside happy hours (20% window). */
const OUTSIDE_HAPPY_HOURS = new Date(Date.UTC(2026, 5, 15, 15, 0, 0)); // 18:00 MSK

function orderPayload(overrides: Record<string, unknown> = {}) {
  if (!americano) throw new Error("americano missing from catalog");
  const options = { size: "m" as const, milk: "regular" as const };
  const unitPrice = getProductPrice(americano, options);
  const subtotal = unitPrice;
  const pickupDiscount = getPickupDiscount(subtotal, OUTSIDE_HAPPY_HOURS);
  const total = subtotal - pickupDiscount;

  return {
    amount: total,
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
          options,
          unitPrice: 1,
        },
      ],
      subtotal: 1,
      deliveryFee: 0,
      total: 1,
      paymentMethod: "sbp",
    },
    ...overrides,
  };
}

describe("quoteCheckout", () => {
  it("reprices from the catalog and keeps the current pickup discount", () => {
    if (!americano) throw new Error("americano missing from catalog");
    const quoted = quoteCheckout(orderPayload(), DEFAULT_MENU, {
      requireAmount: true,
      now: OUTSIDE_HAPPY_HOURS,
    });
    const expectedUnit = getProductPrice(americano, { size: "m", milk: "regular" });
    const expectedDiscount = getPickupDiscount(expectedUnit, OUTSIDE_HAPPY_HOURS);

    expect(quoted.draft.items[0].unitPrice).toBe(expectedUnit);
    expect(quoted.draft.subtotal).toBe(expectedUnit);
    expect(quoted.draft.giftDiscount).toBe(expectedDiscount);
    expect(quoted.amount).toBe(expectedUnit - expectedDiscount);
    expect(quoted.draft.total).toBe(quoted.amount);
    expect(quoted.amount).toBe(207);
  });

  it("keeps size and oat milk surcharges", () => {
    if (!americano) throw new Error("americano missing from catalog");
    const options = { size: "l" as const, milk: "oat" as const };
    const unitPrice = getProductPrice(americano, options);
    const total = unitPrice - getPickupDiscount(unitPrice, OUTSIDE_HAPPY_HOURS);
    const quoted = quoteCheckout(
      orderPayload({
        amount: total,
        order: {
          name: "Тест",
          phone: "+79990001122",
          address: "Самовывоз",
          items: [
            {
              id: "line-1",
              productId: "americano",
              quantity: 1,
              options,
              unitPrice: 1,
            },
          ],
          total: 1,
          paymentMethod: "sbp",
        },
      }),
      DEFAULT_MENU,
      { requireAmount: true, now: OUTSIDE_HAPPY_HOURS },
    );

    expect(quoted.draft.items[0].options).toEqual(options);
    expect(quoted.draft.items[0].unitPrice).toBe(320);
    expect(quoted.amount).toBe(288);
  });

  it("rejects a payment amount that does not match the catalog total", () => {
    expect(() =>
      quoteCheckout(orderPayload({ amount: 1 }), DEFAULT_MENU, {
        requireAmount: true,
        now: OUTSIDE_HAPPY_HOURS,
      }),
    ).toThrow(ClientError);
  });

  it("rejects amount 0", () => {
    try {
      quoteCheckout(orderPayload({ amount: 0 }), DEFAULT_MENU, {
        requireAmount: true,
        now: OUTSIDE_HAPPY_HOURS,
      });
      throw new Error("expected failure");
    } catch (error) {
      expect(error).toBeInstanceOf(ClientError);
      expect((error as ClientError).status).toBe(400);
    }
  });

  it("rejects phone abc", () => {
    expect(() =>
      quoteCheckout(
        orderPayload({
          phone: "abc",
          order: {
            name: "Тест",
            phone: "abc",
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
            total: 207,
            paymentMethod: "sbp",
          },
        }),
        DEFAULT_MENU,
        { requireAmount: true },
      ),
    ).toThrow(/Invalid phone/);
  });

  it("rejects unknown products, negative prices, and invalid quantities", () => {
    expect(() =>
      quoteCheckout(
        orderPayload({
          order: {
            name: "Тест",
            phone: "+79990001122",
            items: [
              {
                id: "x",
                productId: "no-such-drink",
                quantity: 1,
                options: { size: "m", milk: "regular" },
                unitPrice: 230,
              },
            ],
            total: 207,
            paymentMethod: "sbp",
          },
        }),
        DEFAULT_MENU,
      ),
    ).toThrow(/Unknown product/);

    expect(() =>
      quoteCheckout(
        orderPayload({
          order: {
            name: "Тест",
            phone: "+79990001122",
            items: [
              {
                id: "x",
                productId: "americano",
                quantity: -2,
                options: { size: "m", milk: "regular" },
                unitPrice: -50,
              },
            ],
            total: 207,
            paymentMethod: "sbp",
          },
        }),
        DEFAULT_MENU,
      ),
    ).toThrow(/Invalid quantity/);
  });

  it("rejects breakfast after 11:00 MSK and allows it during the window", () => {
    const breakfast = DEFAULT_MENU.products.find(
      (product) => product.id === "english-breakfast",
    );
    if (!breakfast) throw new Error("english-breakfast missing from catalog");

    const unitPrice = breakfast.basePrice;
    const breakfastOpenAt = new Date("2026-10-06T05:00:00.000Z"); // 08:00 MSK
    const total = unitPrice - getPickupDiscount(unitPrice, breakfastOpenAt);
    const breakfastOrder = {
      amount: total,
      phone: "+79990001122",
      order: {
        name: "Тест",
        phone: "+79990001122",
        address: "Самовывоз",
        items: [
          {
            id: "line-1",
            productId: "english-breakfast",
            quantity: 1,
            options: { size: "m", milk: "regular" },
            unitPrice: 1,
          },
        ],
        total: 1,
        paymentMethod: "sbp",
      },
    };

    expect(() =>
      quoteCheckout(breakfastOrder, DEFAULT_MENU, {
        requireAmount: true,
        now: new Date("2026-10-06T08:00:00.000Z"),
      }),
    ).toThrow(/Завтраки доступны/);

    const quoted = quoteCheckout(breakfastOrder, DEFAULT_MENU, {
      requireAmount: true,
      now: breakfastOpenAt,
    });
    expect(quoted.draft.items[0].productId).toBe("english-breakfast");
    expect(quoted.amount).toBe(total);
  });

  it("rejects stopped products", () => {
    if (!americano) throw new Error("americano missing from catalog");
    const stoppedMenu = {
      ...DEFAULT_MENU,
      products: DEFAULT_MENU.products.map((product) =>
        product.id === "americano" ? { ...product, stopped: true } : product,
      ),
    };
    expect(() =>
      quoteCheckout(orderPayload(), stoppedMenu, {
        requireAmount: true,
        now: OUTSIDE_HAPPY_HOURS,
      }),
    ).toThrow(/стоп-лист/);
  });
});
