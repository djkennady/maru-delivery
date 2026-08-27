"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { localized } from "@/lib/i18n-utils";
import type { Venue, MenuCategory } from "@/types/venue";
import type { VenueTheme } from "@/types/venue-theme";

interface MenuViewProps {
  venue: Venue;
  theme: VenueTheme;
}

export function MenuView({ venue, theme }: MenuViewProps) {
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
                ? "venue-btn-primary"
                : "venue-btn-ghost border text-venue-muted hover:text-venue-text"
            }`}
          >
            {localized(cat.name, locale)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {venue.menu
          .find((c) => c.id === activeCategory)
          ?.items.map((item) => (
            <article key={item.id} className={`p-4 ${theme.cardClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-venue-text">
                      {localized(item.name, locale)}
                    </h3>
                    {item.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide text-venue-accent"
                        style={{ backgroundColor: theme.accentSoft }}
                      >
                        {t(`tags.${tag}`)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-venue-muted">
                    {localized(item.description, locale)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-venue-accent">
                  {formatPrice(item.price)}
                </span>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
