"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/i18n-utils";
import { getCityName } from "@/data/venues";
import { getVenueTheme } from "@/data/venue-themes";
import type { Venue } from "@/types/venue";
import { MapPin, ArrowRight } from "lucide-react";
import { VenueLogo } from "@/components/VenueLogo";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const t = useTranslations("home");
  const locale = useLocale() as "ru" | "en";
  const theme = getVenueTheme(venue.slug);

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="group relative overflow-hidden rounded-2xl transition hover:shadow-2xl hover:shadow-black/40"
      style={{
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.surfaceBorder,
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={venue.coverImage}
          alt={localized(venue.brand, locale)}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: theme.heroOverlay }}
        />
        <div
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: theme.accent, color: theme.buttonText }}
        >
          {getCityName(venue.city, locale)}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3">
          {venue.logo && (
            <VenueLogo
              src={venue.logo}
              alt={localized(venue.brand, locale)}
              className="h-12 w-12 rounded-xl ring-1 ring-white/10"
              sizes="48px"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3
              className="text-xl font-semibold transition-colors group-hover:opacity-90"
              style={{ color: theme.text }}
            >
              {localized(venue.brand, locale)}
            </h3>
            <p className="mt-1 text-sm line-clamp-2" style={{ color: theme.textMuted }}>
              {localized(venue.tagline, locale)}
            </p>
          </div>
        </div>
        <div
          className="mt-3 flex items-center gap-1.5 text-xs"
          style={{ color: theme.textMuted }}
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{localized(venue.address, locale)}</span>
        </div>
        <div
          className="mt-4 flex items-center gap-2 text-sm font-medium"
          style={{ color: theme.accent }}
        >
          {t("openVenue")}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
