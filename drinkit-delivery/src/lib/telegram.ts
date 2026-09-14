import { getAdminPassword } from "@/lib/admin-auth";
import { getMenu } from "@/lib/menu-store";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { getPaymentLabel } from "@/lib/payment";
import { formatPrice } from "@/lib/pricing";
import { getSupabaseServerClient, isSupabaseEnabled } from "@/lib/supabase-server";
import type { CartItem } from "@/types/menu";
import type { OrderRecord, OrderStatus } from "@/types/user";
import { isOrderStatus } from "@/lib/order-status";
import { getAllOrders, updateOrderStatus } from "@/lib/orders-store";

const CHATS_KEY = "telegram_admin_chats";
const PENDING_KEY = "telegram_auth_pending";
const DEFAULT_PUBLIC_URL = "https://maru-delivery.netlify.app";

const MILK_LABELS: Record<string, string> = {
  regular: "обычное молоко",
  oat: "овсяное",
  almond: "миндальное",
  none: "без молока",
};

type TelegramChat = {
  id: number;
  type?: string;
  username?: string;
  first_name?: string;
  title?: string;
};

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
};

type TelegramMessage = {
  message_id: number;
  chat: TelegramChat;
  from?: TelegramUser;
  text?: string;
};

type TelegramCallback = {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
};

export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallback;
};

function env(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function getTelegramBotToken(): string {
  return env("TELEGRAM_BOT_TOKEN");
}

export function isTelegramConfigured(): boolean {
  return Boolean(getTelegramBotToken());
}

function publicSiteUrl(): string {
  return (env("ALFA_SBP_RETURN_URL") || DEFAULT_PUBLIC_URL).replace(
    /\/checkout\/?$/,
    "",
  );
}

function webhookUrl(): string {
  return (
    env("TELEGRAM_WEBHOOK_URL") || `${publicSiteUrl()}/api/telegram/webhook`
  );
}

function webhookSecret(): string {
  const explicit = env("TELEGRAM_WEBHOOK_SECRET");
  if (explicit) return explicit;
  const token = getTelegramBotToken();
  return token ? token.slice(-32) : "";
}

function envChatIds(): number[] {
  return env("TELEGRAM_ADMIN_CHAT_IDS")
    .split(/[,\s]+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value !== 0);
}

async function readState<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseEnabled()) return fallback;
  const supabase = getSupabaseServerClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("app_state")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error("[telegram] state read", error.message);
    return fallback;
  }

  return (data?.value as T | undefined) ?? fallback;
}

async function writeState(key: string, value: unknown): Promise<void> {
  if (!isSupabaseEnabled()) return;
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from("app_state").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );

  if (error) {
    throw new Error(`Telegram state write failed: ${error.message}`);
  }
}

async function storedChatIds(): Promise<number[]> {
  const chats = await readState<number[]>(CHATS_KEY, []);
  return chats.filter((id) => Number.isFinite(id));
}

export async function getAdminChatIds(): Promise<number[]> {
  return [...new Set([...envChatIds(), ...(await storedChatIds())])];
}

async function addChatId(chatId: number): Promise<void> {
  const chats = await storedChatIds();
  if (chats.includes(chatId)) return;
  await writeState(CHATS_KEY, [...chats, chatId]);
}

async function removeChatId(chatId: number): Promise<void> {
  const chats = await storedChatIds();
  await writeState(
    CHATS_KEY,
    chats.filter((id) => id !== chatId),
  );
}

type PendingMap = Record<string, number>;

async function markPendingAuth(chatId: number): Promise<void> {
  const pending = await readState<PendingMap>(PENDING_KEY, {});
  pending[String(chatId)] = Date.now() + 10 * 60 * 1000;
  await writeState(PENDING_KEY, pending);
}

async function isPendingAuth(chatId: number): Promise<boolean> {
  const pending = await readState<PendingMap>(PENDING_KEY, {});
  const expires = pending[String(chatId)];
  return Boolean(expires && expires > Date.now());
}

