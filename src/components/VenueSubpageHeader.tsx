import type { Venue } from "@/types/venue";
import type { Locale } from "@/types/venue";
import { localized } from "@/lib/i18n-utils";

interface VenueSubpageHeaderProps {
  venue: Venue;
  locale: Locale;
  title: string;
}

export function VenueSubpageHeader({
  venue,
  locale,
  title,
}: VenueSubpageHeaderProps) {
  return (
    <header className="mb-6">
      <p className="text-sm text-venue-accent">
        {localized(venue.brand, locale)}
      </p>
      <h1 className="font-display text-3xl font-bold text-venue-text">
        {title}
      </h1>
    </header>
  );
}
