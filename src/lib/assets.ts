/** Encode path segments for public assets (spaces, Cyrillic in folder names). */
export function publicAsset(...segments: string[]): string {
  return `/${segments.map(encodeURIComponent).join("/")}`;
}

export const NETWORK_LOGO = publicAsset("FC лого", "Future Corp.png");

export const VENUE_LOGOS = {
  "the-bird": publicAsset("FC лого", "The Bird.png"),
  "buddu-lounge": publicAsset("FC лого", "Buddu.png"),
  mare: publicAsset("FC лого", "Mare.png"),
  "chilling-lounge-prospekt": publicAsset("FC лого", "Chilling Lounge.png"),
  "chilling-lounge-torgovy": publicAsset("FC лого", "Chilling Lounge.png"),
  urman: publicAsset("FC лого", "Urman.png"),
  "chillout-ethno-yelabuga": publicAsset("FC лого", "ChillOut Ethno Bar.png"),
  "chillout-resto-almetievsk": publicAsset("FC лого", "ChillOut Resto Club.png"),
  "chilling-lounge-kazan": publicAsset("FC лого", "Chilling Lounge.png"),
} as const;

export function getVenueLogo(slug: string): string | undefined {
  return VENUE_LOGOS[slug as keyof typeof VENUE_LOGOS];
}
