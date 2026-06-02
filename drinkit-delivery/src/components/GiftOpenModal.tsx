"use client";

import { useEffect, useState } from "react";
import { Gift, Sparkles, X } from "lucide-react";
import {
  LOYALTY_GIFT_OPTIONS,
  type LoyaltyGiftOption,
  type LoyaltyMilestoneAmount,
} from "@/lib/loyalty-gifts";
import { formatPrice } from "@/lib/pricing";

interface GiftOpenModalProps {
  milestone: LoyaltyMilestoneAmount | null;
  onClose: () => void;
  onClaim: (milestone: LoyaltyMilestoneAmount, reward: LoyaltyGiftOption) => void;
}

export function GiftOpenModal({
  milestone,
  onClose,
  onClaim,
}: GiftOpenModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!milestone) return;
    setSelectedId(null);
    setRevealed(false);
  }, [milestone]);

  if (!milestone) return null;

  const options = LOYALTY_GIFT_OPTIONS[milestone];
  const selected = options.find((option) => option.id === selectedId) ?? null;

  const handleClaim = () => {
    if (!selected) return;
    setRevealed(true);
    onClaim(milestone, selected);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Закрыть"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[var(--bg)] p-5 shadow-2xl sm:rounded-[2rem]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)]"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        {!revealed ? (
          <>
            <div className="mb-5 pt-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--accent-warm)] to-orange-400 text-3xl shadow-lg shadow-orange-500/30">
                🎁
              </div>
              <p className="text-sm font-medium lowercase text-[var(--muted)]">
                подарок разблокирован
              </p>
              <h2 className="mt-1 text-2xl font-black text-[var(--text)]">
                От {formatPrice(milestone)}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Выберите один подарок — он сохранится в вашем кабинете
              </p>
            </div>

            <div className="space-y-3">
              {options.map((option) => {
                const active = selectedId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedId(option.id)}
                    className={`flex w-full items-center gap-4 rounded-[1.25rem] border p-4 text-left transition ${
                      active
                        ? "border-[var(--accent-warm)] bg-[var(--accent-warm-soft)] shadow-md shadow-orange-500/10"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-orange-200"
                    }`}
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface)] text-2xl">
                      {option.emoji}
                    </span>
                    <span>
                      <span className="block font-bold text-[var(--text)]">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selected}
              onClick={handleClaim}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent)] px-5 py-4 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Открыть подарок
            </button>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 animate-bounce items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[var(--accent)] to-emerald-600 text-4xl shadow-xl shadow-emerald-500/30">
              {selected?.emoji}
            </div>
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
              <Sparkles className="h-4 w-4" />
              Подарок ваш!
            </p>
            <h2 className="mt-2 text-2xl font-black text-[var(--text)]">
              {selected?.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {selected?.description}
            </p>
            <p className="mt-4 rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)]">
              Покажите подарок при следующем заказе или найдите его в личном
              кабинете
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white transition hover:bg-neutral-800"
            >
              Отлично
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
