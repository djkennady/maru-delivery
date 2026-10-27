"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { BREAKFAST_CATEGORY_ID } from "@/lib/breakfast-hours";
import { useBreakfastMenuOpen } from "@/lib/use-breakfast-menu-open";
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
    const groupName = product.group?.trim() || "меню";
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
  const breakfastOpen = useBreakfastMenuOpen();
  const shopCategories = useMemo(
    () =>
      breakfastOpen
        ? categories
        : categories.filter((category) => category.id !== BREAKFAST_CATEGORY_ID),
    [categories, breakfastOpen],
  );
  const shopProducts = useMemo(
    () =>
      breakfastOpen
        ? products
        : products.filter((product) => product.categoryId !== BREAKFAST_CATEGORY_ID),
    [products, breakfastOpen],
  );

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const groupRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (shopCategories.length === 0) return;
    if (!shopCategories.some((category) => category.id === activeCategory)) {
      setActiveCategory(shopCategories[0].id);
    }
  }, [shopCategories, activeCategory]);

  const resolvedCategory =
    shopCategories.some((category) => category.id === activeCategory)
      ? activeCategory
      : (shopCategories[0]?.id ?? "");

  const filteredProducts = useMemo(
    () => shopProducts.filter((p) => p.categoryId === resolvedCategory),
    [shopProducts, resolvedCategory],
  );

  const groupedProducts = useMemo(
    () => buildGroups(filteredProducts),
    [filteredProducts],
  );

  useEffect(() => {
    setActiveGroup(groupedProducts[0]?.name ?? null);
  }, [resolvedCategory, groupedProducts]);

  const hasSubgroups = groupedProducts.length > 1;
  const showForYou = resolvedCategory === shopCategories[0]?.id;

  const scrollToGroup = (name: string) => {
    setActiveGroup(name);
    const el = groupRefs.current[name];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="sticky top-14 z-40 border-b border-white/5 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-lg px-4 pt-2">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-5 pb-2">
              {shopCategories.map((category) => {
                const active = resolvedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`shrink-0 pb-1 text-[15px] font-semibold lowercase tracking-tight transition ${
                      active ? "drinkit-tab-active" : "drinkit-tab hover:text-white/80"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {hasSubgroups ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex w-max gap-4 pb-2 pt-1">
                {groupedProducts.map((group) => {
                  const active = activeGroup === group.name;
                  return (
                    <button
                      key={group.name}
                      type="button"
                      onClick={() => scrollToGroup(group.name)}
                      className={`shrink-0 pb-2 text-[12px] font-medium lowercase tracking-wide transition ${
                        active
                          ? "drinkit-subtab-active"
                          : "text-white/35 hover:text-white/70"
                      }`}
                    >
                      {group.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-1" />
          )}
        </div>
      </section>

      {showForYou ? <FeaturedHits onSelect={onSelect} /> : null}

      <section className="mx-auto w-full max-w-lg px-3 pb-36 pt-3">
        {filteredProducts.length === 0 ? (
          <p className="rounded-2xl bg-[var(--card)] px-4 py-10 text-center text-[var(--muted)]">
            В этой категории пока пусто
          </p>
        ) : (
          <div className="space-y-8">
            {groupedProducts.map((group) => (
              <div
                key={group.name}
                ref={(node) => {
                  groupRefs.current[group.name] = node;
                }}
              >
                <h3 className="mb-3 px-1 text-[13px] font-medium lowercase tracking-wide text-white/55">
                  {group.name}
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {group.items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
