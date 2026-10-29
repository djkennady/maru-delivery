"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getProductImage, isHallCatalogImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

const TAG_LABELS = { hit: "хит", new: "new" } as const;

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onSelect, index = 0 }: ProductCardProps) {
  const src = getProductImage(product.id, product.imageUrl);
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="drinkit-rise group flex w-full flex-col overflow-hidden rounded-[1.35rem] bg-[var(--card)] text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#222] active:scale-[0.98]"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111]">
        {src ? (
          <Image
            src={src}
            alt={product.name}
            fill
            quality={95}
            unoptimized={isHallCatalogImage(src)}
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#161616]">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/25">
              нет фото
            </span>
          </div>
        )}
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
          <h3 className="font-display line-clamp-2 text-[13px] font-semibold leading-snug text-white">
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
