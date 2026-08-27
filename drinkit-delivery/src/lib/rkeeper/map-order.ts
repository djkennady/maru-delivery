import { getMenu } from "@/lib/menu-store";
import type { OrderRecord } from "@/types/user";
import type { RkeeperOrderPayload } from "./types";

export async function mapOrderToRkeeperPayload(
  order: OrderRecord,
): Promise<RkeeperOrderPayload> {
  const menu = await getMenu();
  const productsById = new Map(
    menu.products.map((product) => [product.id, product]),
  );

  return {
    externalOrderId: order.id,
    createdAt: order.createdAt,
    customerName: order.name,
    customerPhone: order.phone,
    deliveryAddress: order.address,
    comment: order.comment,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentId: order.paymentId,
    items: order.items.map((item) => {
      const product = productsById.get(item.productId);
      return {
        productId: item.productId,
        name: product?.name ?? item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        rkeeperCode: product?.rkeeperCode,
        size: item.options?.size,
        milk: item.options?.milk,
      };
    }),
  };
}
