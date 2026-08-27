"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { deliveryCategories, deliveryProducts } from "@/data/delivery-menu";
import { localized } from "@/lib/i18n-utils";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import type { DeliveryCategoryId, DeliveryProduct } from "@/types/delivery";

export function DeliveryMenu() {
  const t = useTranslations("delivery");
  const locale = useLocale() as "ru" | "en";
  const [activeCategory, setActiveCategory] =
    useState<DeliveryCategoryId>("new");
  const [selectedProduct, setSelectedProduct] =
    useState<DeliveryProduct | null>(null);

  const filteredProducts = useMemo(
    () => deliveryProducts.filter((p) => p.categoryId === activeCategory),
    [activeCategory],
  );

  return (
    <>
      <section className="delivery-theme sticky top-14 z-40 border-b border-[var(--delivery-border)] bg-[var(--delivery-bg)]/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg gap-2 overflow-x-auto scrollbar-hide">
          {deliveryCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category.id
                  ? "bg-[var(--delivery-accent)] text-white shadow-sm"
                  : "bg-[var(--delivery-surface)] text-[var(--delivery-muted)] hover:text-[var(--delivery-text)]"
              }`}
            >
              {localized(category.name, locale)}
            </button>
          ))}
        </div>
      </section>

      <section className="delivery-theme mx-auto max-w-lg space-y-3 px-4 py-5 pb-32">
        <h2 className="text-lg font-bold text-[var(--delivery-text)]">
          {localized(
            deliveryCategories.find((c) => c.id === activeCategory)?.name ?? {
              ru: "",
              en: "",
            },
            locale,
          )}
        </h2>
        {filteredProducts.length === 0 ? (
          <p className="rounded-2xl border border-[var(--delivery-border)] bg-[var(--delivery-card)] px-4 py-10 text-center text-[var(--delivery-muted)]">
            {t("emptyCategory")}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))
        )}
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
