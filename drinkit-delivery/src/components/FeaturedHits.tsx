"use client";

import Image from "next/image";
import { useMenu } from "@/context/MenuContext";
import { BREAKFAST_CATEGORY_ID } from "@/lib/breakfast-hours";
import { getProductImage, isHallCatalogImage } from "@/lib/media";
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
    <section className="px-3 pb-2 pt-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="text-[11px] font-medium lowercase tracking-[0.18em] text-white/35">
              для тебя
            </p>
            <h2 className="font-display text-lg font-semibold lowercase text-white md:text-2xl">
              хиты мару
            </h2>
          </div>
          <p className="text-[11px] font-medium text-[#60a5fa]">самовывоз −10%</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
          {hits.map((product, index) => {
            const src = getProductImage(product.id, product.imageUrl);
            return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className="drinkit-rise relative h-[280px] w-[78%] min-w-[78%] max-w-[320px] flex-none overflow-hidden rounded-[1.75rem] text-left transition duration-300 active:scale-[0.98] md:h-[300px] md:w-auto md:min-w-0 md:max-w-none"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="absolute inset-0 overflow-hidden bg-[#161616]">
                {src ? (
                  <Image
                    src={src}
                    alt={product.name}
                    fill
                    quality={95}
                    unoptimized={isHallCatalogImage(src)}
                    className="object-cover transition duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 640px"
                    priority={index === 0}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.14em] text-white/25">
                    нет фото
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                  хит
                </p>
                <h3 className="font-display mt-1 text-xl font-semibold leading-tight text-white">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/85">
                  {formatPrice(product.basePrice)}
                </p>
              </div>
            </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
