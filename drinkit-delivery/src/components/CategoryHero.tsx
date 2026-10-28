"use client";

import Image from "next/image";
import { getCategoryTheme } from "@/lib/category-theme";
import { getProductCutout } from "@/lib/cutouts";
import {
  coffeeHallCutPoster,
  coffeeHallCutVideo,
  coffeeHallVideo,
  getProductImage,
} from "@/lib/media";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

interface CategoryHeroProps {
  categoryId: string;
  categoryName: string;
  product: Product;
  onSelect: (product: Product) => void;
  direction?: 1 | -1;
}

/** Owner Kling loop is a bumble (orange + espresso), not americano. */
const BUMBLE_VIDEO_PRODUCT_IDS = new Set(["bumble"]);

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
  const useBumbleVideo = BUMBLE_VIDEO_PRODUCT_IDS.has(product.id);

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
        className="drinkit-sheet-wash pointer-events-none absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
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
        <p className="mb-3 text-[11px] font-medium lowercase tracking-[0.2em] text-white/40">
          {categoryName}
        </p>

        <div className="relative aspect-square w-[86%] max-w-[440px] md:max-w-[480px]">
          <div
            className="absolute inset-[18%] rounded-full blur-3xl opacity-70"
            style={{ background: theme.glow }}
          />
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 78% at 50% 48%, #000 58%, transparent 88%)",
              maskImage:
                "radial-gradient(ellipse 72% 78% at 50% 48%, #000 58%, transparent 88%)",
            }}
          >
            {useBumbleVideo ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={coffeeHallCutPoster}
                className="h-full w-full object-contain drop-shadow-[0_36px_70px_rgba(0,0,0,0.6)]"
              >
                <source src={coffeeHallCutVideo} type="video/webm" />
                <source src={coffeeHallVideo} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                unoptimized={Boolean(cutout)}
                className="object-contain drop-shadow-[0_36px_70px_rgba(0,0,0,0.6)]"
                sizes="(max-width: 768px) 86vw, 480px"
              />
            )}
          </div>
        </div>

        <h2 className="font-display mt-3 max-w-[18rem] text-[1.45rem] font-semibold leading-tight text-white md:max-w-md md:text-[1.75rem]">
          {product.name}
        </h2>
        <p className="mt-1.5 text-sm font-medium text-white/55 md:text-[15px]">
          {formatPrice(product.basePrice)}
        </p>
      </button>
    </section>
  );
}
