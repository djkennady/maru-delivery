"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, CreditCard, Gift, Package, Phone, User } from "lucide-react";
import { LoyaltyBonusCard } from "@/components/LoyaltyBonusCard";
import { SHOW_LOYALTY_BONUSES } from "@/lib/fulfillment";
import { useMenu } from "@/context/MenuContext";
import { useUser } from "@/context/UserContext";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { getPaymentLabel } from "@/lib/payment";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { OrderRecord, OrderStatus } from "@/types/user";

const MILK_LABELS = {
  regular: "обычное",
  oat: "овсяное",
  almond: "миндальное",
  none: "без молока",
} as const;

const DRINKIT_STATUS_STYLES: Record<OrderStatus, string> = {
  preparing: "bg-amber-400/15 text-amber-200",
  on_the_way: "bg-sky-400/15 text-sky-200",
  delivered: "bg-emerald-400/15 text-emerald-200",
  cancelled: "bg-white/10 text-white/50",
};

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
    <article className="drinkit-rise rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[15px] font-semibold text-white">
            Заказ · {formatPrice(order.total)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${DRINKIT_STATUS_STYLES[order.status]}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <ul className="mt-3 space-y-2 border-t border-white/8 pt-3">
        {order.items.map((item) => {
          const product = getProduct(item.productId);
          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 text-white/90">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                  {getProductImage(item.productId, product?.imageUrl) ? (
                    <Image
                      src={getProductImage(item.productId, product?.imageUrl)}
                      alt={product?.name ?? item.productId}
                      fill
                      quality={95}
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : null}
                </span>
                <span className="truncate">
                  {product?.name ?? item.productId} × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 text-white/40">
                {item.options?.size?.toUpperCase() ?? ""}
                {product?.customizable && item.options?.milk
                  ? ` · ${MILK_LABELS[item.options.milk]}`
                  : ""}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-white/40">
        <CreditCard className="h-3.5 w-3.5" />
        Оплачено · {getPaymentLabel(order)}
      </p>
      <p className="mt-1 text-xs text-white/40">{order.address}</p>
    </article>
  );
}

export function AccountContent() {
  const { profile, orders, availableGifts, ordersLoading, updateProfile, refreshOrders } =
    useUser();

  return (
    <AccountContentInner
      key={`${profile.name}|${profile.phone}|${profile.address}`}
      profile={profile}
      orders={orders}
      availableGifts={availableGifts}
      ordersLoading={ordersLoading}
      updateProfile={updateProfile}
      refreshOrders={refreshOrders}
    />
  );
}

function AccountContentInner({
  profile,
  orders,
  availableGifts,
  ordersLoading,
  updateProfile,
  refreshOrders,
}: {
  profile: { name: string; phone: string; address: string };
  orders: OrderRecord[];
  availableGifts: ReturnType<typeof useUser>["availableGifts"];
  ordersLoading: boolean;
  updateProfile: ReturnType<typeof useUser>["updateProfile"];
  refreshOrders: ReturnType<typeof useUser>["refreshOrders"];
}) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [saved, setSaved] = useState(false);

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
    <div className="relative z-10 mx-auto max-w-lg space-y-6 px-4 py-5 pb-16 md:max-w-2xl md:px-6">
      {SHOW_LOYALTY_BONUSES ? <LoyaltyBonusCard /> : null}

      {SHOW_LOYALTY_BONUSES && activeRewards.length > 0 && (
        <section className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#60a5fa]" />
            <h2 className="font-display text-lg font-semibold text-white">
              Ваши подарки
            </h2>
          </div>
          <div className="space-y-2">
            {activeRewards.map((reward) => (
              <article
                key={`${reward.milestone}-${reward.rewardId}`}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-2xl">
                  {reward.emoji}
                </span>
                <div>
                  <p className="font-semibold text-white">{reward.title}</p>
                  <p className="text-sm text-white/45">{reward.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="drinkit-rise rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-5 backdrop-blur-sm md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6]/20 text-[#60a5fa]">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium lowercase tracking-[0.18em] text-white/35">
              profile
            </p>
            <h1 className="font-display text-lg font-semibold text-white md:text-xl">
              Личный кабинет
            </h1>
            <p className="text-sm text-white/45">
              Данные для самовывоза и история заказов
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/70">
              Имя
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#3b82f6]/60"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/70">
              Телефон
            </span>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-white/30 focus:border-[#3b82f6]/60"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/70">
              Адрес по умолчанию
            </span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Улица, дом, квартира"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#3b82f6]/60"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-[#3b82f6] px-5 py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.28)] transition hover:brightness-110 active:scale-[0.98]"
          >
            {saved ? "Сохранено" : "Сохранить"}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Package className="h-5 w-5 text-[#60a5fa]" />
          <h2 className="font-display text-lg font-semibold text-white">
            История заказов
          </h2>
        </div>

        {ordersLoading && orders.length === 0 ? (
          <p className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] px-4 py-8 text-center text-sm text-white/45">
            Загрузка заказов…
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.03] px-4 py-10 text-center">
            <p className="font-display text-base font-semibold text-white">
              Заказов пока нет
            </p>
            <p className="mt-1 text-sm text-white/45">
              Оформите самовывоз — заказ появится здесь
            </p>
            <Link
              href="/order"
              className="mt-4 inline-block rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
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
