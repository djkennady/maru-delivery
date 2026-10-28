/** Local transparent cutouts for Drinkit-style floating heroes. */

/** Prefer clean glass/food silhouettes; skip tray shots with messy edges. */
const CUTOUT_IDS = new Set([
  "americano",
  "beef-stroganoff",
  "burger-beef",
  "cappuccino",
  "english-breakfast",
  "espresso-tonic",
  "filter-coffee",
  "honey-cake",
  "iced-latte",
  "matcha-latte",
  "pistachio-latte",
  "roll-hot-caesar",
  "salad-caesar-chicken",
  "salmon-grill",
  "sandwich-crispy-chicken",
  "shashlik-beef",
  "soup-borscht",
  "steak-beef-tenderloin",
  "syrniki",
]);

export function hasProductCutout(productId: string): boolean {
  return CUTOUT_IDS.has(productId);
}

export function getProductCutout(productId: string): string | null {
  if (!CUTOUT_IDS.has(productId)) return null;
  return `/hall-menu/cutouts/${productId}.png`;
}
