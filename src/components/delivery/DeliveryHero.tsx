"use client";

import { useTranslations } from "next-intl";
import { Clock, Sparkles, Truck } from "lucide-react";
import { ESTIMATED_MINUTES, FREE_DELIVERY_FROM } from "@/data/delivery-menu";

export function DeliveryHero() {
  const t = useTranslations("delivery");

  return (
    <section className="delivery-theme px-4 pb-4 pt-5">
      <div className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--delivery-accent)] to-[#059669] p-5 text-white shadow-lg shadow-emerald-500/20">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 right-8 h-20 w-20 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              <Sparkles className="h-4 w-4" />
              {t("heroBadge")}
            </div>
            <h1 className="mt-2 text-2xl font-bold leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-2 max-w-xs text-sm text-white/85">
              {t("heroSubtitle")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5" />
                {t("eta", { minutes: ESTIMATED_MINUTES })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                <Truck className="h-3.5 w-3.5" />
                {t("freeDeliveryFrom", { amount: FREE_DELIVERY_FROM })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
