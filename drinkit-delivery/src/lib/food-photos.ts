/** Hall studio dish photos for pickup products (Yandex saturated originals). */
export const FOOD_PHOTO_BY_PRODUCT_ID: Record<string, string> = {
  // Breakfast
  "english-breakfast": "/hall-menu/dishes/0005.webp",
  "french-breakfast": "/hall-menu/dishes/0003.webp",
  "russian-breakfast": "/hall-menu/dishes/0001.webp",
  // Sandwiches
  "sandwich-crispy-chicken": "/hall-menu/dishes/0013.webp",
  "sandwich-roastbeef": "/hall-menu/dishes/0015.webp",
  "croissant-caesar-salmon": "/hall-menu/dishes/0011.webp",
  "sandwich-nutella-banana": "/hall-menu/dishes/0120.webp",
  // Salads
  "salad-caesar-chicken": "/hall-menu/dishes/0036.webp",
  "salad-caesar-shrimp": "/hall-menu/dishes/0034.webp",
  "salad-greek": "/hall-menu/dishes/0028.webp",
  "salad-roastbeef": "/hall-menu/dishes/0024.webp",
  "salad-salmon": "/hall-menu/dishes/0030.webp",
  "salad-shrimp-mango": "/hall-menu/dishes/0032.webp",
  "salad-green": "/hall-menu/dishes/0026.webp",
  // Soups
  "soup-borscht": "/hall-menu/dishes/0050.webp",
  "soup-tom-yum": "/hall-menu/dishes/0052.webp",
  "soup-pumpkin": "/hall-menu/dishes/0048.webp",
  // Mains
  "chicken-cutlet-puree": "/hall-menu/dishes/0063.webp",
  "beef-stroganoff": "/hall-menu/dishes/0065.webp",
  "salmon-grill": "/hall-menu/dishes/0061.webp",
  "steak-salmon": "/hall-menu/dishes/0061.webp",
  "burger-beef": "/hall-menu/dishes/0067.webp",
  "pasta-beef": "/hall-menu/dishes/0059.webp",
  // Grill / hosper
  "shashlik-chicken-thigh": "/hall-menu/dishes/0106.webp",
  "shashlik-beef": "/hall-menu/dishes/0110.webp",
  "lula-chicken": "/hall-menu/dishes/0108.webp",
  "lula-chicken-cheese": "/hall-menu/dishes/0108.webp",
  "steak-beef-tenderloin": "/hall-menu/dishes/0122.webp",
  // Pizza
  "pizza-pear-gorgonzola": "/hall-menu/dishes/0075.webp",
  "pizza-mushroom": "/hall-menu/dishes/0077.webp",
  "pizza-shrimp-spinach": "/hall-menu/dishes/0073.webp",
  // Rolls
  "roll-tuna-shrimp": "/hall-menu/dishes/0096.webp",
  "roll-caesar-chicken": "/hall-menu/dishes/0104.webp",
  "roll-salmon-mango": "/hall-menu/dishes/0094.webp",
  // Desserts
  "honey-cake": "/hall-menu/dishes/0086.webp",
  "red-velvet": "/hall-menu/dishes/0088.webp",
  "meringue-roll": "/hall-menu/dishes/0084.webp",
  "cheesecake": "/hall-menu/dishes/0092.webp",
  "vanilla-praline": "/hall-menu/dishes/0083.webp",
};

export function catalogFoodImageUrl(
  productId: string,
  imageUrl?: string,
): string | undefined {
  return FOOD_PHOTO_BY_PRODUCT_ID[productId] ?? imageUrl;
}
