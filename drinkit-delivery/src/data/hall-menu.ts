export type HallKind = "food" | "drinks";

export type HallItem = {
  name: string;
  price: string;
  desc?: string;
  note?: string;
  photo?: string;
  photoAlt?: string;
};

export type HallSection = {
  id: string;
  title: string;
  kind: HallKind;
  note?: string;
  items: HallItem[];
};

export const PICKUP_SITE_URL = "https://maru-delivery.netlify.app/";

export const HALL_SECTIONS: HallSection[] = [
  {
    id: "breakfast",
    title: "Завтраки",
    kind: "food",
    note: "Подаём ежедневно до 11:00",
    items: [
      { name: "Английский завтрак", price: "599 ₽", desc: "Яичница из трёх яиц, куриная колбаска, фасоль BBQ, хашбраун, тост, руккола, черри и сметана", photo: "/hall-menu/dishes/0005.webp", photoAlt: "/hall-menu/dishes/0006.webp" },
      { name: "Французский завтрак", price: "699 ₽", desc: "Омлет, классический круассан, слабосолёный лосось, трюфельный крем, хашбраун, шпинат, черри, сметана и джем", photo: "/hall-menu/dishes/0003.webp", photoAlt: "/hall-menu/dishes/0004.webp" },
      { name: "Русский завтрак", price: "599 ₽", desc: "Скрэмбл, ветчина из индейки, блинчик, пшеничный тост, овощи, сметана, масло и джем", photo: "/hall-menu/dishes/0001.webp", photoAlt: "/hall-menu/dishes/0002.webp" },
      { name: "Собери свой завтрак", price: "399 ₽", desc: "Омлет, скрэмбл или глазунья из трёх яиц с тостом и сливочным маслом" },
      { name: "Блинчики", price: "199 ₽", note: "3 шт." },
      { name: "Сырники", price: "279 ₽", note: "3 шт." },
    ],
  },
  {
    id: "sandwiches",
    title: "Сэндвичи и круассаны",
    kind: "food",
    items: [
      { name: "Сэндвич с хрустящим цыплёнком", price: "449 ₽", desc: "Овощи, романо, соусы блю-чиз и BBQ", photo: "/hall-menu/dishes/0013.webp", photoAlt: "/hall-menu/dishes/0014.webp" },
      { name: "Сэндвич с ростбифом", price: "599 ₽", desc: "Трюфельный крем, огуречный релиш и лук фри", photo: "/hall-menu/dishes/0015.webp", photoAlt: "/hall-menu/dishes/0016.webp" },
      { name: "Круассан а-ля цезарь с лососем", price: "599 ₽", desc: "Слабосолёный лосось, салат, соус цезарь, черри и пармезан", photo: "/hall-menu/dishes/0011.webp", photoAlt: "/hall-menu/dishes/0012.webp" },
      { name: "Сэндвич с нутеллой и бананом", price: "449 ₽", photo: "/hall-menu/dishes/0120.webp", photoAlt: "/hall-menu/dishes/0121.webp" },
      { name: "Круассан с шоколадным кремом", price: "449 ₽" },
    ],
  },
  {
    id: "salads",
    title: "Салаты",
    kind: "food",
    items: [
      { name: "Цезарь с хрустящим цыплёнком", price: "410 ₽", photo: "/hall-menu/dishes/0036.webp", photoAlt: "/hall-menu/dishes/0037.webp" },
      { name: "Цезарь с попкорном из тигровых креветок", price: "690 ₽", photo: "/hall-menu/dishes/0034.webp", photoAlt: "/hall-menu/dishes/0035.webp" },
      { name: "Греческий с кремом из сыра", price: "690 ₽", desc: "Брынза в базиликовой заправке", photo: "/hall-menu/dishes/0028.webp", photoAlt: "/hall-menu/dishes/0029.webp" },
      { name: "С ростбифом и овощами", price: "590 ₽", desc: "В азиатском стиле", photo: "/hall-menu/dishes/0024.webp", photoAlt: "/hall-menu/dishes/0025.webp" },
      { name: "Со слабосолёным лососем", price: "690 ₽", desc: "Овощи, сливочный сыр и гранат", photo: "/hall-menu/dishes/0030.webp", photoAlt: "/hall-menu/dishes/0031.webp" },
      { name: "С попкорном из тигровых креветок", price: "690 ₽", desc: "Манго, овощи и ореховый соус", photo: "/hall-menu/dishes/0032.webp", photoAlt: "/hall-menu/dishes/0033.webp" },
      { name: "Зелёный салат", price: "590 ₽", desc: "В базиликовой заправке", photo: "/hall-menu/dishes/0026.webp", photoAlt: "/hall-menu/dishes/0027.webp" },
    ],
  },
  {
    id: "soups",
    title: "Супы",
    kind: "food",
    items: [
      { name: "Домашний куриный бульон", price: "290 ₽" },
      { name: "Борщ с говядиной", price: "410 ₽", desc: "Бородинский хлеб и сметана", photo: "/hall-menu/dishes/0050.webp", photoAlt: "/hall-menu/dishes/0051.webp" },
      { name: "Том ям с морепродуктами", price: "690 ₽", desc: "Подаётся с рисом", photo: "/hall-menu/dishes/0052.webp", photoAlt: "/hall-menu/dishes/0053.webp" },
      { name: "Грибной крем-суп", price: "410 ₽", desc: "Пармезан и трюфельное масло" },
      { name: "Тыквенный крем-суп", price: "510 ₽", desc: "С тигровыми креветками", photo: "/hall-menu/dishes/0048.webp", photoAlt: "/hall-menu/dishes/0049.webp" },
    ],
  },
  {
    id: "mains",
    title: "Основные блюда",
    kind: "food",
    items: [
      { name: "Хрустящий цыплёнок", price: "690 ₽", desc: "Овощной салат и соус блю-чиз" },
      { name: "Куриная котлета с пюре", price: "690 ₽", desc: "Сливочный демиглас", photo: "/hall-menu/dishes/0063.webp", photoAlt: "/hall-menu/dishes/0064.webp" },
      { name: "Бефстроганов", price: "790 ₽", desc: "Картофельное пюре и огуречный релиш", photo: "/hall-menu/dishes/0065.webp", photoAlt: "/hall-menu/dishes/0066.webp" },
      { name: "Биф а-ля рус", price: "890 ₽", desc: "Перечный соус и свежие овощи" },
      { name: "Стейк лосося гриль", price: "1 310 ₽", desc: "Огуречный салат в греческом йогурте", photo: "/hall-menu/dishes/0061.webp", photoAlt: "/hall-menu/dishes/0062.webp" },
      { name: "Стейк тунца гриль", price: "910 ₽", desc: "Томаты черри и базиликовая заправка" },
      { name: "Бургер с мраморной говядиной", price: "690 ₽", photo: "/hall-menu/dishes/0067.webp", photoAlt: "/hall-menu/dishes/0068.webp" },
      { name: "Бургер с куриной котлетой", price: "640 ₽" },
    ],
  },
  {
    id: "pasta",
    title: "Паста",
    kind: "food",
    items: [
      { name: "С тигровыми креветками", price: "690 ₽", desc: "Сливочно-томатный соус" },
      { name: "С куриным филе и грибами", price: "590 ₽", desc: "Сливочный соус" },
      { name: "С говядиной", price: "690 ₽", desc: "Сливочный демиглас", photo: "/hall-menu/dishes/0059.webp", photoAlt: "/hall-menu/dishes/0060.webp" },
      { name: "С морепродуктами", price: "790 ₽", desc: "В азиатском стиле" },
    ],
  },
  {
    id: "grill",
    title: "Хоспер",
    kind: "food",
    items: [
      { name: "Шашлык из куриного бедра", price: "480 ₽", note: "180 г", photo: "/hall-menu/dishes/0106.webp", photoAlt: "/hall-menu/dishes/0107.webp" },
      { name: "Шашлык из куриного филе", price: "480 ₽", note: "180 г" },
      { name: "Шашлык из говядины", price: "990 ₽", note: "150 г", photo: "/hall-menu/dishes/0110.webp", photoAlt: "/hall-menu/dishes/0111.webp" },
      { name: "Люля-кебаб из курицы", price: "480 ₽", note: "150 г" },
      { name: "Люля-кебаб из курицы с сыром", price: "490 ₽", note: "150 г", photo: "/hall-menu/dishes/0108.webp", photoAlt: "/hall-menu/dishes/0109.webp" },
      { name: "Люля-кебаб из баранины", price: "690 ₽", note: "150 г" },
      { name: "Стейк из говяжьей вырезки", price: "990 ₽", note: "180 г", photo: "/hall-menu/dishes/0122.webp", photoAlt: "/hall-menu/dishes/0123.webp" },
      { name: "Стейк мясника", price: "410 ₽", note: "за 100 г" },
      { name: "Стейк из куриного филе", price: "490 ₽" },
      { name: "Стейк из лосося", price: "1 190 ₽" },
    ],
  },
  {
    id: "pizza",
    title: "Пицца",
    kind: "food",
    items: [
      { name: "С грушей, горгонзолой и мёдом", price: "740 ₽", photo: "/hall-menu/dishes/0075.webp", photoAlt: "/hall-menu/dishes/0076.webp" },
      { name: "Грибная с зелёным луком", price: "690 ₽", photo: "/hall-menu/dishes/0077.webp", photoAlt: "/hall-menu/dishes/0078.webp" },
      { name: "Пеперони", price: "690 ₽" },
      { name: "Маргарита", price: "590 ₽" },
      { name: "С креветками и шпинатом", price: "690 ₽", photo: "/hall-menu/dishes/0073.webp", photoAlt: "/hall-menu/dishes/0074.webp" },
      { name: "Цезарь с цыплёнком", price: "690 ₽" },
      { name: "Сырная", price: "690 ₽" },
      { name: "Ветчина и грибы", price: "740 ₽" },
    ],
  },
  {
    id: "rolls",
    title: "Роллы",
    kind: "food",
    items: [
      { name: "Филадельфия", price: "890 ₽", desc: "Лосось, сливочный сыр, огурец и авокадо" },
      { name: "Дракон", price: "720 ₽", desc: "Угорь, огурец, краб, унаги и кунжут" },
      { name: "В стружке тунца с лососем", price: "870 ₽" },
      { name: "В стружке тунца с креветкой", price: "690 ₽", desc: "Краб, манго и сливочный сыр", photo: "/hall-menu/dishes/0096.webp", photoAlt: "/hall-menu/dishes/0097.webp" },
      { name: "Цезарь с курицей", price: "660 ₽", photo: "/hall-menu/dishes/0104.webp", photoAlt: "/hall-menu/dishes/0105.webp" },
      { name: "С лососем и манго", price: "890 ₽", desc: "Сливочный сыр и тайский соус", photo: "/hall-menu/dishes/0094.webp", photoAlt: "/hall-menu/dishes/0095.webp" },
      { name: "Классический с огурцом", price: "330 ₽" },
      { name: "Классический с креветкой", price: "350 ₽" },
      { name: "Классический с лососем", price: "380 ₽" },
    ],
  },
  {
    id: "desserts",
    title: "Десерты",
    kind: "food",
    items: [
      { name: "Медовик с солёной карамелью", price: "350 ₽", photo: "/hall-menu/dishes/0086.webp", photoAlt: "/hall-menu/dishes/0087.webp" },
      { name: "Красный бархат", price: "350 ₽", photo: "/hall-menu/dishes/0088.webp", photoAlt: "/hall-menu/dishes/0089.webp" },
      { name: "Меренговый рулет с малиной", price: "350 ₽", photo: "/hall-menu/dishes/0084.webp", photoAlt: "/hall-menu/dishes/0085.webp" },
      { name: "Чизкейк манго-маракуйя", price: "350 ₽", photo: "/hall-menu/dishes/0092.webp", photoAlt: "/hall-menu/dishes/0093.webp" },
      { name: "Ванильный крем с пралине и малиной", price: "350 ₽", photo: "/hall-menu/dishes/0083.webp" },
      { name: "Морковный торт", price: "350 ₽" },
      { name: "Ванильная панна-котта с клубникой", price: "350 ₽" },
    ],
  },
  {
    id: "coffee",
    title: "Кофе",
    kind: "drinks",
    items: [
      { name: "Американо", price: "180 / 230 / 280 ₽", note: "250 / 350 / 450 мл" },
      { name: "Фильтр-кофе", price: "180 / 230 / 280 ₽", note: "250 / 350 / 450 мл" },
      { name: "Эспрессо", price: "180 ₽", note: "40 мл" },
      { name: "Капучино", price: "220 / 270 / 310 ₽", note: "250 / 350 / 450 мл" },
      { name: "Латте", price: "220 / 270 / 310 ₽", note: "250 / 350 / 450 мл" },
      { name: "Флэт уайт", price: "250 ₽", note: "200 мл" },
    ],
  },
  {
    id: "signature",
    title: "Фирменный кофе",
    kind: "drinks",
    items: [
      { name: "Испанский латте", price: "320 / 370 / 420 ₽", note: "250 / 350 / 450 мл" },
      { name: "Фисташковый латте", price: "350 / 400 / 450 ₽", note: "250 / 350 / 450 мл" },
      { name: "Латте солёная карамель", price: "320 / 370 / 420 ₽", note: "250 / 350 / 450 мл" },
      { name: "Раф ваниль", price: "320 / 370 / 420 ₽", note: "250 / 350 / 450 мл" },
      { name: "Раф чак-чак", price: "350 / 400 / 450 ₽", note: "250 / 350 / 450 мл" },
      { name: "Матча латте", price: "420 / 480 / 540 ₽", note: "250 / 350 / 450 мл" },
      { name: "Клубничная матча", price: "470 / 530 / 590 ₽", note: "250 / 350 / 450 мл" },
    ],
  },
  {
    id: "cold",
    title: "Колд брю и айс-кофе",
    kind: "drinks",
    items: [
      { name: "Колд брю классический", price: "320 / 370 / 430 ₽", note: "250 / 350 / 450 мл" },
      { name: "Колд брю апельсин", price: "390 / 440 / 490 ₽", note: "250 / 350 / 450 мл" },
      { name: "Колд брю манго", price: "410 / 460 / 520 ₽", note: "250 / 350 / 450 мл" },
      { name: "Колд брю тоник", price: "390 / 440 / 490 ₽", note: "250 / 350 / 450 мл" },
      { name: "Айс латте", price: "260 / 300 / 340 ₽", note: "250 / 350 / 450 мл" },
      { name: "Айс испанский латте", price: "320 / 370 / 420 ₽", note: "250 / 350 / 450 мл" },
      { name: "Айс фисташковый латте", price: "350 / 400 / 450 ₽", note: "250 / 350 / 450 мл" },
      { name: "Эспрессо тоник", price: "260 / 300 / 340 ₽", note: "250 / 350 / 450 мл" },
    ],
  },
  {
    id: "summer",
    title: "Летние напитки",
    kind: "drinks",
    items: [
      { name: "Ягодный сад", price: "420 ₽", note: "450 мл" },
      { name: "Персик · Жасмин", price: "440 ₽", note: "450 мл" },
      { name: "Огурец · Лайм", price: "390 ₽", note: "450 мл" },
      { name: "Зелёная энергия", price: "490 ₽", note: "смузи · 450 мл" },
      { name: "Тропическое солнце", price: "520 ₽", note: "смузи · 450 мл" },
      { name: "Ягодный заряд", price: "510 ₽", note: "смузи · 450 мл" },
    ],
  },
  {
    id: "tea",
    title: "Чай",
    kind: "drinks",
    items: [
      { name: "Ассам", price: "420 ₽", note: "800 мл" },
      { name: "Сенча", price: "420 ₽", note: "800 мл" },
      { name: "Молочный", price: "420 ₽", note: "800 мл" },
      { name: "Эрл Грей", price: "420 ₽", note: "800 мл" },
      { name: "Жасмин", price: "420 ₽", note: "800 мл" },
      { name: "Татарский", price: "420 ₽", note: "800 мл" },
      { name: "Ройбуш", price: "420 ₽", note: "800 мл" },
      { name: "Алтайский", price: "420 ₽", note: "800 мл" },
    ],
  },
  {
    id: "author-tea",
    title: "Авторские чаи",
    kind: "drinks",
    items: [
      { name: "Персик · Жасмин", price: "390 / 620 ₽", note: "450 / 800 мл" },
      { name: "Облепиха · Апельсин", price: "420 / 650 ₽", note: "450 / 800 мл" },
      { name: "Малина · Мята", price: "390 / 620 ₽", note: "450 / 800 мл" },
      { name: "Имбирь · Лайм · Мёд", price: "390 / 620 ₽", note: "450 / 800 мл" },
      { name: "Яблоко · Корица · Ваниль", price: "390 / 620 ₽", note: "450 / 800 мл" },
    ],
  },
  {
    id: "other-drinks",
    title: "Ещё напитки",
    kind: "drinks",
    items: [
      { name: "Апельсиновый фреш", price: "490 ₽", note: "250 мл" },
      { name: "Грейпфрутовый фреш", price: "520 ₽", note: "250 мл" },
      { name: "Апельсин · Морковь", price: "450 ₽", note: "250 мл" },
      { name: "Классическое какао", price: "360 ₽", note: "450 мл" },
      { name: "Какао солёная карамель", price: "390 ₽", note: "450 мл" },
      { name: "Горячий шоколад", price: "430 ₽", note: "450 мл" },
      { name: "Фисташковый милкшейк", price: "520 ₽", note: "450 мл" },
      { name: "Шоколадный милкшейк", price: "490 ₽", note: "450 мл" },
      { name: "Морс", price: "220 ₽" },
      { name: "Вода с газом / без газа", price: "220 ₽" },
      { name: "Cola Zero", price: "220 ₽" },
      { name: "Тоник", price: "220 ₽" },
    ],
  },
];

export const HALL_PHOTO_ITEMS = HALL_SECTIONS.flatMap((section) =>
  section.items.filter((item) => item.photo).map((item) => ({
    ...item,
    sectionId: section.id,
    sectionTitle: section.title,
  })),
);

