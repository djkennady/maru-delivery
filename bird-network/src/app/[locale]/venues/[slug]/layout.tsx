import { venues } from "@/data/venues";

export function generateStaticParams() {
  return venues.map((venue) => ({ slug: venue.slug }));
}
