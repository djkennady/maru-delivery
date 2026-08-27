"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/i18n-utils";
import { getCityName } from "@/data/venues";
import type { Venue } from "@/types/venue";
import { MapPin, ArrowRight } from "lucide-react";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const t = useTranslations("home");
  const locale = useLocale() as "ru" | "en";

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface transition hover:border-white/20 hover:shadow-2xl hover:shadow-black/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={venue.coverImage}
          alt={localized(venue.brand, locale)}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: `${venue.accentColor}cc` }}
        >
          {getCityName(venue.city, locale)}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-colors">
          {localized(venue.brand, locale)}
        </h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">
          {localized(venue.tagline, locale)}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{localized(venue.address, locale)}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gold">
          {t("openVenue")}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
