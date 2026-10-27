"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

const TAG_LABELS = { hit: "хит", new: "new" } as const;

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex w-full flex-col overflow-hidden rounded-[1.35rem] bg-[var(--card)] text-left transition active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111]">
        <Image
          src={getProductImage(product.id, product.imageUrl)}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 512px) 48vw, 240px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        {product.tags?.length ? (
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#3b82f6] px-2 py-0.5 text-[10px] font-semibold lowercase text-white"
              >
                {TAG_LABELS[tag]}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-2 px-3 pb-3 pt-2.5">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-white/90">
            {formatPrice(product.basePrice)}
          </p>
        </div>
        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/70">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
