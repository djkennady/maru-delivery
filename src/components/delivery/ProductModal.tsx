"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  getDefaultOptions,
  getProductPrice,
} from "@/lib/delivery-pricing";
import { localized } from "@/lib/i18n-utils";
import type {
  DeliveryProduct,
  CartItemOptions,
  MilkOption,
  ProductSize,
} from "@/types/delivery";

interface ProductModalProps {
  product: DeliveryProduct | null;
  onClose: () => void;
}

const SIZES: ProductSize[] = ["s", "m", "l"];
const MILK_OPTIONS: MilkOption[] = ["regular", "oat", "almond", "none"];

export function ProductModal({ product, onClose }: ProductModalProps) {
  const t = useTranslations("delivery");
  const locale = useLocale() as "ru" | "en";
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);

  const unitPrice = getProductPrice(product, options);
  const availableSizes = SIZES.filter((size) => product.sizes?.[size]);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, options);
    }
    onClose();
  };

  return (
    <div className="delivery-theme fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label={t("close")}
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[var(--delivery-bg)] p-5 shadow-2xl sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--delivery-surface)] text-[var(--delivery-muted)] transition hover:text-[var(--delivery-text)]"
          aria-label={t("close")}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-2">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--delivery-accent-soft)] text-5xl">
            {product.emoji}
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--delivery-text)]">
            {localized(product.name, locale)}
          </h2>
          <p className="mt-1 text-center text-sm text-[var(--delivery-muted)]">
            {localized(product.description, locale)}
          </p>
        </div>

        {availableSizes.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-[var(--delivery-text)]">
              {t("size")}
            </p>
            <div className="flex gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, size }))}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    options.size === size
                      ? "border-[var(--delivery-accent)] bg-[var(--delivery-accent-soft)] text-[var(--delivery-accent)]"
                      : "border-[var(--delivery-border)] text-[var(--delivery-muted)] hover:border-[var(--delivery-accent)]/40"
                  }`}
                >
                  <span className="block uppercase">{t(`sizes.${size}`)}</span>
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
            <p className="mb-2 text-sm font-semibold text-[var(--delivery-text)]">
              {t("milk")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MILK_OPTIONS.map((milk) => (
                <button
                  key={milk}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, milk }))}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    options.milk === milk
                      ? "border-[var(--delivery-accent)] bg-[var(--delivery-accent-soft)] text-[var(--delivery-accent)]"
                      : "border-[var(--delivery-border)] text-[var(--delivery-muted)] hover:border-[var(--delivery-accent)]/40"
                  }`}
                >
                  {t(`milkOptions.${milk}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--delivery-text)]">
            {t("quantity")}
          </p>
          <div className="flex items-center gap-3 rounded-full border border-[var(--delivery-border)] bg-[var(--delivery-surface)] px-2 py-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--delivery-text)] transition hover:bg-[var(--delivery-border)]"
              aria-label={t("decrease")}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-6 text-center font-semibold text-[var(--delivery-text)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--delivery-text)] transition hover:bg-[var(--delivery-border)]"
              aria-label={t("increase")}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-6 flex w-full items-center justify-between rounded-2xl bg-[var(--delivery-accent)] px-5 py-4 text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#059669] active:scale-[0.99]"
        >
          <span className="font-semibold">{t("addToCart")}</span>
          <span className="font-bold">
            {formatPrice(unitPrice * quantity)}
          </span>
        </button>
      </div>
    </div>
  );
}
