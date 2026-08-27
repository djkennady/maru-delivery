"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { deliveryProducts } from "@/data/delivery-menu";
import { localized } from "@/lib/i18n-utils";
import type { CartItem } from "@/types/delivery";

function findProductName(productId: string, locale: "ru" | "en") {
  const product = deliveryProducts.find((p) => p.id === productId);
  return product ? localized(product.name, locale) : productId;
}

function CartLineItem({
  item,
  locale,
  onUpdate,
  onRemove,
}: {
  item: CartItem;
  locale: "ru" | "en";
  onUpdate: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("delivery");
  const product = deliveryProducts.find((p) => p.id === item.productId);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <article className="flex gap-3 rounded-2xl border border-[var(--delivery-border)] bg-[var(--delivery-card)] p-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--delivery-accent-soft)] text-2xl">
        {product?.emoji ?? "☕"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-[var(--delivery-text)]">
              {findProductName(item.productId, locale)}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--delivery-muted)]">
              {item.options.size.toUpperCase()}
              {product?.customizable &&
                ` · ${t(`milkOptions.${item.options.milk}`)}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="shrink-0 rounded-lg p-1.5 text-[var(--delivery-muted)] transition hover:bg-red-50 hover:text-red-500"
            aria-label={t("remove")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[var(--delivery-border)] bg-[var(--delivery-surface)] px-1.5 py-0.5">
            <button
              type="button"
              onClick={() => onUpdate(item.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[var(--delivery-border)]"
              aria-label={t("decrease")}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-5 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[var(--delivery-border)]"
              aria-label={t("increase")}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="font-bold text-[var(--delivery-text)]">
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function CheckoutForm() {
  const t = useTranslations("delivery");
  const locale = useLocale() as "ru" | "en";
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    isFreeDelivery,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = useMemo(
    () => (price: number) =>
      new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(price),
    [locale],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          comment,
          items,
          total,
        }),
      });

      if (!res.ok) throw new Error("failed");
      clearCart();
      setSuccess(true);
    } catch {
      setError(t("orderError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="delivery-theme mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-5xl">🛍️</p>
        <h2 className="mt-4 text-xl font-bold text-[var(--delivery-text)]">
          {t("emptyCartTitle")}
        </h2>
        <p className="mt-2 text-[var(--delivery-muted)]">{t("emptyCartText")}</p>
        <button
          type="button"
          onClick={() => router.push("/delivery")}
          className="mt-6 rounded-2xl bg-[var(--delivery-accent)] px-6 py-3 font-semibold text-white transition hover:bg-[#059669]"
        >
          {t("backToMenu")}
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="delivery-theme mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-5xl">✅</p>
        <h2 className="mt-4 text-xl font-bold text-[var(--delivery-text)]">
          {t("orderSuccessTitle")}
        </h2>
        <p className="mt-2 text-[var(--delivery-muted)]">
          {t("orderSuccessText")}
        </p>
        <button
          type="button"
          onClick={() => router.push("/delivery")}
          className="mt-6 rounded-2xl bg-[var(--delivery-accent)] px-6 py-3 font-semibold text-white transition hover:bg-[#059669]"
        >
          {t("orderAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="delivery-theme mx-auto max-w-lg space-y-6 px-4 py-5 pb-10">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--delivery-text)]">
          {t("yourOrder")}
        </h2>
        {items.map((item) => (
          <CartLineItem
            key={item.id}
            item={item}
            locale={locale}
            onUpdate={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-[var(--delivery-border)] bg-[var(--delivery-card)] p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[var(--delivery-muted)]">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--delivery-muted)]">
            <span>{t("delivery")}</span>
            <span>
              {isFreeDelivery ? t("free") : formatPrice(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-[var(--delivery-border)] pt-2 text-base font-bold text-[var(--delivery-text)]">
            <span>{t("total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--delivery-text)]">
          {t("deliveryDetails")}
        </h2>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--delivery-text)]">
            {t("name")}
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--delivery-border)] bg-[var(--delivery-surface)] px-4 py-3 text-[var(--delivery-text)] outline-none transition focus:border-[var(--delivery-accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--delivery-text)]">
            {t("phone")}
          </span>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7"
            className="w-full rounded-xl border border-[var(--delivery-border)] bg-[var(--delivery-surface)] px-4 py-3 text-[var(--delivery-text)] outline-none transition focus:border-[var(--delivery-accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--delivery-text)]">
            {t("address")}
          </span>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("addressPlaceholder")}
            className="w-full rounded-xl border border-[var(--delivery-border)] bg-[var(--delivery-surface)] px-4 py-3 text-[var(--delivery-text)] outline-none transition focus:border-[var(--delivery-accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--delivery-text)]">
            {t("comment")}
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={t("commentPlaceholder")}
            className="w-full resize-none rounded-xl border border-[var(--delivery-border)] bg-[var(--delivery-surface)] px-4 py-3 text-[var(--delivery-text)] outline-none transition focus:border-[var(--delivery-accent)]"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center rounded-2xl bg-[var(--delivery-accent)] px-5 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#059669] disabled:opacity-60"
        >
          {submitting ? t("submitting") : t("placeOrder", { total: formatPrice(total) })}
        </button>
      </form>
    </div>
  );
}
