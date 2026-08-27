"use client";

import { useTranslations, useLocale } from "next-intl";
import { Plus } from "lucide-react";
import { localized } from "@/lib/i18n-utils";
import type { DeliveryProduct } from "@/types/delivery";

interface ProductCardProps {
  product: DeliveryProduct;
  onSelect: (product: DeliveryProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const t = useTranslations("delivery");
  const locale = useLocale() as "ru" | "en";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <article className="group flex gap-3 rounded-2xl border border-[var(--delivery-border)] bg-[var(--delivery-card)] p-3 shadow-sm transition hover:border-[var(--delivery-accent)]/30 hover:shadow-md">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--delivery-accent-soft)] text-3xl">
        {product.emoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="font-semibold text-[var(--delivery-text)]">
            {localized(product.name, locale)}
          </h3>
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--delivery-accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--delivery-accent)]"
            >
              {t(`tags.${tag}`)}
            </span>
          ))}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--delivery-muted)]">
          {localized(product.description, locale)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-[var(--delivery-text)]">
            {formatPrice(product.basePrice)}
          </span>
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--delivery-accent)] text-white shadow-sm transition hover:scale-105 hover:bg-[#059669] active:scale-95"
            aria-label={t("addToCart")}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
