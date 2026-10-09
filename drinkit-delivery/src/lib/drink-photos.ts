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
 * Matches against the current pickup/hall catalog.
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
    productId: "iced-spanish-latte",
    hallName: "Айс испанский латте",
    primary: drinks("0134"),
    alt: drinks("0135"),
    diskFiles: ["0134.jpg", "0135.jpg"],
  },
  {
    productId: "cocoa-classic",
    hallName: "Классическое какао",
    primary: drinks("0136"),
    alt: drinks("0137"),
    diskFiles: ["0136.jpg", "0137.jpg"],
  },
  {
    productId: "milkshake-chocolate",
    hallName: "Шоколадный милкшейк",
    primary: drinks("0140"),
    alt: drinks("0141"),
    diskFiles: ["0140.jpg", "0141.jpg"],
  },
  {
    productId: "pistachio-latte",
    hallName: "Фисташковый латте",
    primary: drinks("0142"),
    alt: drinks("0143"),
    diskFiles: ["0142.jpg", "0143.jpg"],
  },
  {
    productId: "matcha-latte",
    hallName: "Матча латте",
    primary: drinks("0144"),
    alt: drinks("0145"),
    diskFiles: ["0144.jpg", "0145.jpg"],
  },
  {
    productId: "espresso-tonic",
    hallName: "Эспрессо тоник",
    primary: drinks("0146"),
    alt: drinks("0147"),
    diskFiles: ["0146.jpg", "0147.jpg"],
  },
  {
    productId: "smoothie-berry",
    hallName: "Ягодный заряд",
    primary: drinks("0152"),
    alt: drinks("0153"),
    diskFiles: ["0152.jpg", "0153.jpg"],
  },
  {
    productId: "tea-raspberry-mint",
    hallName: "Малина · Мята",
    primary: drinks("0154"),
    alt: drinks("0155"),
    diskFiles: ["0154.jpg", "0155.jpg"],
  },
  {
    productId: "tea-sea-buckthorn",
    hallName: "Облепиха · Апельсин",
    primary: drinks("0156"),
    alt: drinks("0157"),
    diskFiles: ["0156.jpg", "0157.jpg"],
  },
  {
    productId: "tea-ginger-lime",
    hallName: "Имбирь · Лайм · Мёд",
    primary: drinks("0158"),
    alt: drinks("0159"),
    diskFiles: ["0158.jpg", "0159.jpg"],
  },
  {
    productId: "peach-jasmine-drink",
    hallName: "Персик · Жасмин",
    primary: drinks("0166"),
    alt: drinks("0167"),
    diskFiles: ["0166.jpg", "0167.jpg"],
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
  {
    productId: "smoothie-green",
    hallName: "Зелёная энергия",
    primary: drinks("0150"),
    alt: drinks("0151"),
    diskFiles: ["0150.jpg", "0151.jpg"],
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
