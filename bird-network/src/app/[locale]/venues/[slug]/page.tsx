import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getVenueBySlug, getCityName } from "@/data/venues";
import { localized } from "@/lib/i18n-utils";
import { VenueNav } from "@/components/VenueNav";
import { EventsList } from "@/components/EventsList";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const locale = (await getLocale()) as "ru" | "en";
  const t = await getTranslations("venue");

  const mapsUrl = `https://yandex.ru/maps/?pt=${venue.coordinates.lng},${venue.coordinates.lat}&z=16&l=map`;

  return (
    <>
      <div className="relative h-56 sm:h-72">
        <Image
          src={venue.coverImage}
          alt={localized(venue.brand, locale)}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
          <p
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: venue.accentColor }}
          >
            {getCityName(venue.city, locale)}
          </p>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {localized(venue.brand, locale)}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {localized(venue.tagline, locale)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <section className="mb-8">
          <h2 className="font-display text-xl font-semibold text-white">
            {t("about")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {localized(venue.description, locale)}
          </p>
          <p className="mt-2 text-xs text-muted">
            {t("cuisine")}: {localized(venue.cuisine, locale)}
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-white/10 bg-surface p-4">
          <h2 className="mb-3 font-display text-lg font-semibold text-white">
            {t("promotions")}
          </h2>
          <p className="text-sm text-muted">{t("promoText")}</p>
        </section>

        <section className="mb-8 grid gap-3">
          <Link
            href={`/venues/${venue.slug}/menu`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-surface px-4 py-3 transition hover:border-white/20"
          >
            <span className="font-medium text-white">{t("viewMenu")}</span>
            <span className="text-sm" style={{ color: venue.accentColor }}>
              →
            </span>
          </Link>
          <Link
            href={`/venues/${venue.slug}/booking`}
            className="flex items-center justify-center rounded-xl py-3 font-semibold text-black"
            style={{ backgroundColor: venue.accentColor }}
          >
            {t("bookTable")}
          </Link>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-white">
              {t("upcomingEvents")}
            </h2>
            <Link
              href={`/venues/${venue.slug}/events`}
              className="text-sm"
              style={{ color: venue.accentColor }}
            >
              {t("viewAllEvents")}
            </Link>
          </div>
          <EventsList venue={venue} limit={2} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-surface p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">
            {t("contacts")}
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 text-muted">
              <MapPin className="h-4 w-4 shrink-0" style={{ color: venue.accentColor }} />
              {localized(venue.address, locale)}
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0" style={{ color: venue.accentColor }} />
              <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="text-white hover:underline">
                {venue.phone}
              </a>
            </li>
            <li className="flex gap-3 text-muted">
              <Clock className="h-4 w-4 shrink-0" style={{ color: venue.accentColor }} />
              {localized(venue.hours, locale)}
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a
              href={`tel:${venue.phone.replace(/\s/g, "")}`}
              className="flex-1 rounded-xl border border-white/15 py-2.5 text-center text-sm font-medium text-white"
            >
              {t("call")}
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-center text-sm font-medium text-black"
              style={{ backgroundColor: venue.accentColor }}
            >
              {t("route")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </div>

      <VenueNav venue={venue} />
    </>
  );
}
