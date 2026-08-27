import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getVenueBySlug } from "@/data/venues";
import { localized } from "@/lib/i18n-utils";
import { VenueNav } from "@/components/VenueNav";
import { GalleryGrid } from "@/components/GalleryGrid";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const locale = (await getLocale()) as "ru" | "en";
  const t = await getTranslations("gallery");

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-8">
        <p className="text-sm" style={{ color: venue.accentColor }}>
          {localized(venue.brand, locale)}
        </p>
        <h1 className="font-display text-3xl font-bold text-white">{t("title")}</h1>
        <div className="mt-6">
          <GalleryGrid venue={venue} />
        </div>
      </div>
      <VenueNav venue={venue} />
    </>
  );
}
