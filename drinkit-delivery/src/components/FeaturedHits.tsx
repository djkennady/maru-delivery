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
    <section className="px-4 py-2">
      <div className="mx-auto max-w-lg">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-warm)]">
              для тебя
            </p>
            <h2 className="text-xl font-black lowercase text-[var(--text)]">
              хиты мару
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-warm-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-warm)]">
            <Star className="h-3.5 w-3.5 fill-current" />
            Топ заказов
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {hits.map((product) => (
            <article
              key={product.id}
              className="group relative w-[168px] shrink-0 overflow-hidden rounded-[1.5rem] bg-[var(--card)] shadow-md ring-1 ring-orange-100"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={getProductImage(product.id, product.imageUrl)}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="168px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-[var(--accent-warm)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Хит
                </span>
                <button
                  type="button"
                  onClick={() => onSelect(product)}
                  className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-lg transition hover:scale-105"
                  aria-label={`Добавить ${product.name}`}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-[var(--text)]">{product.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--accent-warm)]">
                  {formatPrice(product.basePrice)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
