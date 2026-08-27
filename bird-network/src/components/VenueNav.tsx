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

interface VenueNavProps {
  venue: Venue;
}

const tabs = [
  { key: "home", href: "", icon: Home, labelKey: "home" as const },
  { key: "menu", href: "/menu", icon: UtensilsCrossed, labelKey: "menu" as const },
  { key: "events", href: "/events", icon: CalendarDays, labelKey: "events" as const },
  { key: "gallery", href: "/gallery", icon: Images, labelKey: "gallery" as const },
  { key: "booking", href: "/booking", icon: CalendarCheck, labelKey: "booking" as const },
];

export function VenueNav({ venue }: VenueNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const base = `/venues/${venue.slug}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ key, href, icon: Icon, labelKey }) => {
          const path = href ? `${base}${href}` : base;
          const isActive = pathname === path;

          return (
            <Link
              key={key}
              href={path}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                isActive ? "" : "text-muted hover:text-white"
              }`}
              style={isActive ? { color: venue.accentColor } : undefined}
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
