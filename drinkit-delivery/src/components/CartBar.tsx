"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import { formatPrice } from "@/lib/pricing";

export function CartBar() {
  const { itemCount, subtotal, total, isFreeDelivery } = useCart();
  const { settings } = useMenu();

  if (itemCount === 0) return null;

  const remaining = settings.freeDeliveryFrom - subtotal;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto max-w-lg">
        {!isFreeDelivery && remaining > 0 && (
          <p className="mb-2 text-center text-xs text-[var(--muted)]">
            До бесплатной доставки осталось {formatPrice(remaining)}
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
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </Link>
      </div>
    </div>
  );
}
