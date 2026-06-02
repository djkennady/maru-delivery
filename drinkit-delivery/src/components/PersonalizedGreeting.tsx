"use client";

import { useMemo } from "react";
import Image from "next/image";
import { ChevronRight, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import { useUser } from "@/context/UserContext";
import { getFirstName, getPaidOrders } from "@/lib/loyalty";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

interface PersonalizedGreetingProps {
  onSelect: (product: Product) => void;
}

export function PersonalizedGreeting({ onSelect }: PersonalizedGreetingProps) {
  const { profile, orders, hasProfile } = useUser();
  const { getProduct } = useMenu();
  const { addItem } = useCart();

  const favorite = useMemo(() => {
    const lastOrder = getPaidOrders(orders)[0];
    const lastItem = lastOrder?.items[0];
    if (!lastItem) return null;

    const product = getProduct(lastItem.productId);
    if (!product) return null;

    return { product, options: lastItem.options, unitPrice: lastItem.unitPrice };
  }, [orders, getProduct]);

  if (!hasProfile || !favorite) return null;

  const firstName = getFirstName(profile.name);

  return (
    <section className="px-4 py-2">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-3 text-xl font-bold lowercase text-[var(--text)]">
          {firstName}, тебе как всегда?
        </h2>

        <article className="flex items-center gap-3 overflow-hidden rounded-[1.75rem] bg-[var(--card)]/80 p-3 shadow-md ring-1 ring-orange-100/80 backdrop-blur-sm">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
            <Image
              src={getProductImage(favorite.product.id, favorite.product.imageUrl)}
              alt={favorite.product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-bold text-[var(--text)]">{favorite.product.name}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {favorite.options.size.toUpperCase()}
              {favorite.product.customizable ? " · как в прошлый раз" : ""}
            </p>
            <p className="mt-2 text-lg font-black text-[var(--accent-warm)]">
              {formatPrice(favorite.unitPrice)}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <button
              type="button"
              onClick={() => addItem(favorite.product, favorite.options)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105"
              aria-label="Добавить в корзину"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onSelect(favorite.product)}
              className="flex h-9 w-11 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)]"
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
