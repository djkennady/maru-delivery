"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FULFILLMENT_MODE } from "@/lib/fulfillment";
import { formatPrice } from "@/lib/pricing";

export function CartBar() {
  const { itemCount, subtotal, pickupDiscount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto max-w-lg">
        {FULFILLMENT_MODE === "pickup" && pickupDiscount > 0 && (
          <p className="mb-2 text-center text-xs font-medium text-[var(--accent)]">
            Скидка 10% за самовывоз: −{formatPrice(pickupDiscount)}
          </p>
        )}
        <Link
          href="/checkout"
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent)] px-5 py-4 text-white shadow-lg shadow-orange-500/30 transition hover:opacity-95 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-2 text-sm font-bold">
              {itemCount}
            </span>
            <span className="font-semibold">Оформить заказ</span>
          </div>
          <span className="flex flex-col items-end leading-tight">
            {pickupDiscount > 0 && (
              <span className="text-xs font-medium text-white/70 line-through">
                {formatPrice(subtotal)}
              </span>
            )}
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
