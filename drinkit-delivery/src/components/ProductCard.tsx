"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

const TAG_LABELS = { hit: "Хит", new: "Новинка" } as const;

const TAG_STYLES = {
  hit: "bg-[var(--accent-warm)] text-white",
  new: "bg-[var(--accent)] text-white",
} as const;

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <article className="flex w-full max-w-full flex-col overflow-hidden rounded-[1.35rem] bg-[var(--card)] shadow-md ring-1 ring-orange-100">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--surface)]">
        <Image
          src={getProductImage(product.id, product.imageUrl)}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 512px) 100vw, 512px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_STYLES[tag]}`}
            >
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
        <span className="absolute bottom-3 left-3 text-xl drop-shadow-lg">
          {product.emoji}
        </span>
      </div>

      <div className="flex min-h-[7.5rem] items-end justify-between gap-3 p-3.5">
        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="truncate font-bold leading-snug text-[var(--text)]">
            {product.name}
          </h3>
          <p className="mt-1 min-h-[2.5rem] line-clamp-2 text-sm leading-snug text-[var(--muted)]">
            {product.description?.trim() || "\u00A0"}
          </p>
          <p className="mt-2 text-lg font-black text-[var(--accent-warm)]">
            {formatPrice(product.basePrice)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
          aria-label="Добавить в корзину"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
