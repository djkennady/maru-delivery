"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { FREE_DELIVERY_FROM } from "@/data/delivery-menu";

export function CartBar() {
  const t = useTranslations("delivery");
  const locale = useLocale() as "ru" | "en";
  const { itemCount, subtotal, total, isFreeDelivery } = useCart();

  if (itemCount === 0) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);

  const remaining = FREE_DELIVERY_FROM - subtotal;

  return (
    <div className="delivery-theme fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--delivery-border)] bg-[var(--delivery-bg)]/95 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto max-w-lg">
        {!isFreeDelivery && remaining > 0 && (
          <p className="mb-2 text-center text-xs text-[var(--delivery-muted)]">
            {t("freeDeliveryHint", { amount: formatPrice(remaining) })}
          </p>
        )}
        <Link
          href="/delivery/checkout"
          className="flex w-full items-center justify-between rounded-2xl bg-[var(--delivery-accent)] px-5 py-4 text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#059669] active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-2 text-sm font-bold">
              {itemCount}
            </span>
            <span className="font-semibold">{t("goToCheckout")}</span>
          </div>
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </Link>
      </div>
    </div>
  );
}
