import type { Metadata } from "next";
import { HallHub } from "@/components/hall-menu/HallHub";

export const metadata: Metadata = {
  title: "МАРУ — кухня и кофе",
  description:
    "МАРУ в Алабуге: меню в зале и самовывоз со скидкой 10%. Кухня, кофе и живые фото блюд.",
  openGraph: {
    title: "МАРУ — кухня и кофе",
    description: "Вкус — в деталях. Меню и самовывоз в Алабуге.",
    images: [{ url: "/hall-menu/og.png", width: 1733, height: 907 }],
  },
};

export default function HomePage() {
  return <HallHub />;
}
