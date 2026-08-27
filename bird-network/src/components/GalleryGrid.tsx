"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { localized } from "@/lib/i18n-utils";
import type { Venue } from "@/types/venue";

interface GalleryGridProps {
  venue: Venue;
}

export function GalleryGrid({ venue }: GalleryGridProps) {
  const t = useTranslations("gallery");
  const locale = useLocale() as "ru" | "en";

  const categories = [
    { id: "all", label: t("all") },
    ...Array.from(
      new Map(
        venue.gallery.map((img) => [
          localized(img.category, locale),
          localized(img.category, locale),
        ]),
      ).entries(),
    ).map(([id, label]) => ({ id, label })),
  ];

  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? venue.gallery
      : venue.gallery.filter(
          (img) => localized(img.category, locale) === filter,
        );

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === cat.id
                ? "text-black"
                : "border border-white/15 text-muted hover:text-white"
            }`}
            style={
              filter === cat.id
                ? { backgroundColor: venue.accentColor }
                : undefined
            }
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={img.src}
              alt={localized(img.alt, locale)}
              fill
              className="object-cover transition hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
