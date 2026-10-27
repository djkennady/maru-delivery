"use client";

import { useMemo, useRef, useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { BREAKFAST_CATEGORY_ID } from "@/lib/breakfast-hours";
import { hasProductCutout } from "@/lib/cutouts";
import { useBreakfastMenuOpen } from "@/lib/use-breakfast-menu-open";
import { CategoryHero } from "./CategoryHero";
import { ProductCard } from "./ProductCard";
import { FeaturedHits } from "./FeaturedHits";
import type { Product } from "@/types/menu";

interface MenuSectionProps {
  onSelect: (product: Product) => void;
}

const FOR_YOU_TAB = "for-you";

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

function pickHeroProduct(products: Product[]): Product | null {
  if (products.length === 0) return null;
  return (
    products.find(
      (product) => product.tags?.includes("hit") && hasProductCutout(product.id),
    ) ??
    products.find((product) => hasProductCutout(product.id)) ??
    products.find((product) => product.tags?.includes("hit")) ??
    products.find((product) => product.tags?.includes("new")) ??
    products[0]
  );
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

  const tabs = useMemo(
    () => [
      { id: FOR_YOU_TAB, name: "для тебя" },
      ...shopCategories.map((category) => ({
        id: category.id,
        name: category.name.toLowerCase(),
      })),
    ],
    [shopCategories],
  );

  const [selectedTab, setSelectedTab] = useState(FOR_YOU_TAB);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [heroDirection, setHeroDirection] = useState<1 | -1>(1);
  const groupRefs = useRef<Record<string, HTMLElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);
  const prevTabIndex = useRef(0);

  const resolvedTab = tabs.some((tab) => tab.id === selectedTab)
    ? selectedTab
    : FOR_YOU_TAB;

  const isForYou = resolvedTab === FOR_YOU_TAB;
  const activeCategory = isForYou
    ? null
    : (shopCategories.find((category) => category.id === resolvedTab) ?? null);

  const filteredProducts = useMemo(() => {
    if (isForYou) {
      const hits = shopProducts.filter((product) => product.tags?.includes("hit"));
      return hits.length > 0 ? hits : shopProducts.slice(0, 12);
    }
    return shopProducts.filter((product) => product.categoryId === resolvedTab);
  }, [shopProducts, resolvedTab, isForYou]);

  const groupedProducts = useMemo(
    () => buildGroups(filteredProducts),
    [filteredProducts],
  );

  const resolvedGroup =
    selectedGroup && groupedProducts.some((group) => group.name === selectedGroup)
      ? selectedGroup
      : (groupedProducts[0]?.name ?? null);

  const hasSubgroups = !isForYou && groupedProducts.length > 1;
  const heroProduct = useMemo(
    () => (isForYou ? null : pickHeroProduct(filteredProducts)),
    [isForYou, filteredProducts],
  );

  const selectTab = (id: string) => {
    const nextIndex = tabs.findIndex((tab) => tab.id === id);
    const prevIndex = prevTabIndex.current;
    if (nextIndex >= 0) {
      setHeroDirection(nextIndex >= prevIndex ? 1 : -1);
      prevTabIndex.current = nextIndex;
    }
    setSelectedTab(id);
    setSelectedGroup(null);

    requestAnimationFrame(() => {
      const el = contentRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 112;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  };

  const scrollToGroup = (name: string) => {
    setSelectedGroup(name);
    const el = groupRefs.current[name];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="sticky top-14 z-40 border-b border-white/5 bg-transparent backdrop-blur-md supports-[backdrop-filter]:bg-black/25">
        <div className="mx-auto w-full max-w-7xl px-4 pt-2 md:px-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-5 pb-2">
              {tabs.map((tab) => {
                const active = resolvedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => selectTab(tab.id)}
                    className={`shrink-0 pb-1 text-[15px] font-semibold lowercase tracking-tight transition duration-300 ${
                      active
                        ? "drinkit-tab-active"
                        : "drinkit-tab hover:text-white/80"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {hasSubgroups ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex w-max gap-4 pb-2 pt-1">
                {groupedProducts.map((group) => {
                  const active = resolvedGroup === group.name;
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

      <div ref={contentRef}>
        {isForYou ? <FeaturedHits onSelect={onSelect} /> : null}

        {!isForYou && heroProduct && activeCategory ? (
          <CategoryHero
            categoryId={activeCategory.id}
            categoryName={activeCategory.name}
            product={heroProduct}
            onSelect={onSelect}
            direction={heroDirection}
          />
        ) : null}

        <section className="mx-auto w-full max-w-7xl px-3 pb-36 pt-4 md:px-6">
          {filteredProducts.length === 0 ? (
            <p className="rounded-2xl bg-[var(--card)] px-4 py-10 text-center text-[var(--muted)]">
              В этой категории пока пусто
            </p>
          ) : (
            <div className="space-y-8" key={resolvedTab}>
              {groupedProducts.map((group) => (
                <div
                  key={group.name}
                  ref={(node) => {
                    groupRefs.current[group.name] = node;
                  }}
                >
                  <h3 className="font-display mb-3 px-1 text-[15px] font-semibold lowercase tracking-wide text-white md:text-base">
                    {isForYou ? "подборка" : group.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {group.items.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={onSelect}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
