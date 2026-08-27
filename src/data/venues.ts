import type { City, MenuCategory, Venue } from "@/types/venue";
import { getVenueLogo } from "@/lib/assets";

const sampleMenu = (brandRu: string, brandEn: string): MenuCategory[] => [
  {
    id: "starters",
    name: { ru: "Закуски", en: "Starters" },
    items: [
      {
        id: "s1",
        name: { ru: "Тартар из говядины", en: "Beef tartare" },
        description: {
          ru: "Подаётся с тостами и каперсами",
          en: "Served with toast and capers",
        },
        price: 890,
        tags: ["hit"],
      },
      {
        id: "s2",
        name: { ru: "Бurrata с томатами", en: "Burrata with tomatoes" },
        description: {
          ru: "С базиликом и оливковым маслом",
          en: "With basil and olive oil",
        },
        price: 750,
        tags: ["new"],
      },
      {
        id: "s3",
        name: { ru: "Хумус с лавашом", en: "Hummus with flatbread" },
        description: {
          ru: "Домашний хумус, овощи",
          en: "House hummus, vegetables",
        },
        price: 490,
        tags: ["vegan"],
      },
    ],
  },
  {
    id: "mains",
    name: { ru: "Основные блюда", en: "Main courses" },
    items: [
      {
        id: "m1",
        name: { ru: "Стейк рибай", en: "Ribeye steak" },
        description: {
          ru: "300 г, соус на выбор",
          en: "300 g, sauce of your choice",
        },
        price: 2490,
        tags: ["hit"],
      },
      {
        id: "m2",
        name: {
          ru: `Фирменное блюдо ${brandRu}`,
          en: `Signature dish — ${brandEn}`,
        },
        description: {
          ru: "Авторский рецепт шеф-повара",
          en: "Chef's signature recipe",
        },
        price: 1290,
        tags: ["new"],
      },
      {
        id: "m3",
        name: { ru: "Лосось на гриле", en: "Grilled salmon" },
        description: {
          ru: "С овощами и лимонным соусом",
          en: "With vegetables and lemon sauce",
        },
        price: 1590,
      },
    ],
  },
  {
    id: "drinks",
    name: { ru: "Бар", en: "Bar" },
    items: [
      {
        id: "d1",
        name: { ru: "Авторский коктейль", en: "Signature cocktail" },
        description: {
          ru: "Карта бармена",
          en: "Bartender's choice",
        },
        price: 590,
        tags: ["hit"],
      },
      {
        id: "d2",
        name: { ru: "Вино бокал", en: "Wine by the glass" },
        description: {
          ru: "Красное / белое — уточняйте у официанта",
          en: "Red / white — ask your server",
        },
        price: 450,
      },
      {
        id: "d3",
        name: { ru: "Эспрессо", en: "Espresso" },
        description: {
          ru: "Классический",
          en: "Classic",
        },
        price: 190,
      },
    ],
  },
];

const sampleEvents = (venueRu: string, venueEn: string) => [
  {
    id: "e1",
    title: {
      ru: "DJ-вечер",
      en: "DJ Night",
    },
    description: {
      ru: `Живая атмосфера и музыка в ${venueRu}`,
      en: `Live vibes and music at ${venueEn}`,
    },
    date: "2026-06-07",
    time: "21:00",
    image:
      "https://images.unsplash.com/photo-1571266028247-d8c1a4d988af?w=800&q=80",
  },
  {
    id: "e2",
    title: {
      ru: "Вечер вина",
      en: "Wine evening",
    },
    description: {
      ru: "Дегустация и пара к бокалу от сомелье",
      en: "Tasting and food pairing with our sommelier",
    },
    date: "2026-06-14",
    time: "19:00",
    image:
      "https://images.unsplash.com/photo-1510812431400-5747305caf27?w=800&q=80",
  },
  {
    id: "e3",
    title: {
      ru: "Живая музыка",
      en: "Live music",
    },
    description: {
      ru: "Акустический сет и авторские коктейли",
      en: "Acoustic set and signature cocktails",
    },
    date: "2026-06-21",
    time: "20:00",
    image:
      "https://images.unsplash.com/photo-1415201364774-f6f0ff5a9621?w=800&q=80",
  },
];

