import type { Metadata } from "next";
import { HallMenuExperience } from "@/components/hall-menu/HallMenuExperience";

export const metadata: Metadata = {
  title: "МАРУ — меню в зале",
  description:
    "Вкус — в деталях. Меню МАРУ в Алабуге: завтраки, кухня, хоспер, пицца, роллы, десерты и кофе.",
  openGraph: {
    title: "МАРУ — кухня и кофе",
    description: "Вкус — в деталях. Меню МАРУ в Алабуге.",
    images: [{ url: "/hall-menu/og.png", width: 1733, height: 907 }],
  },
};

export default function HallMenuPage() {
  return <HallMenuExperience />;
}
