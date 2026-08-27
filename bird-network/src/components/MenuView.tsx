"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { localized } from "@/lib/i18n-utils";
import type { Venue, MenuCategory } from "@/types/venue";

interface MenuViewProps {
  venue: Venue;
}

export function MenuView({ venue }: MenuViewProps) {
  const t = useTranslations("menu");
  const locale = useLocale() as "ru" | "en";
  const [activeCategory, setActiveCategory] = useState(venue.menu[0]?.id ?? "");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {venue.menu.map((cat: MenuCategory) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat.id
                ? "text-black"
                : "border border-white/15 text-muted hover:text-white"
            }`}
            style={
              activeCategory === cat.id
                ? { backgroundColor: venue.accentColor }
                : undefined
            }
          >
            {localized(cat.name, locale)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {venue.menu
          .find((c) => c.id === activeCategory)
          ?.items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/10 bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-white">
                      {localized(item.name, locale)}
                    </h3>
                    {item.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide"
                        style={{
                          backgroundColor: `${venue.accentColor}22`,
                          color: venue.accentColor,
                        }}
                      >
                        {t(`tags.${tag}`)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {localized(item.description, locale)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-gold">
                  {formatPrice(item.price)}
                </span>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
