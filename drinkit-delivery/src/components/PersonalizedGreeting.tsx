"use client";

import { useMemo } from "react";
import Image from "next/image";
import { ChevronRight, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import { useUser } from "@/context/UserContext";
import { BREAKFAST_CATEGORY_ID } from "@/lib/breakfast-hours";
import { getFirstName, getPaidOrders } from "@/lib/loyalty";
import { getProductImage, isHallCatalogImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import { useBreakfastMenuOpen } from "@/lib/use-breakfast-menu-open";
import type { CartItemOptions, Product } from "@/types/menu";

interface PersonalizedGreetingProps {
  onSelect: (product: Product) => void;
}

/** Most-ordered product across paid history (qty sum), with last options. */
function useUsualOrder() {
  const { profile, orders, hasProfile } = useUser();
  const { getProduct } = useMenu();
  const breakfastOpen = useBreakfastMenuOpen();

  return useMemo(() => {
    if (!hasProfile) return null;

    const paid = getPaidOrders(orders)
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    if (paid.length === 0) return null;

    const qtyById = new Map<string, number>();
    const lastOptionsById = new Map<
      string,
      { options: CartItemOptions; unitPrice: number }
    >();

    // Newest orders first → first seen options = last ordered way.
    for (const order of paid) {
      for (const item of order.items) {
        qtyById.set(
          item.productId,
          (qtyById.get(item.productId) ?? 0) + item.quantity,
        );
        if (!lastOptionsById.has(item.productId)) {
          lastOptionsById.set(item.productId, {
            options: item.options,
            unitPrice: item.unitPrice,
          });
        }
      }
    }

    const ranked = [...qtyById.entries()].sort((a, b) => b[1] - a[1]);
    for (const [productId] of ranked) {
      const product = getProduct(productId);
      if (!product) continue;
      if (!breakfastOpen && product.categoryId === BREAKFAST_CATEGORY_ID) {
        continue;
      }
      const last = lastOptionsById.get(productId);
      if (!last) continue;
      return {
        product,
        options: last.options,
        unitPrice: last.unitPrice,
        firstName: getFirstName(profile.name),
      };
    }
    return null;
  }, [hasProfile, orders, getProduct, breakfastOpen, profile.name]);
}

export function PersonalizedGreeting({ onSelect }: PersonalizedGreetingProps) {
  const { addItem } = useCart();
  const usual = useUsualOrder();

  if (!usual) return null;

  const src = getProductImage(usual.product.id, usual.product.imageUrl);

  return (
    <section className="px-3 pb-1 pt-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display mb-3 px-1 text-xl font-semibold lowercase tracking-tight text-white md:text-2xl">
          {usual.firstName}, тебе как обычно?
        </h2>

        <article className="drinkit-rise flex items-center gap-3 overflow-hidden rounded-[1.75rem] bg-white/[0.06] p-3 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#161616]">
            {src ? (
              <Image
                src={src}
                alt={usual.product.name}
                fill
                quality={95}
                unoptimized={isHallCatalogImage(src)}
                className="object-cover"
                sizes="96px"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold text-white">
              {usual.product.name}
            </p>
            <p className="mt-1 text-sm text-white/45">
              {usual.options.size.toUpperCase()}
              {usual.product.customizable ? " · как в прошлый раз" : ""}
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatPrice(usual.unitPrice)}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <button
              type="button"
              onClick={() => addItem(usual.product, usual.options)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-lg shadow-blue-500/25 transition hover:scale-105"
              aria-label="Добавить в корзину"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onSelect(usual.product)}
              className="flex h-9 w-11 items-center justify-center rounded-full bg-white/8 text-white/55 transition hover:text-white"
              aria-label="Подробнее"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
