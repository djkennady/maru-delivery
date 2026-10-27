"use client";

import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { BREAKFAST_CATEGORY_ID } from "@/lib/breakfast-hours";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import { useBreakfastMenuOpen } from "@/lib/use-breakfast-menu-open";
import type { Product } from "@/types/menu";

interface FeaturedHitsProps {
  onSelect: (product: Product) => void;
}

export function FeaturedHits({ onSelect }: FeaturedHitsProps) {
  const { products } = useMenu();
  const breakfastOpen = useBreakfastMenuOpen();
  const hits = products
    .filter((product) => product.tags?.includes("hit"))
    .filter(
      (product) =>
        breakfastOpen || product.categoryId !== BREAKFAST_CATEGORY_ID,
    )
    .slice(0, 8);

  if (hits.length === 0) return null;

  return (
    <section className="px-3 pb-2 pt-3">
      <div className="mx-auto max-w-lg">
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="text-[11px] font-medium lowercase tracking-[0.18em] text-white/35">
              for you
            </p>
            <h2 className="text-lg font-semibold lowercase text-white">
              хиты мару
            </h2>
          </div>
          <p className="text-[11px] font-medium text-[#60a5fa]">самовывоз −10%</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {hits.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className="relative h-[280px] w-[78%] min-w-[78%] max-w-[320px] flex-none overflow-hidden rounded-[1.75rem] text-left"
            >
              <Image
                src={getProductImage(product.id, product.imageUrl)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="320px"
                priority={index === 0}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  index % 2 === 0
                    ? "from-[#3b1d0f]/95 via-black/20 to-transparent"
                    : "from-[#1a1030]/95 via-black/20 to-transparent"
                }`}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                  хит
                </p>
                <h3 className="mt-1 text-xl font-semibold leading-tight text-white">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/85">
                  {formatPrice(product.basePrice)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
