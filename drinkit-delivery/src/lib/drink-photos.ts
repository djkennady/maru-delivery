/**
 * Drink photos for pickup products — only dedicated frames.
 * No stock / sibling sharing: missing SKUs stay empty so gaps are visible.
 *
 * - Numbered `/hall-menu/drinks/NNNN.webp` — Yandex hall catalog pairs
 * - Named `/hall-menu/drinks/*.webp` — owner studio singles
 */

export type DrinkPhotoPair = {
  productId: string;
  hallName: string;
  primary: string;
  alt: string;
  diskFiles: [string, string];
};

const drinks = (id: string) => `/hall-menu/drinks/${id}.webp`;
const studio = (id: string) => `/hall-menu/drinks/${id}.webp`;

const DRINK_CATEGORIES = new Set(["coffee", "drinks"]);

export function isDrinkCategoryId(categoryId: string): boolean {
  return DRINK_CATEGORIES.has(categoryId);
}

/**
 * One primary product per Yandex pair. Beige studio table is the card frame;
 * white sweep is the alt angle. Do not map siblings onto the same files.
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
    productId: "raf-vanilla",
    hallName: "Раф ваниль",
    primary: drinks("0128"),
    alt: drinks("0129"),
    diskFiles: ["0128.jpg", "0129.jpg"],
  },
  {
    productId: "raf-chak-chak",
    hallName: "Раф чак-чак",
    primary: drinks("0130"),
    alt: drinks("0131"),
    diskFiles: ["0130.jpg", "0131.jpg"],
  },
  {
    productId: "spanish-latte",
    hallName: "Испанский латте",
    primary: drinks("0132"),
    alt: drinks("0133"),
    diskFiles: ["0132.jpg", "0133.jpg"],
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
    productId: "milkshake-pistachio",
    hallName: "Фисташковый милкшейк",
    primary: drinks("0138"),
    alt: drinks("0139"),
    diskFiles: ["0138.jpg", "0139.jpg"],
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
    productId: "cold-brew-orange",
    hallName: "Колд брю апельсин",
    primary: drinks("0148"),
    alt: drinks("0149"),
    diskFiles: ["0148.jpg", "0149.jpg"],
  },
  {
    productId: "smoothie-green",
    hallName: "Зелёная энергия",
    primary: drinks("0150"),
    alt: drinks("0151"),
    diskFiles: ["0150.jpg", "0151.jpg"],
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
    productId: "smoothie-tropical",
    hallName: "Тропическое солнце",
    primary: drinks("0160"),
    alt: drinks("0161"),
    diskFiles: ["0160.jpg", "0161.jpg"],
  },
  {
    productId: "mors",
    hallName: "Морс",
    primary: drinks("0164"),
    alt: drinks("0165"),
    diskFiles: ["0164.jpg", "0165.jpg"],
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
    productId: "cold-brew-mango",
    hallName: "Колд брю манго",
    primary: drinks("0170"),
    alt: drinks("0171"),
    diskFiles: ["0170.jpg", "0171.jpg"],
  },
  {
    productId: "cucumber-lime",
    hallName: "Огурец · Лайм",
    primary: drinks("0172"),
    alt: drinks("0173"),
    diskFiles: ["0172.jpg", "0173.jpg"],
  },
];

/** Single studio shots (owner-provided) without a numbered Yandex pair. */
export const STUDIO_DRINK_PHOTOS: { productId: string; hallName: string; path: string }[] = [
  { productId: "americano", hallName: "Американо", path: studio("americano") },
  { productId: "espresso", hallName: "Эспрессо", path: studio("espresso") },
  { productId: "filter-coffee", hallName: "Фильтр-кофе", path: studio("filter-coffee") },
  { productId: "bumble", hallName: "Бамбл", path: studio("bumble") },
];

export const DRINK_PHOTO_BY_PRODUCT_ID: Record<string, string> = {
  ...Object.fromEntries(STUDIO_DRINK_PHOTOS.map((item) => [item.productId, item.path])),
  ...Object.fromEntries(DRINK_PHOTO_PAIRS.map((pair) => [pair.productId, pair.primary])),
};

export function catalogDrinkImageUrl(productId: string): string | undefined {
  return DRINK_PHOTO_BY_PRODUCT_ID[productId];
}

export function hasCatalogDrinkPhoto(productId: string): boolean {
  return Boolean(DRINK_PHOTO_BY_PRODUCT_ID[productId]);
}
