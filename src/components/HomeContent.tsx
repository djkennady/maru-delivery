"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Truck } from "lucide-react";
import { VenueCard } from "@/components/VenueCard";
import { cities, venues } from "@/data/venues";
import type { CityId } from "@/types/venue";

export function HomeContent() {
  const t = useTranslations("home");
  const tCities = useTranslations("cities");
  const locale = useLocale() as "ru" | "en";
  const [cityFilter, setCityFilter] = useState<CityId | "all">("all");

  const filtered =
    cityFilter === "all"
      ? venues
      : venues.filter((v) => v.city === cityFilter);

  const filterBtn = (active: boolean) =>
    active
      ? "bg-gold text-black shadow-sm shadow-gold/20"
      : "border border-white/15 text-muted hover:border-gold/30 hover:text-foreground";

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-8 pt-8 sm:pt-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.14)_0%,_transparent_58%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
            Future Corp
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-muted">{t("heroSubtitle")}</p>
          <p className="mt-2 text-sm text-gold/70">
            {t("venuesCount", { count: venues.length })}
          </p>
          <Link
            href="/delivery"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
          >
            <Truck className="h-4 w-4" />
            {t("deliveryCta")}
          </Link>
        </div>
      </section>

      <section className="sticky top-14 z-40 border-b border-white/10 bg-background/92 px-4 py-3 backdrop-blur-xl sm:top-16">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            aria-pressed={cityFilter === "all"}
            onClick={() => setCityFilter("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${filterBtn(cityFilter === "all")}`}
          >
            {t("filterAll")}
          </button>
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              aria-pressed={cityFilter === city.id}
              onClick={() => setCityFilter(city.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${filterBtn(cityFilter === city.id)}`}
            >
              {tCities(city.id)}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 pb-16">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-surface/80 px-6 py-12 text-center text-muted">
            {t("noVenues")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((venue) => (
              <VenueCard key={venue.slug} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
