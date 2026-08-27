"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { localized } from "@/lib/i18n-utils";
import type { Venue } from "@/types/venue";
import { Calendar, Clock } from "lucide-react";

interface EventsListProps {
  venue: Venue;
  limit?: number;
}

export function EventsList({ venue, limit }: EventsListProps) {
  const t = useTranslations("events");
  const locale = useLocale() as "ru" | "en";
  const events = limit ? venue.events.slice(0, limit) : venue.events;

  if (events.length === 0) {
    return <p className="text-muted">{t("empty")}</p>;
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "long",
    });

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <article
          key={event.id}
          className="overflow-hidden rounded-2xl border border-white/10 bg-surface"
        >
          <div className="relative aspect-[2/1]">
            <Image
              src={event.image}
              alt={localized(event.title, locale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white">
              {localized(event.title, locale)}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {localized(event.description, locale)}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" style={{ color: venue.accentColor }} />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" style={{ color: venue.accentColor }} />
                {event.time}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
