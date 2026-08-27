"use client";

import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

interface FeaturedHitsProps {
  onSelect: (product: Product) => void;
}

export function FeaturedHits({ onSelect }: FeaturedHitsProps) {
  const { products } = useMenu();
  const hits = products
    .filter((product) => product.tags?.includes("hit"))
    .slice(0, 6);

  return (
    <section className="px-4 pb-3 pt-3">
      <div className="mx-auto max-w-lg min-w-0">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-warm)]">
              для тебя
            </p>
            <h2 className="text-xl font-black lowercase text-[var(--text)]">
              хиты мару
            </h2>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-warm-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-warm)]">
            <Star className="h-3.5 w-3.5 fill-current" />
            Топ заказов
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 scrollbar-hide">
          {hits.map((product) => (
            <article
              key={product.id}
              className="box-border flex w-[140px] min-w-[140px] max-w-[140px] flex-none flex-col overflow-hidden rounded-[1.25rem] bg-[var(--card)] shadow-md ring-1 ring-orange-100"
            >
              <div className="relative h-[160px] w-full overflow-hidden">
                <Image
                  src={getProductImage(product.id, product.imageUrl)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-[var(--accent-warm)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Хит
                </span>
                <button
                  type="button"
                  onClick={() => onSelect(product)}
                  className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-md"
                  aria-label={`Добавить ${product.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-2.5 pr-11">
                  <h3 className="line-clamp-2 text-[13px] font-bold leading-tight text-white">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-orange-200">
                    {formatPrice(product.basePrice)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
