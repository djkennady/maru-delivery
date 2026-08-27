import Image from "next/image";
import { VenueLogo } from "@/components/VenueLogo";
import type { Venue } from "@/types/venue";
import type { VenueTheme } from "@/types/venue-theme";
import type { Locale } from "@/types/venue";
import { localized } from "@/lib/i18n-utils";

interface VenueHeroProps {
  venue: Venue;
  theme: VenueTheme;
  locale: Locale;
  cityLabel: string;
  tall?: boolean;
}

export function VenueHero({
  venue,
  theme,
  locale,
  cityLabel,
  tall = true,
}: VenueHeroProps) {
  return (
    <div className={`relative overflow-hidden ${tall ? "h-56 sm:h-72" : "h-40 sm:h-48"}`}>
      <Image
        src={venue.coverImage}
        alt={localized(venue.brand, locale)}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{ background: theme.heroOverlay }}
      />
      {venue.logo && (
        <div className="absolute right-4 top-4">
          <VenueLogo
            src={venue.logo}
            alt={localized(venue.brand, locale)}
            className="h-16 w-16 rounded-2xl bg-black/40 ring-1 ring-white/20 backdrop-blur-sm sm:h-20 sm:w-20"
            sizes="80px"
            priority
          />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-venue-accent">
          {cityLabel}
        </p>
        <h1 className="font-display text-3xl font-bold text-venue-text sm:text-4xl">
          {localized(venue.brand, locale)}
        </h1>
        {tall && (
          <p className="mt-1 text-sm text-venue-muted">
            {localized(venue.tagline, locale)}
          </p>
        )}
      </div>
    </div>
  );
}
