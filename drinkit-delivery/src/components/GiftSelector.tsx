"use client";

import type { ClaimedGift } from "@/lib/loyalty-gifts";
import {
  calculateGiftDiscount,
  calculateOrderTotal,
} from "@/lib/gift-discount";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/types/menu";

interface GiftSelectorProps {
  gifts: ClaimedGift[];
  selectedGiftId: string | null;
  onSelect: (giftId: string | null) => void;
  subtotal: number;
  baseDeliveryFee: number;
  isFreeDelivery: boolean;
  getProduct: (id: string) => Product | undefined;
}

export function GiftSelector({
  gifts,
  selectedGiftId,
  onSelect,
  subtotal,
  baseDeliveryFee,
  isFreeDelivery,
  getProduct,
}: GiftSelectorProps) {
  if (gifts.length === 0) return null;

  const safeSubtotal = Number.isFinite(subtotal) ? subtotal : 0;
  const safeBaseDeliveryFee = Number.isFinite(baseDeliveryFee)
    ? baseDeliveryFee
    : 0;

  const selectedGift = gifts.find((gift) => gift.id === selectedGiftId) ?? null;
  const preview = selectedGift
    ? calculateGiftDiscount(
        selectedGift,
        safeSubtotal,
        safeBaseDeliveryFee,
        isFreeDelivery,
        getProduct,
      )
    : null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-[var(--text)]">Подарок</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Можно применить один подарок — после заказа он исчезнет
        </p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
            selectedGiftId === null
              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
              : "border-[var(--border)] bg-[var(--surface)] hover:border-orange-200"
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--card)] text-lg">
            ✕
          </span>
          <span className="text-sm font-medium text-[var(--text)]">
            Без подарка
          </span>
        </button>

        {gifts.map((gift) => {
          const active = selectedGiftId === gift.id;
          const effect = calculateGiftDiscount(
            gift,
            safeSubtotal,
            safeBaseDeliveryFee,
            isFreeDelivery,
            getProduct,
          );

          return (
            <button
              key={gift.id}
              type="button"
              onClick={() => onSelect(gift.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                active
                  ? "border-[var(--accent-warm)] bg-[var(--accent-warm-soft)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-orange-200"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--card)] text-xl">
                {gift.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-[var(--text)]">
                  {gift.title}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--muted)]">
                  {gift.description}
                </span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-[var(--accent-warm)]">
                {effect.bonusProductName
                  ? "В заказ"
                  : effect.discount > 0
                    ? `−${formatPrice(effect.discount)}`
                    : effect.deliveryFee === 0 && baseDeliveryFee > 0
                      ? "0 ₽ доставка"
                      : "Бонус"}
              </span>
            </button>
          );
        })}
      </div>

      {preview && (
        <p className="mt-3 rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)]">
          Применится:{" "}
          <span className="font-medium text-[var(--text)]">{preview.label}</span>
          {preview.bonusProductName ? (
            <>
              {" "}
              · добавим{" "}
              <span className="font-medium text-[var(--text)]">
                {preview.bonusProductName}
              </span>{" "}
              бесплатно
            </>
          ) : preview.discount > 0 ? (
            <> · скидка {formatPrice(preview.discount)}</>
          ) : null}
          {" · "}итого{" "}
          {formatPrice(
            calculateOrderTotal(
              safeSubtotal,
              preview.deliveryFee,
              preview.discount,
            ),
          )}
        </p>
      )}
    </section>
  );
}
