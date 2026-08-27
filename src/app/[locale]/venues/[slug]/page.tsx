import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getVenueBySlug, getCityName } from "@/data/venues";
import { getVenueTheme } from "@/data/venue-themes";
import { localized } from "@/lib/i18n-utils";
import { VenueNav } from "@/components/VenueNav";
import { EventsList } from "@/components/EventsList";
import { VenueHero } from "@/components/VenueHero";
import { MapPin, Phone, Clock, ExternalLink, Instagram } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) return {};

  const brand = localized(venue.brand, locale as "ru" | "en");
  const tagline = localized(venue.tagline, locale as "ru" | "en");

  return {
    title: `${brand} | Bird Network`,
    description: tagline,
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const theme = getVenueTheme(slug);
  const locale = (await getLocale()) as "ru" | "en";
  const t = await getTranslations("venue");

  const mapsUrl = `https://yandex.ru/maps/?pt=${venue.coordinates.lng},${venue.coordinates.lat}&z=16&l=map`;

  return (
    <>
      <div className={theme.heroClass}>
        <VenueHero
          venue={venue}
          theme={theme}
          locale={locale}
          cityLabel={getCityName(venue.city, locale)}
        />
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <section className="mb-8">
          <h2 className="font-display text-xl font-semibold text-venue-text">
            {t("about")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-venue-muted">
            {localized(venue.description, locale)}
          </p>
          <p className="mt-2 text-xs text-venue-muted">
            {t("cuisine")}: {localized(venue.cuisine, locale)}
          </p>
        </section>

        <section className={`mb-8 p-4 ${theme.cardClass}`}>
          <h2 className="mb-3 font-display text-lg font-semibold text-venue-text">
            {t("promotions")}
          </h2>
          <p className="text-sm text-venue-muted">{t("promoText")}</p>
        </section>

        <section className="mb-8 grid gap-3">
          <Link
            href={`/venues/${venue.slug}/menu`}
            className={`venue-btn-ghost flex items-center justify-between px-4 py-3 transition hover:opacity-90 ${theme.cardClass}`}
          >
            <span className="font-medium text-venue-text">{t("viewMenu")}</span>
            <span className="text-sm text-venue-accent">→</span>
          </Link>
          <Link
            href={`/venues/${venue.slug}/booking`}
            className="venue-btn-primary flex items-center justify-center rounded-xl py-3 font-semibold transition hover:opacity-90"
          >
            {t("bookTable")}
          </Link>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-venue-text">
              {t("upcomingEvents")}
            </h2>
            <Link href={`/venues/${venue.slug}/events`} className="text-sm text-venue-accent">
              {t("viewAllEvents")}
            </Link>
          </div>
          <EventsList venue={venue} theme={theme} limit={2} />
        </section>

        <section className={`p-4 ${theme.cardClass}`}>
          <h2 className="mb-4 font-display text-lg font-semibold text-venue-text">
            {t("contacts")}
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 text-venue-muted">
              <MapPin className="h-4 w-4 shrink-0 text-venue-accent" />
              {localized(venue.address, locale)}
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-venue-accent" />
              <a
                href={`tel:${venue.phone.replace(/\s/g, "")}`}
                className="text-venue-text hover:underline"
              >
                {venue.phone}
              </a>
            </li>
            <li className="flex gap-3 text-venue-muted">
              <Clock className="h-4 w-4 shrink-0 text-venue-accent" />
              {localized(venue.hours, locale)}
            </li>
            <li className="flex gap-3">
              <Instagram className="h-4 w-4 shrink-0 text-venue-accent" />
              <a
                href={theme.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-venue-text hover:underline"
              >
                {t("instagram")}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a
              href={`tel:${venue.phone.replace(/\s/g, "")}`}
              className="venue-btn-ghost flex-1 rounded-xl border py-2.5 text-center text-sm font-medium"
            >
              {t("call")}
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-btn-primary flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-center text-sm font-medium"
            >
              {t("route")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </div>

      <VenueNav venue={venue} theme={theme} />
    </>
  );
}
