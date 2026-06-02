"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, CreditCard, Gift, Package, Phone, User } from "lucide-react";
import { LoyaltyBonusCard } from "@/components/LoyaltyBonusCard";
import { useMenu } from "@/context/MenuContext";
import { useUser } from "@/context/UserContext";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/lib/order-status";
import { getPaymentLabel } from "@/lib/payment";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { OrderRecord } from "@/types/user";

const MILK_LABELS = {
  regular: "обычное",
  oat: "овсяное",
  almond: "миндальное",
  none: "без молока",
} as const;

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function OrderCard({ order }: { order: OrderRecord }) {
  const { getProduct } = useMenu();

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text)]">
            Заказ · {formatPrice(order.total)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status]}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <ul className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
        {order.items.map((item) => {
          const product = getProduct(item.productId);
          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 text-[var(--text)]">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getProductImage(item.productId, product?.imageUrl)}
                    alt={product?.name ?? item.productId}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </span>
                <span className="truncate">
                  {product?.name ?? item.productId} × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 text-[var(--muted)]">
                {item.options?.size?.toUpperCase() ?? ""}
                {product?.customizable && item.options?.milk
                  ? ` · ${MILK_LABELS[item.options.milk]}`
                  : ""}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--muted)]">
        <CreditCard className="h-3.5 w-3.5" />
        Оплачено · {getPaymentLabel(order)}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">{order.address}</p>
    </article>
  );
}

export function AccountContent() {
  const { profile, orders, availableGifts, ordersLoading, updateProfile, refreshOrders } =
    useUser();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setPhone(profile.phone);
    setAddress(profile.address);
  }, [profile]);

  useEffect(() => {
    const interval = setInterval(() => {
      void refreshOrders();
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, address });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activeRewards = availableGifts;

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-5 pb-10">
      <LoyaltyBonusCard />

      {activeRewards.length > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5 text-[var(--accent-warm)]" />
            <h2 className="text-lg font-bold text-[var(--text)]">
              Ваши подарки
            </h2>
          </div>
          <div className="space-y-2">
            {activeRewards.map((reward) => (
              <article
                key={`${reward.milestone}-${reward.rewardId}`}
                className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--card)] text-2xl">
                  {reward.emoji}
                </span>
                <div>
                  <p className="font-semibold text-[var(--text)]">
                    {reward.title}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {reward.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text)]">
              Личный кабинет
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Ваши данные и история заказов
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Имя
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Телефон
            </span>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-11 pr-4 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Адрес по умолчанию
            </span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Улица, дом, квартира"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
          >
            {saved ? "Сохранено" : "Сохранить"}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="text-lg font-bold text-[var(--text)]">
            История заказов
          </h2>
        </div>

        {ordersLoading && orders.length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--muted)]">
            Загрузка заказов…
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-4 py-10 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-3 font-medium text-[var(--text)]">
              Заказов пока нет
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Оформите первый заказ — он появится здесь
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-2xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Перейти в меню
            </Link>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </section>
    </div>
  );
}
