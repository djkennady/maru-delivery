import { ClientError } from "@/lib/api-error";
import { FULFILLMENT_MODE, getPickupDiscount } from "@/lib/fulfillment";
import { getProductPrice } from "@/lib/pricing";
import { isValidRuPhone, normalizeRuPhone } from "@/lib/phone";
import type {
  CartItem,
  CartItemOptions,
  MenuData,
  MilkOption,
  Product,
  ProductSize,
} from "@/types/menu";
import type { PaymentMethod, PaymentOrderDraft } from "@/types/user";

const SIZES = new Set<ProductSize>(["s", "m", "l"]);
const MILKS = new Set<MilkOption>(["regular", "oat", "almond", "none"]);

export interface QuotedCheckout {
  draft: PaymentOrderDraft;
  amount: number;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "card" || value === "sbp";
}

function validateSize(product: Product, size: unknown): ProductSize {
  if (typeof size !== "string" || !SIZES.has(size as ProductSize)) {
    throw new ClientError("Invalid item size");
  }
  const productSize = size as ProductSize;
  if (product.sizes && Object.keys(product.sizes).length > 0) {
    if (product.sizes[productSize] == null) {
      throw new ClientError(`Size ${productSize} is not available`);
    }
  }
  return productSize;
}

function validateMilk(product: Product, milk: unknown): MilkOption {
  if (typeof milk !== "string" || !MILKS.has(milk as MilkOption)) {
    throw new ClientError("Invalid milk option");
  }
  const option = milk as MilkOption;
  if (!product.customizable && option !== "regular" && option !== "none") {
    throw new ClientError("Milk option is not available");
  }
  return option;
}

function quoteItem(raw: unknown, catalog: Map<string, Product>): CartItem {
  const item = asRecord(raw);
  if (!item) {
    throw new ClientError("Invalid cart item");
  }

  const productId = readString(item.productId);
  const product = catalog.get(productId);
  if (!product) {
    throw new ClientError("Unknown product");
  }

  const quantity = item.quantity;
  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 99
  ) {
    throw new ClientError("Invalid quantity");
  }

  const optionsRaw = asRecord(item.options) ?? {};
  const options: CartItemOptions = {
    size: validateSize(product, optionsRaw.size ?? "m"),
    milk: validateMilk(product, optionsRaw.milk ?? "regular"),
  };
  const unitPrice = getProductPrice(product, options);
  if (!(unitPrice > 0)) {
    throw new ClientError("Invalid product price");
  }

  const id = readString(item.id) || `${productId}-${options.size}-${options.milk}`;

  return {
    id,
    productId,
    quantity,
    options,
    unitPrice,
  };
}

export function quoteCheckout(
  body: unknown,
  menu: MenuData,
  options: { requireAmount?: boolean } = {},
): QuotedCheckout {
  const payload = asRecord(body);
  if (!payload) {
    throw new ClientError("Invalid payment data");
  }

  const orderRaw = asRecord(payload.order);
  if (!orderRaw) {
    throw new ClientError("Invalid order");
  }

  const name = readString(orderRaw.name);
  if (!name) {
    throw new ClientError("Invalid order");
  }

  const phone = readString(orderRaw.phone) || readString(payload.phone);
  if (!isValidRuPhone(phone)) {
    throw new ClientError("Invalid phone");
  }

  const payloadPhone = readString(payload.phone);
  if (payloadPhone && isValidRuPhone(payloadPhone)) {
    if (normalizeRuPhone(payloadPhone) !== normalizeRuPhone(phone)) {
      throw new ClientError("Invalid phone");
    }
  } else if (payloadPhone) {
    throw new ClientError("Invalid phone");
  }

  if (!Array.isArray(orderRaw.items) || orderRaw.items.length === 0) {
    throw new ClientError("Invalid order");
  }

  const paymentMethod = orderRaw.paymentMethod;
  if (!isPaymentMethod(paymentMethod)) {
    throw new ClientError("Invalid order");
  }

  const catalog = new Map(menu.products.map((product) => [product.id, product]));
  const items = orderRaw.items.map((item) => quoteItem(item, catalog));
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  if (!(subtotal > 0)) {
    throw new ClientError("Invalid order");
  }

  const pickupDiscount =
    FULFILLMENT_MODE === "pickup" ? getPickupDiscount(subtotal) : 0;
  const deliveryFee = 0;
  const total = Math.max(0, subtotal - pickupDiscount) + deliveryFee;
  if (!(total > 0)) {
    throw new ClientError("Invalid amount");
  }

  const requestedAmount = payload.amount;
  if (options.requireAmount || requestedAmount !== undefined) {
    if (typeof requestedAmount !== "number" || !Number.isFinite(requestedAmount)) {
      throw new ClientError("Invalid amount");
    }
    if (requestedAmount <= 0) {
      throw new ClientError("Invalid amount");
    }
    if (Math.round(requestedAmount) !== total) {
      throw new ClientError("Payment amount does not match order total");
    }
  }

  const address = readString(orderRaw.address) || "Самовывоз";
  const comment = readString(orderRaw.comment) || undefined;

  const draft: PaymentOrderDraft = {
    name,
    phone: `+${normalizeRuPhone(phone)}`,
    address,
    comment,
    items,
    subtotal,
    deliveryFee,
    giftDiscount: pickupDiscount || undefined,
    total,
    paymentMethod,
  };

  return { draft, amount: total };
}