async function clearPendingAuth(chatId: number): Promise<void> {
  const pending = await readState<PendingMap>(PENDING_KEY, {});
  if (!(String(chatId) in pending)) return;
  delete pending[String(chatId)];
  await writeState(PENDING_KEY, pending);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function telegramApi(
  method: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const token = getTelegramBotToken();
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as {
    ok?: boolean;
    description?: string;
    result?: unknown;
  };

  if (!response.ok || !data.ok) {
    throw new Error(data.description ?? `Telegram ${method} failed`);
  }

  return (data.result as Record<string, unknown>) ?? {};
}

function itemLine(item: CartItem, productName: string): string {
  const size = item.options?.size ? item.options.size.toUpperCase() : "";
  const milk =
    item.options?.milk && item.options.milk !== "regular"
      ? MILK_LABELS[item.options.milk] ?? item.options.milk
      : "";
  const extras = [size, milk].filter(Boolean).join(", ");
  const name = extras ? `${productName} (${extras})` : productName;
  return `• ${escapeHtml(name)} × ${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}`;
}

async function formatOrderHtml(order: OrderRecord, title: string): Promise<string> {
  const menu = await getMenu();
  const products = new Map(menu.products.map((product) => [product.id, product.name]));
  const lines = order.items.map((item) =>
    itemLine(item, products.get(item.productId) ?? item.productId),
  );

  const when = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(order.createdAt));

  const parts = [
    `<b>${escapeHtml(title)}</b>`,
    `${escapeHtml(when)} · ${escapeHtml(ORDER_STATUS_LABELS[order.status])}`,
    "",
    `👤 ${escapeHtml(order.name)}`,
    `📞 <a href="tel:${escapeHtml(order.phone)}">${escapeHtml(order.phone)}</a>`,
    `📍 ${escapeHtml(order.address)}`,
  ];

  if (order.comment) {
    parts.push(`💬 ${escapeHtml(order.comment)}`);
  }

  parts.push("", ...lines, "");
  parts.push(`💳 ${escapeHtml(getPaymentLabel(order))} · оплачен`);

  if (order.appliedGift) {
    parts.push(`🎁 ${escapeHtml(order.appliedGift.emoji)} ${escapeHtml(order.appliedGift.title)}`);
  }
  if (order.deliveryFee === 0) {
    parts.push("🚚 Доставка бесплатно");
  } else {
    parts.push(`🚚 Доставка ${formatPrice(order.deliveryFee)}`);
  }
  parts.push(`<b>Итого: ${formatPrice(order.total)}</b>`);

  return parts.join("\n");
}

function statusKeyboard(orderId: string) {
  return {
    inline_keyboard: [
      [
        { text: "В пути", callback_data: `st:${orderId}:on_the_way` },
        { text: "Доставлен", callback_data: `st:${orderId}:delivered` },
      ],
      [{ text: "Отменить", callback_data: `st:${orderId}:cancelled` }],
    ],
  };
}

async function sendToChat(
  chatId: number,
  text: string,
  extras: Record<string, unknown> = {},
): Promise<void> {
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...extras,
  });
}

export async function notifyAdminsAboutOrder(order: OrderRecord): Promise<void> {
  if (!isTelegramConfigured()) return;

  try {
    if (!(globalThis as { __maruTelegramWebhook?: boolean }).__maruTelegramWebhook) {
      await registerTelegramWebhook();
      (globalThis as { __maruTelegramWebhook?: boolean }).__maruTelegramWebhook = true;
    }
  } catch (error) {
    console.warn(
      "[telegram] webhook register",
      error instanceof Error ? error.message : error,
    );
  }

  const chatIds = await getAdminChatIds();
  if (chatIds.length === 0) {
    console.warn("[telegram] no admin chats subscribed");
    return;
  }

  const text = await formatOrderHtml(order, "Новый заказ MARU");
  const keyboard = statusKeyboard(order.id);

  await Promise.allSettled(
    chatIds.map((chatId) =>
      sendToChat(chatId, text, { reply_markup: keyboard }).catch((error: unknown) => {
        console.error(
          "[telegram] send failed",
          chatId,
          error instanceof Error ? error.message : error,
        );
      }),
    ),
  );
}

async function isAuthorizedChat(chatId: number): Promise<boolean> {
  const chats = await getAdminChatIds();
  return chats.includes(chatId);
}

function helpText(): string {
  return [
    "<b>Бот заказов MARU</b>",
    "",
    "Чтобы получать новые заказы:",
    "1) Нажмите /start",
    "2) Пришлите пароль из админки сайта",
    "",
    "Команды:",
    "/orders — последние заказы",
    "/stop — больше не присылать",
  ].join("\n");
}

