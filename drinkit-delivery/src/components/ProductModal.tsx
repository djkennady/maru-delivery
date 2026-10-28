"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  BREAKFAST_UNAVAILABLE_MESSAGE,
  isBreakfastProduct,
} from "@/lib/breakfast-hours";
import { getProductImage } from "@/lib/media";
import { getProductTheme } from "@/lib/product-theme";
import { useBreakfastMenuOpen } from "@/lib/use-breakfast-menu-open";
import {
  formatPrice,
  getDefaultOptions,
  getProductPrice,
} from "@/lib/pricing";
import type {
  CartItemOptions,
  MilkOption,
  Product,
  ProductSize,
} from "@/types/menu";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const SIZES: ProductSize[] = ["s", "m", "l"];
const MILK_OPTIONS: MilkOption[] = ["regular", "oat", "almond", "none"];

const SIZE_LABELS = { s: "S", m: "M", l: "L" } as const;
const MILK_LABELS = {
  regular: "Обычное",
  oat: "Овсяное",
  almond: "Миндальное",
  none: "Без молока",
} as const;

export function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;
  return <ProductModalBody key={product.id} product={product} onClose={onClose} />;
}

function ProductModalBody({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const breakfastOpen = useBreakfastMenuOpen();
  const canOrder = !isBreakfastProduct(product) || breakfastOpen;
  const theme = useMemo(() => getProductTheme(product.id), [product.id]);
  const [options, setOptions] = useState<CartItemOptions>(
    getDefaultOptions(product),
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const unitPrice = getProductPrice(product, options);
  const availableSizes = SIZES.filter((size) => product.sizes?.[size]);

  const handleAdd = () => {
    if (!canOrder) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, options);
    }
    onClose();
  };

  return (
    <div className="drinkit-fade fixed inset-0 z-[100] flex items-stretch justify-center bg-black/80 backdrop-blur-sm">
      <div className="drinkit-sheet-in relative flex h-full w-full max-w-lg flex-col overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${theme.from} 0%, ${theme.mid} 42%, ${theme.to} 100%)`,
          }}
        />
        <div
          className="drinkit-sheet-wash pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 50% 28%, ${theme.wash}, transparent 72%)`,
          }}
        />
        <div
          className="drinkit-sheet-wash-soft pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(180deg, ${theme.wash} 0%, transparent 38%, transparent 62%, ${theme.wash} 100%)`,
          }}
        />

        <div className="relative z-10 flex items-center justify-between px-4 pb-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/15"
            aria-label="Назад"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display max-w-[70%] truncate text-center text-[15px] font-semibold text-white">
            {product.name}
          </h2>
          <span className="h-10 w-10" />
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-36">
          <div
            className="relative mx-auto mt-2 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem]"
            style={{ boxShadow: `0 24px 70px ${theme.ctaShadow}` }}
          >
            <Image
              src={getProductImage(product.id, product.imageUrl)}
              alt={product.name}
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 640px) 92vw, 480px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>

          {product.description?.trim() ? (
            <p className="mt-4 text-center text-sm leading-relaxed text-white/55">
              {product.description}
            </p>
          ) : null}

          {availableSizes.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium lowercase tracking-wide text-white/40">
                размер
              </p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setOptions((prev) => ({ ...prev, size }))}
                    className={`min-w-[4.5rem] shrink-0 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                      options.size === size
                        ? "bg-white text-black"
                        : "bg-white/8 text-white/70"
                    }`}
                  >
                    <span className="block uppercase">{SIZE_LABELS[size]}</span>
                    {product.sizes?.[size] ? (
                      <span className="mt-0.5 block text-[11px] opacity-70">
                        {formatPrice(product.sizes[size])}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.customizable ? (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium lowercase tracking-wide text-white/40">
                молоко
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {MILK_OPTIONS.map((milk) => (
                  <button
                    key={milk}
                    type="button"
                    onClick={() => setOptions((prev) => ({ ...prev, milk }))}
                    className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-[1.25rem] px-2 text-center text-[12px] font-medium transition ${
                      options.milk === milk
                        ? "text-white"
                        : "bg-white/8 text-white/75"
                    }`}
                    style={
                      options.milk === milk
                        ? { backgroundColor: theme.cta }
                        : undefined
                    }
                  >
                    {MILK_LABELS[milk]}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
            <p className="text-sm font-medium text-white/70">Количество</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-6 text-center font-semibold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-6 pt-10">
          {canOrder ? (
            <div className="flex items-center gap-3">
              <p className="rounded-full bg-white/8 px-4 py-3 text-sm font-medium text-white/70">
                самовывоз
              </p>
              <button
                type="button"
                onClick={handleAdd}
                className="flex flex-1 items-center justify-center rounded-full px-5 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
                style={{
                  backgroundColor: theme.cta,
                  boxShadow: `0 12px 30px ${theme.ctaShadow}`,
                }}
              >
                + {formatPrice(unitPrice * quantity)}
              </button>
            </div>
          ) : (
            <p className="rounded-2xl bg-white/8 px-4 py-3 text-center text-sm text-white/55">
              {BREAKFAST_UNAVAILABLE_MESSAGE}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
