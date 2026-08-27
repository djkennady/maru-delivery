import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getVenueBySlug } from "@/data/venues";
import { getVenueTheme } from "@/data/venue-themes";
import { VenueNav } from "@/components/VenueNav";
import { GalleryGrid } from "@/components/GalleryGrid";
import { VenueSubpageHeader } from "@/components/VenueSubpageHeader";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const theme = getVenueTheme(slug);
  const locale = (await getLocale()) as "ru" | "en";
  const t = await getTranslations("gallery");

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-8">
        <VenueSubpageHeader venue={venue} locale={locale} title={t("title")} />
        <GalleryGrid venue={venue} />
      </div>
      <VenueNav venue={venue} theme={theme} />
    </>
  );
}
