import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getVenueBySlug } from "@/data/venues";
import { getVenueTheme } from "@/data/venue-themes";
import { VenueNav } from "@/components/VenueNav";
import { EventsList } from "@/components/EventsList";
import { VenueSubpageHeader } from "@/components/VenueSubpageHeader";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const theme = getVenueTheme(slug);
  const locale = (await getLocale()) as "ru" | "en";
  const t = await getTranslations("events");

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-8">
        <VenueSubpageHeader venue={venue} locale={locale} title={t("title")} />
        <EventsList venue={venue} theme={theme} />
      </div>
      <VenueNav venue={venue} theme={theme} />
    </>
  );
}
