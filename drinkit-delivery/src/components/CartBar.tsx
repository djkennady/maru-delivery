"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FULFILLMENT_MODE } from "@/lib/fulfillment";
import { formatPrice } from "@/lib/pricing";

export function CartBar() {
  const { itemCount, subtotal, pickupDiscount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="drinkit-cart-in fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-transparent px-4 pb-5 pt-8">
      <div className="mx-auto max-w-7xl">
        {FULFILLMENT_MODE === "pickup" && pickupDiscount > 0 ? (
          <p className="mb-2 text-center text-[11px] font-medium text-[#93c5fd]">
            Самовывоз −10%: −{formatPrice(pickupDiscount)}
          </p>
        ) : null}
        <Link
          href="/checkout"
          className="flex w-full items-center justify-between rounded-full bg-[#3b82f6] px-5 py-4 text-white shadow-lg shadow-blue-500/35 transition hover:brightness-110 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-2 text-sm font-bold">
              {itemCount}
            </span>
            <span className="font-semibold">К самовывозу</span>
          </div>
          <span className="flex flex-col items-end leading-tight">
            {pickupDiscount > 0 ? (
              <span className="text-xs font-medium text-white/70 line-through">
                {formatPrice(subtotal)}
              </span>
            ) : null}
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
