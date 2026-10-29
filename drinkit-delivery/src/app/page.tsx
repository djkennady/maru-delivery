import type { Metadata } from "next";
import { connection } from "next/server";
import { HomeContent } from "@/components/HomeContent";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "МАРУ — самовывоз −10%",
  description:
    "МАРУ в Алабуге: кофе, кухня и десерты на самовывоз со скидкой 10%.",
  openGraph: {
    title: "МАРУ — самовывоз −10%",
    description: "Кофе и кухня с собой в Алабуге. Скидка 10% уже в корзине.",
    images: [{ url: "/hall-menu/og.png", width: 1733, height: 907 }],
  },
};

export default async function HomePage() {
  await connection();

  return (
    <div className="drinkit-skin relative isolate min-h-full">
      <SiteHeader variant="drinkit" />
      <HomeContent />
    </div>
  );
}