const sampleGallery = (venueRu: string, venueEn: string) => [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    alt: { ru: `Интерьер ${venueRu}`, en: `Interior of ${venueEn}` },
    category: { ru: "Интерьер", en: "Interior" },
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    alt: { ru: "Подаваемые блюда", en: "Plated dishes" },
    category: { ru: "Кухня", en: "Food" },
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
    alt: { ru: "Барная стойка", en: "Bar counter" },
    category: { ru: "Бар", en: "Bar" },
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    alt: { ru: "Атмосфера вечера", en: "Evening atmosphere" },
    category: { ru: "Атмосфера", en: "Ambience" },
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    alt: { ru: "Коктейли", en: "Cocktails" },
    category: { ru: "Бар", en: "Bar" },
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    alt: { ru: "Команда", en: "Team" },
    category: { ru: "Команда", en: "Team" },
  },
];

export const cities: City[] = [
  {
    id: "naberezhnye-chelny",
    name: { ru: "Набережные Челны", en: "Naberezhnye Chelny" },
  },
  { id: "yelabuga", name: { ru: "Елабуга", en: "Yelabuga" } },
  { id: "almetievsk", name: { ru: "Альметьевск", en: "Almetyevsk" } },
  { id: "kazan", name: { ru: "Казань", en: "Kazan" } },
];

