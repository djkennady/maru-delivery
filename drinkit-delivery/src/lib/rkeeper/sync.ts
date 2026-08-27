import { getRkeeperConfig } from "./config";
import { sendOrderToRkeeper } from "./client";
import { mapOrderToRkeeperPayload } from "./map-order";
import type { OrderRecord } from "@/types/user";
import type { RkeeperSyncResult } from "./types";

/**
 * Пытается отправить заказ в R-Keeper.
 * По умолчанию не ломает оформление: ошибки только логируются.
 */
export async function syncOrderWithRkeeper(
  order: OrderRecord,
): Promise<RkeeperSyncResult> {
  const config = getRkeeperConfig();

  if (!config.enabled) {
    return { status: "disabled" };
  }

  try {
    const payload = await mapOrderToRkeeperPayload(order);
    const result = await sendOrderToRkeeper(payload);

    if (result.status === "failed" || result.status === "not_implemented") {
      console.warn("[rkeeper] sync:", result.status, result.message);
      if (config.failOrderOnError && result.status === "failed") {
        throw new Error(result.message ?? "R-Keeper sync failed");
      }
    }

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "R-Keeper sync failed";
    console.error("[rkeeper] sync error:", message);

    if (config.failOrderOnError) {
      throw error;
    }

    return { status: "failed", message };
  }
}