async function handleAuth(chat: TelegramChat, password: string): Promise<string> {
  if (password !== getAdminPassword()) {
    return "Неверный пароль. Возьмите его из входа в админку сайта.";
  }

  await addChatId(chat.id);
  await clearPendingAuth(chat.id);
  const who = chat.username ? `@${chat.username}` : chat.first_name || chat.title || String(chat.id);
  return `Готово, ${escapeHtml(who)}. Сюда будут приходить новые заказы MARU.`;
}

async function handleOrdersCommand(): Promise<string> {
  const orders = (await getAllOrders()).slice(0, 8);
  if (orders.length === 0) return "Заказов пока нет.";

  const lines = orders.map((order) => {
    const when = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }).format(new Date(order.createdAt));
    return `• ${escapeHtml(when)} — ${escapeHtml(order.name)} — ${formatPrice(order.total)} — ${escapeHtml(ORDER_STATUS_LABELS[order.status])}`;
  });

  return `<b>Последние заказы</b>\n\n${lines.join("\n")}`;
}

async function handleCallback(callback: TelegramCallback): Promise<void> {
  const chatId = callback.message?.chat.id;
  const data = callback.data ?? "";
  if (!chatId) return;

  if (!(await isAuthorizedChat(chatId))) {
    await telegramApi("answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "Нет доступа",
      show_alert: true,
    });
    return;
  }

  const match = /^st:(.+):(preparing|on_the_way|delivered|cancelled)$/.exec(data);
  if (!match) {
    await telegramApi("answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "Неизвестная кнопка",
    });
    return;
  }

  const orderId = match[1];
  const status = match[2] as OrderStatus;
  if (!isOrderStatus(status)) return;

  const order = await updateOrderStatus(orderId, status);
  if (!order) {
    await telegramApi("answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "Заказ не найден",
      show_alert: true,
    });
    return;
  }

  await telegramApi("answerCallbackQuery", {
    callback_query_id: callback.id,
    text: ORDER_STATUS_LABELS[status],
  });

  if (callback.message) {
    const text = await formatOrderHtml(order, "Заказ MARU");
    await telegramApi("editMessageText", {
      chat_id: chatId,
      message_id: callback.message.message_id,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: statusKeyboard(order.id),
    }).catch(() => undefined);
  }
}

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return;
  }

  const message = update.message;
  const text = message?.text?.trim();
  if (!message || !text) return;

  const chat = message.chat;
  const [commandRaw, ...rest] = text.split(/\s+/);
  const command = commandRaw.split("@")[0].toLowerCase();

  if (command === "/start") {
    const passwordArg = rest.join(" ").trim();
    if (passwordArg) {
      await sendToChat(chat.id, await handleAuth(chat, passwordArg));
      return;
    }
    await markPendingAuth(chat.id);
    await sendToChat(chat.id, helpText());
    return;
  }

  if (command === "/help") {
    await sendToChat(chat.id, helpText());
    return;
  }

  if (command === "/stop") {
    await removeChatId(chat.id);
    await sendToChat(chat.id, "Больше не буду присылать заказы. /start — чтобы включить снова.");
    return;
  }

  if (command === "/orders") {
    if (!(await isAuthorizedChat(chat.id))) {
      await sendToChat(chat.id, "Сначала /start и пароль администратора.");
      return;
    }
    await sendToChat(chat.id, await handleOrdersCommand());
    return;
  }

  if (command === "/auth") {
    await sendToChat(chat.id, await handleAuth(chat, rest.join(" ").trim()));
    return;
  }

  if (await isPendingAuth(chat.id)) {
    await sendToChat(chat.id, await handleAuth(chat, text));
  }
}

export function isValidTelegramSecret(header: string | null): boolean {
  const secret = webhookSecret();
  if (!secret) return true;
  return header === secret;
}

export async function registerTelegramWebhook(): Promise<{
  url: string;
  bot: string;
}> {
  const secret = webhookSecret();
  const url = webhookUrl();
  await telegramApi("setWebhook", {
    url,
    secret_token: secret || undefined,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false,
  });

  const me = await telegramApi("getMe", {});
  const username = typeof me.username === "string" ? me.username : "";
  return { url, bot: username ? `@${username}` : "" };
}

export async function getTelegramStatus(): Promise<Record<string, unknown>> {
  if (!isTelegramConfigured()) {
    return { configured: false };
  }

  const me = await telegramApi("getMe", {});
  const webhook = await telegramApi("getWebhookInfo", {});
  const chats = await getAdminChatIds();
  return {
    configured: true,
    bot: me.username ? `@${me.username}` : me.first_name,
    webhook,
    adminChats: chats.length,
  };
}
