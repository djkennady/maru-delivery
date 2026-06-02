"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { getCategoryImage } from "@/lib/media";
import { ProductCard } from "./ProductCard";
import { FeaturedHits } from "./FeaturedHits";
import type { Product } from "@/types/menu";

interface MenuSectionProps {
  onSelect: (product: Product) => void;
}

export function MenuSection({ onSelect }: MenuSectionProps) {
  const { categories, products } = useMenu();
  const [activeCategory, setActiveCategory] = useState(
    () => categories[0]?.id ?? "new",
  );

  const filteredProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategory),
    [products, activeCategory],
  );

  const activeCategoryData = categories.find((c) => c.id === activeCategory);
  const categoryName = activeCategoryData?.name ?? "";

  useEffect(() => {
    if (!categories.length) return;
    if (!categories.some((category) => category.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  return (
    <>
      <FeaturedHits onSelect={onSelect} />

      <section className="sticky top-16 z-40 border-b border-orange-200/50 bg-white/45 px-4 py-3 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            меню
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative shrink-0 overflow-hidden rounded-2xl transition ${
                    active
                      ? "ring-2 ring-[var(--accent-warm)] ring-offset-2 ring-offset-white/40"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="relative h-20 w-24">
                    <Image
                      src={getCategoryImage(category.id, category)}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <div
                      className={`absolute inset-0 ${
                        active
                          ? "bg-gradient-to-t from-[var(--accent-warm)]/90 to-[var(--accent-warm)]/20"
                          : "bg-gradient-to-t from-black/70 to-black/10"
                      }`}
                    />
                    <span className="absolute inset-x-0 bottom-2 text-center text-xs font-bold text-white">
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-4 py-5 pb-32">
        <div className="relative mb-4 overflow-hidden rounded-[1.75rem]">
          <div className="relative aspect-[21/9]">
            <Image
              src={getCategoryImage(activeCategory, activeCategoryData)}
              alt={categoryName}
              fill
              className="object-cover"
              sizes="512px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
                Категория
              </p>
              <h2 className="text-2xl font-black text-white">{categoryName}</h2>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-4 py-10 text-center text-[var(--muted)]">
              В этой категории пока пусто
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelect}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
