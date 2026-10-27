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
    <section className="px-3 pb-2 pt-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="text-[11px] font-medium lowercase tracking-[0.18em] text-white/35">
              for you
            </p>
            <h2 className="text-lg font-semibold lowercase text-white md:text-2xl">
              хиты мару
            </h2>
          </div>
          <p className="text-[11px] font-medium text-[#60a5fa]">самовывоз −10%</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
          {hits.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className="drinkit-rise relative h-[280px] w-[78%] min-w-[78%] max-w-[320px] flex-none overflow-hidden rounded-[1.75rem] text-left transition duration-300 active:scale-[0.98] md:h-[300px] md:w-auto md:min-w-0 md:max-w-none"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={getProductImage(product.id, product.imageUrl)}
                  alt={product.name}
                  fill
                  className="drinkit-ken object-cover"
                  sizes="320px"
                  priority={index === 0}
                />
              </div>
              <div
                className={`drinkit-glow absolute -inset-8 bg-[radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.35),transparent_60%)] ${
                  index % 2 === 0 ? "" : "bg-[radial-gradient(circle_at_50%_80%,rgba(249,115,22,0.28),transparent_60%)]"
                }`}
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
