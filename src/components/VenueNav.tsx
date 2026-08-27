"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  UtensilsCrossed,
  CalendarDays,
  Images,
  CalendarCheck,
} from "lucide-react";
import type { Venue } from "@/types/venue";
import type { VenueTheme } from "@/types/venue-theme";

interface VenueNavProps {
  venue: Venue;
  theme: VenueTheme;
}

const tabs = [
  { key: "home", href: "", icon: Home, labelKey: "home" as const },
  { key: "menu", href: "/menu", icon: UtensilsCrossed, labelKey: "menu" as const },
  { key: "events", href: "/events", icon: CalendarDays, labelKey: "events" as const },
  { key: "gallery", href: "/gallery", icon: Images, labelKey: "gallery" as const },
  { key: "booking", href: "/booking", icon: CalendarCheck, labelKey: "booking" as const },
];

export function VenueNav({ venue, theme }: VenueNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const base = `/venues/${venue.slug}`;

  return (
    <nav
      aria-label={t("venueNav")}
      className="fixed bottom-0 left-0 right-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      style={{
        borderColor: theme.surfaceBorder,
        backgroundColor: `${theme.background}f2`,
      }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ key, href, icon: Icon, labelKey }) => {
          const path = href ? `${base}${href}` : base;
          const isActive = pathname === path;

          return (
            <Link
              key={key}
              href={path}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--venue-accent)] ${
                isActive ? "text-venue-accent" : "text-venue-muted hover:text-venue-text"
              }`}
            >
              <Icon className="h-5 w-5" />
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
