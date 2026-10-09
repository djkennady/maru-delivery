/** Stable public paths for Yandex Disk originals 0126–0173, optimized to WebP. */

export type DrinkPhotoPair = {
  productId: string;
  hallName: string;
  primary: string;
  alt: string;
  diskFiles: [string, string];
};

const drinks = (id: string) => `/hall-menu/drinks/${id}.webp`;

/**
 * Only unambiguous matches against current pickup/hall catalog.
 * Beige studio table is the shared card background; white sweep is the alt angle.
 */
export const DRINK_PHOTO_PAIRS: DrinkPhotoPair[] = [
  {
    productId: "iced-latte",
    hallName: "Айс латте",
    primary: drinks("0127"),
    alt: drinks("0126"),
    diskFiles: ["0126.jpg", "0127.jpg"],
  },
  {
    productId: "raf-chak-chak",
    hallName: "Раф чак-чак",
    primary: drinks("0130"),
    alt: drinks("0131"),
    diskFiles: ["0130.jpg", "0131.jpg"],
  },
  {
    productId: "espresso-tonic",
    hallName: "Эспрессо тоник",
    primary: drinks("0146"),
    alt: drinks("0147"),
    diskFiles: ["0146.jpg", "0147.jpg"],
  },
  {
    productId: "smoothie-green",
    hallName: "Зелёная энергия",
    primary: drinks("0150"),
    alt: drinks("0151"),
    diskFiles: ["0150.jpg", "0151.jpg"],
  },
  {
    productId: "berry-garden",
    hallName: "Ягодный сад",
    primary: drinks("0168"),
    alt: drinks("0169"),
    diskFiles: ["0168.jpg", "0169.jpg"],
  },
  {
    productId: "cucumber-lime",
    hallName: "Огурец · Лайм",
    primary: drinks("0172"),
    alt: drinks("0173"),
    diskFiles: ["0172.jpg", "0173.jpg"],
  },
];

export const DRINK_PHOTO_BY_PRODUCT_ID: Record<string, string> =
  Object.fromEntries(
    DRINK_PHOTO_PAIRS.map((pair) => [pair.productId, pair.primary]),
  );

export function catalogDrinkImageUrl(
  productId: string,
  imageUrl?: string,
): string | undefined {
  return DRINK_PHOTO_BY_PRODUCT_ID[productId] ?? imageUrl;
}
