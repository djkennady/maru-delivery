import { getRkeeperConfig, isRkeeperReady } from "./config";
import type { RkeeperOrderPayload, RkeeperSyncResult } from "./types";

/**
 * Заглушка клиента R-Keeper.
 * Когда появятся доступы (White Server / XML / UCS), сюда добавляется реальный HTTP-запрос.
 * Сейчас при включённом флаге только валидирует конфиг и логирует payload.
 */
export async function sendOrderToRkeeper(
  payload: RkeeperOrderPayload,
): Promise<RkeeperSyncResult> {
  const config = getRkeeperConfig();

  if (!config.enabled) {
    return { status: "disabled", message: "R-Keeper выключен (RKEEPER_ENABLED)" };
  }

  if (!isRkeeperReady(config)) {
    return {
      status: "failed",
      message:
        "R-Keeper включён, но не хватает RKEEPER_BASE_URL / OBJECT_ID / USERNAME / PASSWORD",
      payload,
    };
  }

  const missingCodes = payload.items.filter((item) => !item.rkeeperCode);
  if (missingCodes.length > 0) {
    console.warn(
      "[rkeeper] товары без rkeeperCode:",
      missingCodes.map((item) => item.productId).join(", "),
    );
  }

  // TODO: реализовать вызов API кипера (White Server / XML interface).
  // Пример места для HTTP:
  // await fetch(`${config.baseUrl}/...`, { method: "POST", headers, body })
  console.info("[rkeeper] payload готов, клиент API ещё не подключён", {
    orderId: payload.externalOrderId,
    objectId: config.objectId,
    stationId: config.stationId,
    items: payload.items.length,
  });

  return {
    status: "not_implemented",
    message:
      "Каркас готов: заказ сформирован, но реальный API R-Keeper ещё не подключён",
    payload,
  };
}