export const venues: Venue[] = [
  {
    slug: "the-bird",
    brand: { ru: "The Bird", en: "The Bird" },
    tagline: {
      ru: "Гастропаб с авторской кухней",
      en: "Gastropub with signature cuisine",
    },
    description: {
      ru: "The Bird — место, где встречаются крафтовое пиво, авторские блюда и живая атмосфера. Идеально для вечера с друзьями или неформального ужина.",
      en: "The Bird is where craft beer, signature dishes and a lively atmosphere come together. Perfect for an evening with friends or a casual dinner.",
    },
    city: "naberezhnye-chelny",
    address: {
      ru: "г. Набережные Челны, пр. Набережночелнинский, 23",
      en: "23 Naberezhnochelninsky Ave, Naberezhnye Chelny",
    },
    phone: "+7 (8552) 40-00-01",
    email: "thebird@birdnetwork.ru",
    hours: { ru: "Пн–Чт 12:00–00:00, Пт–Сб 12:00–02:00, Вс 12:00–23:00", en: "Mon–Thu 12:00–00:00, Fri–Sat 12:00–02:00, Sun 12:00–23:00" },
    coordinates: { lat: 55.7436, lng: 52.3958 },
    coverImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    cuisine: { ru: "Европейская, гастропаб", en: "European, gastropub" },
    menu: sampleMenu("The Bird", "The Bird"),
    events: sampleEvents("The Bird", "The Bird"),
    gallery: sampleGallery("The Bird", "The Bird"),
  },
  {
    slug: "buddu-lounge",
    brand: { ru: "Buddu Lounge", en: "Buddu Lounge" },
    tagline: {
      ru: "Панорамный лаунж с коктейльной картой",
      en: "Panoramic lounge with a cocktail menu",
    },
    description: {
      ru: "Buddu Lounge — стильное пространство с панорамным видом, авторскими коктейлями и лёгкими закусками. Место для расслабленного вечера.",
      en: "Buddu Lounge is a stylish space with panoramic views, signature cocktails and light bites. A place to unwind in the evening.",
    },
    city: "naberezhnye-chelny",
    address: {
      ru: "г. Набережные Челны, бульвар Тукая, 15",
      en: "15 Tukay Blvd, Naberezhnye Chelny",
    },
    phone: "+7 (8552) 40-00-02",
    email: "buddu@birdnetwork.ru",
    hours: { ru: "Ежедневно 14:00–02:00", en: "Daily 14:00–02:00" },
    coordinates: { lat: 55.7489, lng: 52.4534 },
    coverImage:
      "https://images.unsplash.com/photo-1572116469696-31de07719d2c?w=1200&q=80",
    cuisine: { ru: "Коктейль-bar, fusion", en: "Cocktail bar, fusion" },
    menu: sampleMenu("Buddu Lounge", "Buddu Lounge"),
    events: sampleEvents("Buddu Lounge", "Buddu Lounge"),
    gallery: sampleGallery("Buddu Lounge", "Buddu Lounge"),
  },
  {
    slug: "mare",
    brand: { ru: "Mare", en: "Mare" },
    tagline: {
      ru: "Ресторан морской кухни",
      en: "Seafood restaurant",
    },
    description: {
      ru: "Mare — ресторан с акцентом на морепродукты и свежую рыбу. Элегантная подача, сезонное меню и уютная атмосфера.",
      en: "Mare is a restaurant focused on seafood and fresh fish. Elegant presentation, seasonal menu and a cozy atmosphere.",
    },
    city: "naberezhnye-chelny",
    address: {
      ru: "г. Набережные Челны, пр. Мира, 88",
      en: "88 Mira Ave, Naberezhnye Chelny",
    },
    phone: "+7 (8552) 40-00-03",
    email: "mare@birdnetwork.ru",
    hours: { ru: "Ежедневно 12:00–23:00", en: "Daily 12:00–23:00" },
    coordinates: { lat: 55.7512, lng: 52.4098 },
    coverImage:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    cuisine: { ru: "Морепродукты, средиземноморская", en: "Seafood, Mediterranean" },
    menu: sampleMenu("Mare", "Mare"),
    events: sampleEvents("Mare", "Mare"),
    gallery: sampleGallery("Mare", "Mare"),
  },
  {
    slug: "chilling-lounge-prospekt",
    brand: { ru: "Chilling Lounge", en: "Chilling Lounge" },
    tagline: {
      ru: "Лаунж на проспеке — первая точка",
      en: "Lounge on the avenue — first location",
    },
    description: {
      ru: "Chilling Lounge на проспеке — камерная атмосфера, кальяны, коктейли и живая музыка по выходным.",
      en: "Chilling Lounge on the avenue — intimate vibes, hookah, cocktails and live music on weekends.",
    },
    city: "naberezhnye-chelny",
    address: {
      ru: "г. Набережные Челны, пр. Набережночелнинский, 54",
      en: "54 Naberezhnochelninsky Ave, Naberezhnye Chelny",
    },
    phone: "+7 (8552) 40-00-04",
    email: "chilling-prospekt@birdnetwork.ru",
    hours: { ru: "Ежедневно 15:00–03:00", en: "Daily 15:00–03:00" },
    coordinates: { lat: 55.7398, lng: 52.4012 },
    coverImage:
      "https://images.unsplash.com/photo-1571266028247-d8c1a4d988af?w=1200&q=80",
    cuisine: { ru: "Лаунж, коктейли", en: "Lounge, cocktails" },
    menu: sampleMenu("Chilling Lounge", "Chilling Lounge"),
    events: sampleEvents("Chilling Lounge", "Chilling Lounge"),
    gallery: sampleGallery("Chilling Lounge", "Chilling Lounge"),
  },
  {
    slug: "chilling-lounge-torgovy",
    brand: { ru: "Chilling Lounge", en: "Chilling Lounge" },
    tagline: {
      ru: "Лаунж в ТРК — вторая точка",
      en: "Lounge at the mall — second location",
    },
    description: {
      ru: "Вторая точка Chilling Lounge в торговом центре. Удобное расположение, тот же стиль и атмосфера.",
      en: "The second Chilling Lounge location in the shopping mall. Convenient location, same style and atmosphere.",
    },
    city: "naberezhnye-chelny",
    address: {
      ru: "г. Набережные Челны, ТРК «Олимп», 2 этаж",
      en: "Olymp Mall, 2nd floor, Naberezhnye Chelny",
    },
    phone: "+7 (8552) 40-00-05",
    email: "chilling-torgovy@birdnetwork.ru",
    hours: { ru: "Ежедневно 12:00–00:00", en: "Daily 12:00–00:00" },
    coordinates: { lat: 55.7556, lng: 52.4678 },
    coverImage:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
    cuisine: { ru: "Лаунж, коктейли", en: "Lounge, cocktails" },
    menu: sampleMenu("Chilling Lounge", "Chilling Lounge"),
    events: sampleEvents("Chilling Lounge", "Chilling Lounge"),
    gallery: sampleGallery("Chilling Lounge", "Chilling Lounge"),
  },
  {
    slug: "urman",
    brand: { ru: "Urman", en: "Urman" },
    tagline: {
      ru: "Пляжный комплекс и ресторан",
      en: "Beach complex & restaurant",
    },
    description: {
      ru: "Urman — пляжный комплекс с рестораном, террасой у воды, летним меню и мероприятиями на открытом воздухе.",
      en: "Urman is a beach complex with a restaurant, waterfront terrace, summer menu and outdoor events.",
    },
    city: "naberezhnye-chelny",
    address: {
      ru: "г. Набережные Челны, пляж «Urman»",
      en: "Urman Beach, Naberezhnye Chelny",
    },
    phone: "+7 (8552) 40-00-06",
    email: "urman@birdnetwork.ru",
    hours: { ru: "Ежедневно 10:00–22:00 (летний сезон)", en: "Daily 10:00–22:00 (summer season)" },
    coordinates: { lat: 55.7123, lng: 52.3789 },
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    cuisine: { ru: "Гриль, летнее меню", en: "Grill, summer menu" },
    menu: sampleMenu("Urman", "Urman"),
    events: sampleEvents("Urman", "Urman"),
    gallery: sampleGallery("Urman", "Urman"),
  },
  {
    slug: "chillout-ethno-yelabuga",
    brand: { ru: "ChillOut ethno bar", en: "ChillOut ethno bar" },
    tagline: {
      ru: "Этно-бар с живой музыкой",
      en: "Ethno bar with live music",
    },
    description: {
      ru: "ChillOut ethno bar в Елабуге — этнические мотивы, авторские настойки, живая музыка и уютный интерьер.",
      en: "ChillOut ethno bar in Yelabuga — ethnic vibes, house infusions, live music and a cozy interior.",
    },
    city: "yelabuga",
    address: {
      ru: "г. Елабуга, ул. Казанская, 12",
      en: "12 Kazanskaya St, Yelabuga",
    },
    phone: "+7 (85557) 5-00-01",
    email: "chillout-yelabuga@birdnetwork.ru",
    hours: { ru: "Чт–Вс 16:00–02:00", en: "Thu–Sun 16:00–02:00" },
    coordinates: { lat: 55.7567, lng: 52.0634 },
    coverImage:
      "https://images.unsplash.com/photo-1415201364774-f6f0ff5a9621?w=1200&q=80",
    cuisine: { ru: "Этно-кухня, бар", en: "Ethnic cuisine, bar" },
    menu: sampleMenu("ChillOut ethno bar", "ChillOut ethno bar"),
    events: sampleEvents("ChillOut ethno bar", "ChillOut ethno bar"),
    gallery: sampleGallery("ChillOut ethno bar", "ChillOut ethno bar"),
  },
  {
    slug: "chillout-resto-almetievsk",
    brand: { ru: "ChillOut resto club", en: "ChillOut resto club" },
    tagline: {
      ru: "Ресторан-клуб с вечеринками",
      en: "Resto club with parties",
    },
    description: {
      ru: "ChillOut resto club — ресторан, клуб и танцпол в одном пространстве. Ужин, афиша и ночная программа.",
      en: "ChillOut resto club — restaurant, club and dance floor in one space. Dinner, events and a night program.",
    },
    city: "almetievsk",
    address: {
      ru: "г. Альметьевск, ул. Ленина, 45",
      en: "45 Lenina St, Almetyevsk",
    },
    phone: "+7 (8553) 30-00-01",
    email: "chillout-almetievsk@birdnetwork.ru",
    hours: { ru: "Пт–Сб 18:00–05:00, остальные дни 12:00–00:00", en: "Fri–Sat 18:00–05:00, other days 12:00–00:00" },
    coordinates: { lat: 54.9014, lng: 52.2973 },
    coverImage:
      "https://images.unsplash.com/photo-1572116469696-31de07719d2c?w=1200&q=80",
    cuisine: { ru: "Клубная кухня, бар", en: "Club cuisine, bar" },
    menu: sampleMenu("ChillOut resto club", "ChillOut resto club"),
    events: sampleEvents("ChillOut resto club", "ChillOut resto club"),
    gallery: sampleGallery("ChillOut resto club", "ChillOut resto club"),
  },
  {
    slug: "chilling-lounge-kazan",
    brand: { ru: "Chilling Lounge", en: "Chilling Lounge" },
    tagline: {
      ru: "Лаунж в центре Казани",
      en: "Lounge in downtown Kazan",
    },
    description: {
      ru: "Chilling Lounge в Казани — стильный лаунж в центре города с коктейльной картой и регулярными событиями.",
      en: "Chilling Lounge in Kazan — a stylish downtown lounge with a cocktail menu and regular events.",
    },
    city: "kazan",
    address: {
      ru: "г. Казань, ул. Баумана, 30",
      en: "30 Baumana St, Kazan",
    },
    phone: "+7 (843) 200-00-01",
    email: "chilling-kazan@birdnetwork.ru",
    hours: { ru: "Ежедневно 14:00–02:00", en: "Daily 14:00–02:00" },
    coordinates: { lat: 55.7887, lng: 49.1221 },
    coverImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    cuisine: { ru: "Лаунж, коктейли", en: "Lounge, cocktails" },
    menu: sampleMenu("Chilling Lounge", "Chilling Lounge"),
    events: sampleEvents("Chilling Lounge Kazan", "Chilling Lounge Kazan"),
    gallery: sampleGallery("Chilling Lounge Kazan", "Chilling Lounge Kazan"),
  },
].map((venue) => ({
  ...venue,
  logo: getVenueLogo(venue.slug),
})) as Venue[];

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug);
}

export function getVenuesByCity(cityId: string): Venue[] {
  return venues.filter((v) => v.city === cityId);
}

export function getCityName(cityId: string, locale: "ru" | "en"): string {
  const city = cities.find((c) => c.id === cityId);
  return city ? city.name[locale] : cityId;
}
