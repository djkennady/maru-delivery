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

function buildGroups(products: Product[]) {
  const order: string[] = [];
  const map = new Map<string, Product[]>();

  for (const product of products) {
    const groupName = product.group?.trim() || "Меню";
    if (!map.has(groupName)) {
      map.set(groupName, []);
      order.push(groupName);
    }
    map.get(groupName)!.push(product);
  }

  return order.map((name) => ({ name, items: map.get(name)! }));
}

export function MenuSection({ onSelect }: MenuSectionProps) {
  const { categories, products } = useMenu();
  const [activeCategory, setActiveCategory] = useState(
    () => categories[0]?.id ?? "new",
  );
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategory),
    [products, activeCategory],
  );

  const groupedProducts = useMemo(
    () => buildGroups(filteredProducts),
    [filteredProducts],
  );

  const visibleGroups = useMemo(() => {
    if (!activeGroup) return groupedProducts;
    return groupedProducts.filter((group) => group.name === activeGroup);
  }, [groupedProducts, activeGroup]);

  const activeCategoryData = categories.find((c) => c.id === activeCategory);
  const categoryName = activeCategoryData?.name ?? "";
  const hasSubgroups = groupedProducts.length > 1;

  useEffect(() => {
    if (!categories.length) return;
    if (!categories.some((category) => category.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    setActiveGroup(groupedProducts[0]?.name ?? null);
  }, [activeCategory, groupedProducts]);

  return (
    <>
      <FeaturedHits onSelect={onSelect} />

      <section className="sticky top-16 z-40 border-b border-orange-200/50 bg-white/45 px-4 py-3 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-lg overflow-hidden">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            меню
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-hide">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative h-20 w-24 min-w-24 max-w-24 flex-none overflow-hidden rounded-2xl transition ${
                    active
                      ? "ring-2 ring-[var(--accent-warm)]"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
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
                  <span className="absolute inset-x-0 bottom-2 px-1 text-center text-[11px] font-bold leading-tight text-white">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-lg overflow-x-hidden px-4 py-5 pb-32">
        <div className="relative mb-4 h-28 overflow-hidden rounded-[1.5rem]">
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

        {hasSubgroups ? (
          <div className="sticky top-[8.75rem] z-30 mb-4 overflow-hidden rounded-2xl border border-orange-100/80 bg-[var(--bg)]/95 py-2.5 backdrop-blur-md">
            <div className="flex gap-2 overflow-x-auto px-2.5 scrollbar-hide">
              {groupedProducts.map((group) => {
                const active = activeGroup === group.name;
                return (
                  <button
                    key={group.name}
                    type="button"
                    onClick={() => setActiveGroup(group.name)}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-[var(--accent-warm)] text-white shadow-md shadow-orange-300/40"
                        : "bg-white text-[var(--text)] ring-1 ring-orange-100 hover:bg-orange-50"
                    }`}
                  >
                    {group.name}
                    <span
                      className={`ml-1.5 tabular-nums ${active ? "text-orange-100" : "text-[var(--muted)]"}`}
                    >
                      {group.items.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-4 py-10 text-center text-[var(--muted)]">
              В этой категории пока пусто
            </p>
          ) : (
            visibleGroups.map((group) => (
              <div key={group.name}>
                {!hasSubgroups ? (
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent-warm)]">
                    {group.name}
                  </h3>
                ) : null}
                <div className="space-y-4">
                  {group.items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
