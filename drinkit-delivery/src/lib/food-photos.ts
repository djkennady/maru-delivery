/**
 * Food photos for pickup products — only dedicated frames.
 * No sibling sharing: missing SKUs stay empty so gaps are visible.
 *
 * - Numbered `/hall-menu/dishes/NNNN.webp` — Yandex saturated hall catalog
 * - `/hall-menu/dishes/studio/*.webp` — owner studio pack
 */

const hall = (id: string) => `/hall-menu/dishes/${id}.webp`;
const studio = (id: string) => `/hall-menu/dishes/studio/${id}.webp`;

const FOOD_CATEGORIES = new Set(["breakfast", "food", "desserts"]);

export function isFoodCategoryId(categoryId: string): boolean {
  return FOOD_CATEGORIES.has(categoryId);
}

/** Hall numbered — one primary photo per product (from hall menu pairs). */
const HALL_FOOD_PHOTOS: Record<string, string> = {
  "english-breakfast": hall("0005"),
  "french-breakfast": hall("0003"),
  "russian-breakfast": hall("0001"),
  "sandwich-crispy-chicken": hall("0013"),
  "sandwich-roastbeef": hall("0015"),
  "croissant-caesar-salmon": hall("0011"),
  "sandwich-nutella-banana": hall("0120"),
  "salad-caesar-chicken": hall("0036"),
  "salad-caesar-shrimp": hall("0034"),
  "salad-greek": hall("0028"),
  "salad-roastbeef": hall("0024"),
  "salad-salmon": hall("0030"),
  "salad-shrimp-mango": hall("0032"),
  "salad-green": hall("0026"),
  "soup-borscht": hall("0050"),
  "soup-tom-yum": hall("0052"),
  "soup-pumpkin": hall("0048"),
  "chicken-cutlet-puree": hall("0063"),
  "beef-stroganoff": hall("0065"),
  "salmon-grill": hall("0061"),
  "burger-beef": hall("0067"),
  "pasta-beef": hall("0059"),
  "shashlik-chicken-thigh": hall("0106"),
  "shashlik-beef": hall("0110"),
  "lula-chicken-cheese": hall("0108"),
  "steak-beef-tenderloin": hall("0122"),
  "pizza-pear-gorgonzola": hall("0075"),
  "pizza-mushroom": hall("0077"),
  "pizza-shrimp-spinach": hall("0073"),
  "roll-tuna-shrimp": hall("0096"),
  "roll-caesar-chicken": hall("0104"),
  "roll-salmon-mango": hall("0094"),
  "honey-cake": hall("0086"),
  "red-velvet": hall("0088"),
  "meringue-roll": hall("0084"),
  "cheesecake": hall("0092"),
  "vanilla-praline": hall("0083"),
};

/** Owner studio pack — one frame, one product id (file stem = productId). */
export const STUDIO_FOOD_PHOTOS: { productId: string; path: string }[] = [
  { productId: "roll-dragon", path: studio("roll-dragon") },
  { productId: "pizza-pepperoni", path: studio("pizza-pepperoni") },
  { productId: "pizza-margherita", path: studio("pizza-margherita") },
  { productId: "beef-rus", path: studio("beef-rus") },
  { productId: "crispy-chicken-salad", path: studio("crispy-chicken-salad") },
  { productId: "roll-philadelphia", path: studio("roll-philadelphia") },
  { productId: "roll-classic-salmon", path: studio("roll-classic-salmon") },
  { productId: "pasta-shrimp", path: studio("pasta-shrimp") },
  { productId: "pizza-caesar-chicken", path: studio("pizza-caesar-chicken") },
  { productId: "roll-classic-shrimp", path: studio("roll-classic-shrimp") },
  { productId: "pizza-ham-mushroom", path: studio("pizza-ham-mushroom") },
  { productId: "tuna-grill", path: studio("tuna-grill") },
  { productId: "roll-classic-cucumber", path: studio("roll-classic-cucumber") },
  { productId: "burger-chicken", path: studio("burger-chicken") },
  { productId: "roll-tuna-salmon", path: studio("roll-tuna-salmon") },
  { productId: "pizza-cheese", path: studio("pizza-cheese") },
  { productId: "lula-chicken", path: studio("lula-chicken") },
  { productId: "lula-lamb", path: studio("lula-lamb") },
  { productId: "shashlik-chicken-thigh", path: studio("shashlik-chicken-thigh") },
  { productId: "steak-salmon", path: studio("steak-salmon") },
  { productId: "potato-wedges", path: studio("potato-wedges") },
  { productId: "steak-chicken", path: studio("steak-chicken") },
  { productId: "steak-beef-tenderloin", path: studio("steak-beef-tenderloin") },
  { productId: "grilled-corn", path: studio("grilled-corn") },
  { productId: "fries", path: studio("fries") },
  { productId: "mashed-potato", path: studio("mashed-potato") },
  { productId: "fresh-vegetables", path: studio("fresh-vegetables") },
  { productId: "bread-ciabatta", path: studio("bread-ciabatta") },
  { productId: "grilled-mushrooms", path: studio("grilled-mushrooms") },
  { productId: "bread-wheat", path: studio("bread-wheat") },
  { productId: "bread-borodinsky", path: studio("bread-borodinsky") },
];

export const FOOD_PHOTO_BY_PRODUCT_ID: Record<string, string> = {
  ...HALL_FOOD_PHOTOS,
  ...Object.fromEntries(STUDIO_FOOD_PHOTOS.map((item) => [item.productId, item.path])),
};

export function catalogFoodImageUrl(productId: string): string | undefined {
  return FOOD_PHOTO_BY_PRODUCT_ID[productId];
}

export function hasCatalogFoodPhoto(productId: string): boolean {
  return Boolean(FOOD_PHOTO_BY_PRODUCT_ID[productId]);
}
