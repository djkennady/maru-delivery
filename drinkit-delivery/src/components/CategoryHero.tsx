"use client";

import Image from "next/image";
import { getCategoryTheme } from "@/lib/category-theme";
import { getProductCutout } from "@/lib/cutouts";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

interface CategoryHeroProps {
  categoryId: string;
  categoryName: string;
  product: Product;
  onSelect: (product: Product) => void;
  direction?: 1 | -1;
}

export function CategoryHero({
  categoryId,
  categoryName,
  product,
  onSelect,
  direction = 1,
}: CategoryHeroProps) {
  const theme = getCategoryTheme(categoryId);
  const cutout = getProductCutout(product.id);
  const imageSrc = cutout ?? getProductImage(product.id, product.imageUrl);
  const floating = Boolean(cutout);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.from} 0%, ${theme.mid} 52%, #000 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[75%]"
        style={{
          background: `radial-gradient(85% 65% at 50% 18%, ${theme.glow}, transparent 72%)`,
        }}
      />
      <div
        className="drinkit-sheet-wash pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: theme.glow }}
      />

      <button
        key={`${categoryId}-${product.id}`}
        type="button"
        onClick={() => onSelect(product)}
        className={`relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-8 pt-5 text-center md:px-6 md:pb-10 md:pt-7 ${
          direction < 0 ? "drinkit-hero-slide-left" : "drinkit-hero-slide-right"
        }`}
        aria-label={`${product.name}, ${formatPrice(product.basePrice)}`}
      >
        <p className="mb-4 text-[11px] font-medium lowercase tracking-[0.2em] text-white/40">
          {categoryName}
        </p>

        <div
          className={`drinkit-hero-breath relative ${
            floating
              ? "aspect-square w-[78%] max-w-[360px] md:max-w-[400px]"
              : "aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:max-w-[380px]"
          }`}
        >
          {floating ? (
            <>
              <div
                className="absolute inset-[12%] rounded-full blur-3xl opacity-80"
                style={{ background: theme.glow }}
              />
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                className="object-contain drop-shadow-[0_28px_50px_rgba(0,0,0,0.5)]"
                sizes="(max-width: 768px) 78vw, 400px"
              />
            </>
          ) : (
            <>
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </>
          )}
        </div>

        <h2 className="font-display mt-5 max-w-[18rem] text-[1.45rem] font-semibold leading-tight text-white md:max-w-md md:text-[1.75rem]">
          {product.name}
        </h2>
        <p className="mt-1.5 text-sm font-medium text-white/55 md:text-[15px]">
          {formatPrice(product.basePrice)}
        </p>
      </button>
    </section>
  );
}
