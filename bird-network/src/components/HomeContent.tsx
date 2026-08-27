"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-8 pt-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.12)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-muted">{t("heroSubtitle")}</p>
          <p className="mt-2 text-sm text-gold/80">
            {t("venuesCount", { count: venues.length })}
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b border-white/10 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => setCityFilter("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              cityFilter === "all"
                ? "bg-gold text-black"
                : "border border-white/15 text-muted hover:text-white"
            }`}
          >
            {t("filterAll")}
          </button>
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => setCityFilter(city.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                cityFilter === city.id
                  ? "bg-gold text-black"
                  : "border border-white/15 text-muted hover:text-white"
              }`}
            >
              {tCities(city.id)}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue) => (
            <VenueCard key={venue.slug} venue={venue} />
          ))}
        </div>
      </section>
    </>
  );
}
