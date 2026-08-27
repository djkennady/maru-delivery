import { notFound } from "next/navigation";
import { venues } from "@/data/venues";
import { getVenueTheme } from "@/data/venue-themes";
import { getVenueBySlug } from "@/data/venues";
import { VenueThemeShell } from "@/components/VenueThemeShell";

export function generateStaticParams() {
  return venues.map((venue) => ({ slug: venue.slug }));
}

export default async function VenueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const theme = getVenueTheme(slug);

  return <VenueThemeShell theme={theme}>{children}</VenueThemeShell>;
}
