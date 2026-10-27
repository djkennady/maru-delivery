/** Local transparent cutouts for Drinkit-style floating heroes. */

const CUTOUT_IDS = new Set([
  "americano",
  "beef-stroganoff",
  "cappuccino",
  "english-breakfast",
  "honey-cake",
  "iced-latte",
  "matcha-latte",
  "pistachio-latte",
  "raf-chak-chak",
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
