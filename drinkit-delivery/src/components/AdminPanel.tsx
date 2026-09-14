"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  Clock,
  Lock,
  LogOut,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  User,
} from "lucide-react";
import { AdminMenuManager } from "@/components/AdminMenuManager";
import { useMenu } from "@/context/MenuContext";
import { ADMIN_TOKEN_KEY, getAdminHeaders } from "@/lib/admin-client";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/lib/order-status";
import { formatPrice } from "@/lib/pricing";
import { getPaymentLabel } from "@/lib/payment";
import { getProductImage } from "@/lib/media";
import type { OrderRecord, OrderStatus } from "@/types/user";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function AdminOrderCard({
  order,
  onStatusChange,
  updating,
  getProductName,
  getProductImageUrl,
}: {
  order: OrderRecord;
  onStatusChange: (id: string, status: OrderStatus) => void;
  updating: boolean;
  getProductName: (id: string) => string;
  getProductImageUrl: (id: string) => string | undefined;
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text)]">
            {order.name} · {formatPrice(order.total)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <select
          value={order.status}
          disabled={updating}
          onChange={(e) =>
            onStatusChange(order.id, e.target.value as OrderStatus)
          }
          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${ORDER_STATUS_STYLES[order.status]}`}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0" />
          {order.phone}
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          {order.address}
        </p>
        {order.comment && (
          <p className="flex items-start gap-2">
            <User className="mt-0.5 h-4 w-4 shrink-0" />
            {order.comment}
          </p>
        )}
        <p className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 shrink-0" />
          {getPaymentLabel(order)} ·{" "}
          {order.paymentStatus === "paid" ? "Оплачен" : "Не оплачен"}
        </p>
      </div>

      <ul className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
        {order.items.map((item) => {
          const productName = getProductName(item.productId);
          const imageUrl = getProductImageUrl(item.productId);
          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getProductImage(item.productId, imageUrl)}
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </span>
                <span className="truncate text-[var(--text)]">
                  {productName} × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 text-[var(--muted)]">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export function AdminPanel() {
  const { getProduct, refresh: refreshMenu } = useMenu();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [telegramBot, setTelegramBot] = useState<string | null>(null);
  const [telegramChats, setTelegramChats] = useState(0);
  const [telegramBusy, setTelegramBusy] = useState(false);
  const [telegramNote, setTelegramNote] = useState("");

  useEffect(() => {
    setAuthed(Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY)));
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: getAdminHeaders(),
      });

      if (res.status === 401) {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setAuthed(false);
        return;
      }

      if (!res.ok) throw new Error("failed");

      const data = (await res.json()) as { orders: OrderRecord[] };
      setOrders(data.orders);
    } catch {
      setFetchError("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    void loadOrders();
    const interval = setInterval(() => void loadOrders(), 15000);
    return () => clearInterval(interval);
  }, [authed, loadOrders]);

  const loadTelegram = useCallback(async () => {
    try {
      const res = await fetch("/api/telegram/setup", {
        headers: getAdminHeaders(),
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        configured?: boolean;
        bot?: string;
        adminChats?: number;
      };
      if (data.configured) {
        setTelegramBot(typeof data.bot === "string" ? data.bot : "бот");
        setTelegramChats(data.adminChats ?? 0);
      } else {
        setTelegramBot(null);
      }
    } catch {
      /* optional */
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    void loadTelegram();
  }, [authed, loadTelegram]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setLoginError("Неверный пароль");
        return;
      }

      sessionStorage.setItem(ADMIN_TOKEN_KEY, password);
      setAuthed(true);
      setPassword("");
    } catch {
      setLoginError("Ошибка входа");
    }
  };

  const handleTelegramConnect = async () => {
    setTelegramBusy(true);
    setTelegramNote("");
    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: getAdminHeaders(),
      });
      const data = (await res.json()) as { bot?: string; error?: string };
      if (!res.ok) {
        setTelegramNote(data.error ?? "Не удалось подключить бота");
        return;
      }
      setTelegramBot(data.bot || "бот");
      setTelegramNote(
        data.bot
          ? `Откройте ${data.bot} в Telegram → /start → пароль этой админки.`
          : "Бот подключен. Откройте его в Telegram, напишите /start и пароль админки.",
      );
      await loadTelegram();
    } catch {
      setTelegramNote("Не удалось подключить бота");
    } finally {
      setTelegramBusy(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAuthed(false);
    setOrders([]);
    setTelegramBot(null);
    setTelegramNote("");
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("failed");

      const data = (await res.json()) as { order: OrderRecord };
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? data.order : order)),
      );
    } catch {
      setFetchError("Не удалось обновить статус");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text)]">
                Кабинет администратора
              </h1>
              <p className="text-sm text-[var(--muted)]">
                Вход для управления заказами и меню
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                Пароль
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-11 pr-4 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                />
              </div>
            </label>

            {loginError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white transition hover:bg-neutral-800"
            >
              Войти
            </button>
          </form>

          <Link
            href="/"
            className="mt-4 block text-center text-sm text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            ← На сайт
          </Link>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(
    (order) => order.status !== "delivered" && order.status !== "cancelled",
  );

  const getProductName = (id: string) => getProduct(id)?.name ?? id;
  const getProductImageUrl = (id: string) => getProduct(id)?.imageUrl;

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-5 pb-10">
      <section className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-[var(--text)]">
            {tab === "orders" ? "Управление заказами" : "Управление меню"}
          </h1>
          {tab === "orders" ? (
            <p className="mt-1 text-sm text-[var(--muted)]">
              Активных: {activeOrders.length} · Всего: {orders.length}
            </p>
          ) : (
            <p className="mt-1 text-sm text-[var(--muted)]">
              Добавляйте и редактируйте позиции без кода
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {tab === "orders" && (
            <button
              type="button"
              onClick={() => void loadOrders()}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
              aria-label="Обновить"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition hover:text-red-500"
            aria-label="Выйти"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="flex gap-2 rounded-2xl bg-[var(--surface)] p-1">
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            tab === "orders"
              ? "bg-[var(--card)] text-[var(--text)] shadow-sm"
              : "text-[var(--muted)]"
          }`}
        >
          Заказы
        </button>
        <button
          type="button"
          onClick={() => setTab("menu")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            tab === "menu"
              ? "bg-[var(--card)] text-[var(--text)] shadow-sm"
              : "text-[var(--muted)]"
          }`}
        >
          Меню
        </button>
      </div>

      {tab === "menu" ? (
        <AdminMenuManager onMenuChanged={() => void refreshMenu()} />
      ) : (
        <>
          {fetchError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {fetchError}
            </p>
          )}

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#229ED9]/10 text-[#229ED9]">
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-[var(--text)]">Telegram</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {telegramBot
                    ? `${telegramBot} · подключено админов: ${telegramChats}. Напишите боту /start и пароль админки.`
                    : "Новые заказы можно сразу слать в Telegram, чтобы ничего не пропустить."}
                </p>
                <button
                  type="button"
                  onClick={() => void handleTelegramConnect()}
                  disabled={telegramBusy}
                  className="mt-3 rounded-xl bg-[#229ED9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1b8ec4] disabled:opacity-60"
                >
                  {telegramBusy
                    ? "Подключаем…"
                    : telegramBot
                      ? "Обновить подключение"
                      : "Включить бота"}
                </button>
                {telegramNote && (
                  <p className="mt-2 text-sm text-[var(--text)]">{telegramNote}</p>
                )}
              </div>
            </div>
          </section>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-4 py-12 text-center">
              <p className="text-4xl">📋</p>
              <p className="mt-3 font-medium text-[var(--text)]">
                Заказов пока нет
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Новые заказы появятся здесь автоматически
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <AdminOrderCard
                  key={order.id}
                  order={order}
                  updating={updatingId === order.id}
                  onStatusChange={handleStatusChange}
                  getProductName={getProductName}
                  getProductImageUrl={getProductImageUrl}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
