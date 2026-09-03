"use client";

import { useMemo, useState } from "react";
import { Check, Clock, Gift, Sparkles } from "lucide-react";
import { GiftOpenModal } from "@/components/GiftOpenModal";
import { useUser } from "@/context/UserContext";
import type { LoyaltyMilestoneAmount } from "@/lib/loyalty";
import { getLoyaltyProgress } from "@/lib/loyalty";
import { formatPrice } from "@/lib/pricing";

function formatMilestone(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function LoyaltyBonusCard() {
  const { orders, claimedGifts, loyaltyPeriodId, hasProfile, claimGift } =
    useUser();
  const [openMilestone, setOpenMilestone] =
    useState<LoyaltyMilestoneAmount | null>(null);

  const progress = useMemo(
    () => getLoyaltyProgress(orders, claimedGifts, loyaltyPeriodId),
    [orders, claimedGifts, loyaltyPeriodId],
  );

  if (!hasProfile) return null;

  const nextGift = progress.unclaimedMilestones[0] ?? null;

  return (
    <>
      <section className="px-4 py-2">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-sm font-medium lowercase text-[var(--text)]">
            бокс с подарками
          </p>

          <article className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-5 text-white shadow-xl shadow-neutral-900/20">
            <div className="pointer-events-none absolute -right-4 -top-2 text-7xl opacity-90">
              🎁
            </div>
            <div className="pointer-events-none absolute right-6 top-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--accent-warm)] to-orange-400 shadow-lg shadow-orange-500/30">
              <Gift className="h-8 w-8 text-white" />
            </div>

            <div className="relative max-w-[72%]">
              <p className="inline-flex items-center gap-1.5 text-xs text-white/65">
                <Clock className="h-3.5 w-3.5" />
                Есть {progress.daysLeft}{" "}
                {progress.daysLeft === 1
                  ? "день"
                  : progress.daysLeft < 5
                    ? "дня"
                    : "дней"}{" "}
                до конца месяца
              </p>

              <p className="mt-3 text-[1.35rem] font-bold leading-tight">
                {nextGift ? (
                  <>У вас есть подарок — откройте его!</>
                ) : progress.allCompleted ? (
                  <>Все подарки получены — вы супер!</>
                ) : (
                  <>
                    ещё {formatPrice(progress.remaining)} до следующего подарка
                  </>
                )}
              </p>

              {nextGift && (
                <button
                  type="button"
                  onClick={() => setOpenMilestone(nextGift)}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Gift className="h-4 w-4 text-[var(--accent-warm)]" />
                  Открыть подарок
                </button>
              )}

              <div className="mt-5">
                <div className="relative h-1.5 rounded-full bg-white/15">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--accent-warm)] via-orange-400 to-[var(--accent)] transition-all duration-700"
                    style={{ width: `${progress.fillPercent}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {progress.milestones.map((milestone) => {
                    const opened = milestone.status === "opened";
                    const ready = milestone.status === "ready";
                    const current = milestone.status === "current";

                    return (
                      <button
                        key={milestone.amount}
                        type="button"
                        disabled={!ready}
                        onClick={() =>
                          ready && setOpenMilestone(milestone.amount)
                        }
                        className={`flex flex-col items-center gap-2 rounded-2xl p-1 transition ${
                          ready
                            ? "cursor-pointer hover:bg-white/10"
                            : "cursor-default"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                            opened
                              ? "border-[var(--accent-warm)] bg-[var(--accent-warm)] text-white"
                              : ready
                                ? "animate-pulse border-[var(--accent-warm)] bg-white/15 text-[var(--accent-warm)] ring-2 ring-[var(--accent-warm)]/40"
                                : current
                                  ? "border-[var(--accent-warm)] bg-white/10 text-[var(--accent-warm)]"
                                  : "border-white/15 bg-white/5 text-white/35"
                          }`}
                        >
                          {opened ? (
                            <Check className="h-4 w-4" strokeWidth={3} />
                          ) : (
                            <Gift className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] ${
                            opened || ready || current
                              ? "font-semibold text-white/85"
                              : "text-white/40"
                          }`}
                        >
                          {formatMilestone(milestone.amount)}
                        </span>
                        {ready && (
                          <span className="text-[9px] font-semibold uppercase tracking-wide text-orange-300">
                            открыть
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {progress.activeRewards.length > 0 && (
                <div className="mt-4 space-y-2">
                  {progress.activeRewards.map((reward) => (
                    <p
                      key={`${reward.milestone}-${reward.rewardId}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs text-white/80"
                    >
                      <span>{reward.emoji}</span>
                      {reward.title}
                    </p>
                  ))}
                </div>
              )}

              <p className="mt-4 inline-flex items-center gap-1 text-xs text-white/50">
                <Sparkles className="h-3.5 w-3.5" />
                Бонусы обнуляются 1-го числа. Потрачено в этом месяце:{" "}
                {formatPrice(progress.spent)}
              </p>
            </div>
          </article>
        </div>
      </section>

      <GiftOpenModal
        milestone={openMilestone}
        onClose={() => setOpenMilestone(null)}
        onClaim={claimGift}
      />
    </>
  );
}
