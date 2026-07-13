import type { Category } from "@/types/menu";

const pexels = (id: number, w = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const heroVideo =
  "https://videos.pexels.com/video-files/2909919/2909919-sd_640_360_30fps.mp4";

export const heroPoster = pexels(5946077, 1200);

export const heroThumbs = [
  pexels(302899, 400),
  pexels(1006297, 400),
  pexels(291528, 400),
];

const fallbackProductImage = pexels(302899);

const categoryFallbacks: Record<string, string> = {
  breakfast: pexels(1640777, 800),
  coffee: pexels(302899, 800),
  drinks: pexels(1417945, 800),
  food: pexels(1279330, 800),
  desserts: pexels(291528, 800),
};

export const galleryImages = [
  { src: pexels(6612575, 700), alt: "Уютный зал кофейни МАРУ" },
  { src: pexels(4790880, 500), alt: "Барista готовит напиток у стойки" },
  { src: pexels(2074130, 500), alt: "Стойка с кофемашиной и зерном" },
];

export function getProductImage(productId: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  return fallbackProductImage;
}

export function getCategoryImage(
  categoryId: string,
  category?: Pick<Category, "imageUrl">,
): string {
  if (category?.imageUrl) return category.imageUrl;
  return categoryFallbacks[categoryId] ?? fallbackProductImage;
}

export const promos = [
  {
    id: "happy-hour",
    title: "−15% на кофе",
    subtitle: "С 8:00 до 11:00 каждый день",
    gradient: "from-orange-500 to-rose-500",
    emoji: "☀️",
    image: pexels(302899, 500),
  },
  {
    id: "combo",
    title: "Кофе + круассан",
    subtitle: "Комбо всего за 390 ₽",
    gradient: "from-emerald-500 to-teal-500",
    emoji: "🥐",
    image: pexels(3491546, 500),
  },
  {
    id: "delivery",
    title: "Бесплатная доставка",
    subtitle: "При заказе от 800 ₽",
    gradient: "from-violet-500 to-purple-600",
    emoji: "🚀",
    image: pexels(1640777, 500),
  },
] as const;
