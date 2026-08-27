import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getVenueBySlug } from "@/data/venues";
import { localized } from "@/lib/i18n-utils";
import { VenueNav } from "@/components/VenueNav";
import { BookingForm } from "@/components/BookingForm";
import { Phone } from "lucide-react";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const locale = (await getLocale()) as "ru" | "en";
  const t = await getTranslations("booking");
  const tVenue = await getTranslations("venue");

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-8">
        <p className="text-sm" style={{ color: venue.accentColor }}>
          {localized(venue.brand, locale)}
        </p>
        <h1 className="font-display text-3xl font-bold text-white">{t("title")}</h1>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm">
          <Phone className="h-4 w-4 shrink-0" style={{ color: venue.accentColor }} />
          <span className="text-muted">{tVenue("phone")}:</span>
          <a
            href={`tel:${venue.phone.replace(/\s/g, "")}`}
            className="font-medium text-white hover:underline"
          >
            {venue.phone}
          </a>
        </div>

        <div className="mt-6">
          <BookingForm venue={venue} />
        </div>
      </div>
      <VenueNav venue={venue} />
    </>
  );
}
