"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductImage } from "@/lib/media";
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
  oat: "Овсяное +40 ₽",
  almond: "Миндальное +40 ₽",
  none: "Без молока",
} as const;

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [options, setOptions] = useState<CartItemOptions>(
    product ? getDefaultOptions(product) : { size: "m", milk: "regular" },
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setOptions(getDefaultOptions(product));
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const unitPrice = getProductPrice(product, options);
  const availableSizes = SIZES.filter((size) => product.sizes?.[size]);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, options);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Закрыть"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[var(--bg)] shadow-2xl sm:rounded-3xl">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <Image
            src={getProductImage(product.id, product.imageUrl)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/20 to-black/10" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="absolute bottom-4 left-5 text-4xl drop-shadow-lg">
            {product.emoji}
          </span>
        </div>

        <div className="p-5 pt-2">
          <h2 className="text-2xl font-black text-[var(--text)]">{product.name}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{product.description}</p>

        {availableSizes.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-[var(--text)]">
              Размер
            </p>
            <div className="flex gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, size }))}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    options.size === size
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  <span className="block uppercase">{SIZE_LABELS[size]}</span>
                  {product.sizes?.[size] && (
                    <span className="mt-0.5 block text-xs opacity-80">
                      {formatPrice(product.sizes[size])}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.customizable && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-[var(--text)]">
              Молоко
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MILK_OPTIONS.map((milk) => (
                <button
                  key={milk}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, milk }))}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    options.milk === milk
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  {MILK_LABELS[milk]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--text)]">Количество</p>
          <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text)] transition hover:bg-[var(--border)]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-6 text-center font-semibold text-[var(--text)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text)] transition hover:bg-[var(--border)]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-6 flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent)] px-5 py-4 text-white shadow-lg shadow-orange-500/25 transition hover:opacity-95 active:scale-[0.99]"
        >
          <span className="font-semibold">В корзину</span>
          <span className="font-bold">{formatPrice(unitPrice * quantity)}</span>
        </button>
        </div>
      </div>
    </div>
  );
}
