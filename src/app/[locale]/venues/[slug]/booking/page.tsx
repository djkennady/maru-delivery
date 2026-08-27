import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getVenueBySlug } from "@/data/venues";
import { getVenueTheme } from "@/data/venue-themes";
import { VenueNav } from "@/components/VenueNav";
import { BookingForm } from "@/components/BookingForm";
import { VenueSubpageHeader } from "@/components/VenueSubpageHeader";
import { Phone } from "lucide-react";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const theme = getVenueTheme(slug);
  const locale = (await getLocale()) as "ru" | "en";
  const t = await getTranslations("booking");
  const tVenue = await getTranslations("venue");

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-8">
        <VenueSubpageHeader venue={venue} locale={locale} title={t("title")} />

        <div
          className={`mt-4 flex items-center gap-2 px-4 py-3 text-sm ${theme.cardClass}`}
        >
          <Phone className="h-4 w-4 shrink-0 text-venue-accent" />
          <span className="text-venue-muted">{tVenue("phone")}:</span>
          <a
            href={`tel:${venue.phone.replace(/\s/g, "")}`}
            className="font-medium text-venue-text hover:underline"
          >
            {venue.phone}
          </a>
        </div>

        <div className="mt-6">
          <BookingForm venue={venue} />
        </div>
      </div>
      <VenueNav venue={venue} theme={theme} />
    </>
  );
}
