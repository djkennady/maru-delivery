"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import { FULFILLMENT_MODE } from "@/lib/fulfillment";
import { getProductImage } from "@/lib/media";
import { formatPrice } from "@/lib/pricing";

export function CartBar() {
  const { items, itemCount, subtotal, pickupDiscount, total } = useCart();
  const { getProduct } = useMenu();

  if (itemCount === 0) return null;

  const preview = items.slice(-3).reverse();

  return (
    <div className="drinkit-cart-in pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-4 pt-10 md:px-6">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="pointer-events-auto relative mx-auto max-w-lg md:max-w-xl">
        {FULFILLMENT_MODE === "pickup" && pickupDiscount > 0 ? (
          <p className="mb-2 text-center text-[11px] font-medium text-[#93c5fd]">
            самовывоз −10% · экономия {formatPrice(pickupDiscount)}
          </p>
        ) : null}

        <Link
          href="/checkout"
          className="group flex items-center gap-3 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111]/90 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition hover:border-white/20 active:scale-[0.985]"
        >
          <div className="flex h-14 min-w-[7.5rem] flex-1 items-center gap-3 rounded-[1.35rem] bg-[#3b82f6] px-4 text-white shadow-[0_12px_30px_rgba(59,130,246,0.35)] transition group-hover:brightness-110">
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/70">
                <MapPin className="h-3 w-3" />
                самовывоз
              </p>
              <p className="font-display truncate text-[15px] font-semibold leading-tight">
                {formatPrice(total)}
              </p>
              {pickupDiscount > 0 ? (
                <p className="text-[11px] text-white/65 line-through">
                  {formatPrice(subtotal)}
                </p>
              ) : null}
            </div>
            <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-white/80" />
          </div>

          <div className="relative flex h-14 shrink-0 items-center pr-2">
            <div className="flex items-center">
              {preview.map((item, index) => {
                const product = getProduct(item.productId);
                return (
                  <div
                    key={item.id}
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#111] bg-[#1a1a1a] shadow-lg"
                    style={{
                      marginLeft: index === 0 ? 0 : -14,
                      zIndex: preview.length - index,
                    }}
                  >
                    {getProductImage(item.productId, product?.imageUrl) ? (
                      <Image
                        src={getProductImage(item.productId, product?.imageUrl)}
                        alt={product?.name ?? item.productId}
                        fill
                        quality={95}
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
              {itemCount}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
