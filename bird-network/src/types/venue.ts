export type Locale = "ru" | "en";

export type LocalizedString = Record<Locale, string>;

export type CityId =
  | "naberezhnye-chelny"
  | "yelabuga"
  | "almetievsk"
  | "kazan";

export interface MenuItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  tags?: ("hit" | "new" | "vegan" | "spicy")[];
}

export interface MenuCategory {
  id: string;
  name: LocalizedString;
  items: MenuItem[];
}

export interface Event {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  date: string;
  time: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: LocalizedString;
  category: LocalizedString;
}

export interface Venue {
  slug: string;
  brand: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  city: CityId;
  address: LocalizedString;
  phone: string;
  email: string;
  hours: LocalizedString;
  coordinates: { lat: number; lng: number };
  coverImage: string;
  accentColor: string;
  cuisine: LocalizedString;
  menu: MenuCategory[];
  events: Event[];
  gallery: GalleryImage[];
}

export interface City {
  id: CityId;
  name: LocalizedString;
}
