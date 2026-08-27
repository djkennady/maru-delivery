import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const pexels = (id, w = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const IMAGE_POOLS = {
  breakfast: [1640777, 566566, 376464, 2137807, 3491546],
  coffee: [302899, 312418, 1126728, 1775043, 2396220, 4253308],
  drinks: [1417945, 1707394, 3735470, 962464, 988906],
  food: [1279330, 1640777, 2233348, 2232, 2233348, 2233348],
  sushi: [357756, 248444, 2098085, 2098085],
  pizza: [2147491, 1146760, 825661],
  salad: [5938, 1213710, 5938],
  soup: [539451, 691114, 539451],
  meat: [361184, 361184, 353538],
  fish: [248444, 248444, 143133],
  dessert: [291528, 452010, 2890000, 2137807, 1702373],
};

function imageFor(pool, id) {
  const list = IMAGE_POOLS[pool] ?? IMAGE_POOLS.coffee;
  const idx =
    [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % list.length;
  return pexels(list[idx]);
}

/** @type {{ id: string, name: string, cat: string, emoji: string, desc?: string, price?: number, sizes?: { s?: number, m?: number, l?: number }, pool?: string, tags?: string[], customizable?: boolean }} */
const RAW = [
  // ——— Завтраки ———
  {
    id: "english-breakfast",
    name: "Английский завтрак",
    cat: "breakfast",
    emoji: "🍳",
    price: 599,
    pool: "breakfast",
    tags: ["hit"],
    desc: "Яичница глазунья из трёх яиц, куриная колбаска, фасоль в соусе BBQ, хашбраун, тост, руккола, томаты черри, сметана",
  },
  {
    id: "french-breakfast",
    name: "Французский завтрак",
    cat: "breakfast",
    emoji: "🥐",
    price: 699,
    pool: "breakfast",
    desc: "Омлет из трёх яиц, круассан, слабосолёный лосось, трюфельный крем, хашбраун, шпинат, томаты черри, сметана, джем",
  },
  {
    id: "russian-breakfast",
    name: "Русский завтрак",
    cat: "breakfast",
    emoji: "🥞",
    price: 599,
    pool: "breakfast",
    desc: "Скрэмбл из трёх яиц, ветчина из индейки, блинчик, тост, огурцы, помидоры, сметана, сливочное масло, джем",
  },
  {
    id: "build-your-breakfast",
    name: "Собери свой завтрак",
    cat: "breakfast",
    emoji: "🍽️",
    price: 399,
    pool: "breakfast",
    desc: "Омлет / скрэмбл / глазунья из трёх яиц + тост и сливочное масло",
  },
  {
    id: "blinchiki",
    name: "Блинчики",
    cat: "breakfast",
    emoji: "🥞",
    price: 199,
    pool: "breakfast",
  },
  {
    id: "syrniki",
    name: "Сырники",
    cat: "breakfast",
    emoji: "🧀",
    price: 279,
    pool: "breakfast",
    tags: ["hit"],
  },

  // ——— Сэндвичи ———
  {
    id: "sandwich-crispy-chicken",
    name: "Сэндвич с хрустящим цыплёнком",
    cat: "food",
    emoji: "🥪",
    price: 449,
    pool: "food",
    tags: ["hit"],
    desc: "Цыплёнок в панировке, помидоры, огурцы, романо, красный лук, соус BBQ и блю-чиз",
  },
  {
    id: "sandwich-roastbeef",
    name: "Сэндвич с ростбифом",
    cat: "food",
    emoji: "🥪",
    price: 599,
    pool: "food",
    desc: "Ростбиф, трюфельный крем, романо, огуречный релиш, лук фри",
  },
  {
    id: "croissant-caesar-salmon",
    name: "Круассан а-ля цезарь с лососем",
    cat: "food",
    emoji: "🥐",
    price: 599,
    pool: "food",
    desc: "Слабосолёный лосось, салат, соус цезарь, томаты черри, пармезан",
  },
  {
    id: "sandwich-nutella-banana",
    name: "Сэндвич с нутеллой и бананом",
    cat: "food",
    emoji: "🍫",
    price: 449,
    pool: "food",
  },
  {
    id: "croissant-chocolate",
    name: "Круассан с шоколадным кремом",
    cat: "food",
    emoji: "🥐",
    price: 449,
    pool: "food",
  },
  { id: "croissant", name: "Круассан классический", cat: "food", emoji: "🥐", price: 449, pool: "food" },

  // ——— Кофе чёрный ———
  {
    id: "americano",
    name: "Американо",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 180, m: 230, l: 280 },
    pool: "coffee",
    customizable: true,
    tags: ["hit"],
  },
  {
    id: "filter-coffee",
    name: "Фильтр-кофе",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 180, m: 230, l: 280 },
    pool: "coffee",
    customizable: true,
  },
  {
    id: "espresso",
    name: "Эспрессо",
    cat: "coffee",
    emoji: "☕",
    price: 180,
    pool: "coffee",
  },

  // ——— Кофе с молоком ———
  {
    id: "cappuccino",
    name: "Капучино",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 220, m: 270, l: 310 },
    pool: "coffee",
    customizable: true,
    tags: ["hit"],
  },
  {
    id: "latte",
    name: "Латте",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 220, m: 270, l: 310 },
    pool: "coffee",
    customizable: true,
  },
  {
    id: "flat-white",
    name: "Флэт уайт",
    cat: "coffee",
    emoji: "☕",
    price: 250,
    pool: "coffee",
    customizable: true,
  },

  // ——— Фирменный кофе ———
  {
    id: "spanish-latte",
    name: "Испанский латте",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 320, m: 370, l: 420 },
    pool: "coffee",
    customizable: true,
    tags: ["new"],
  },
  {
    id: "pistachio-latte",
    name: "Фисташковый латте",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 350, m: 400, l: 450 },
    pool: "coffee",
    customizable: true,
    tags: ["hit", "new"],
  },
  {
    id: "salted-caramel-latte",
    name: "Латте солёная карамель",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 320, m: 370, l: 420 },
    pool: "coffee",
    customizable: true,
  },
  {
    id: "raf-vanilla",
    name: "Раф ваниль",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 320, m: 370, l: 420 },
    pool: "coffee",
    customizable: true,
    tags: ["hit"],
  },
  {
    id: "raf-chak-chak",
    name: "Раф чак-чак",
    cat: "coffee",
    emoji: "☕",
    sizes: { s: 350, m: 400, l: 450 },
    pool: "coffee",
    customizable: true,
    tags: ["new"],
  },

  // ——— Nitro ———
  { id: "nitro-black", name: "Nitro Black", cat: "coffee", emoji: "🧊", sizes: { m: 340, l: 390 }, pool: "coffee", tags: ["new"] },
  { id: "nitro-vanilla", name: "Nitro Vanilla", cat: "coffee", emoji: "🧊", sizes: { m: 390, l: 450 }, pool: "coffee", tags: ["new"] },
  { id: "nitro-orange", name: "Nitro Orange", cat: "coffee", emoji: "🧊", sizes: { m: 410, l: 470 }, pool: "coffee", tags: ["new"] },

  // ——— Шоты ———
  { id: "shot-pistachio", name: "Фисташковый шот", cat: "coffee", emoji: "☕", price: 290, pool: "coffee" },
  { id: "shot-orange", name: "Апельсиновый шот", cat: "coffee", emoji: "☕", price: 290, pool: "coffee" },
  { id: "shot-salted-caramel", name: "Шот солёная карамель", cat: "coffee", emoji: "☕", price: 290, pool: "coffee" },
  { id: "shot-coconut", name: "Кокосовый шот", cat: "coffee", emoji: "☕", price: 290, pool: "coffee" },
  { id: "coffee-tasting-set", name: "Дегустационный сет (4 шота)", cat: "coffee", emoji: "☕", price: 890, pool: "coffee", tags: ["hit"] },

  // ——— Матча ———
  { id: "matcha-latte", name: "Матча латте", cat: "drinks", emoji: "🍵", sizes: { m: 420, l: 480 }, pool: "drinks", customizable: true, tags: ["hit"] },
  { id: "strawberry-matcha", name: "Клубничная матча", cat: "drinks", emoji: "🍓", sizes: { m: 470, l: 530 }, pool: "drinks", customizable: true, tags: ["new"] },

  // ——— Колд брю ———
  { id: "cold-brew-classic", name: "Колд брю классический", cat: "drinks", emoji: "🧊", sizes: { m: 320, l: 370 }, pool: "drinks" },
  { id: "cold-brew-orange", name: "Колд брю апельсин", cat: "drinks", emoji: "🧊", sizes: { m: 390, l: 440 }, pool: "drinks" },
  { id: "cold-brew-mango", name: "Колд брю манго", cat: "drinks", emoji: "🧊", sizes: { m: 410, l: 460 }, pool: "drinks" },
  { id: "cold-brew-tonic", name: "Колд брю тоник", cat: "drinks", emoji: "🧊", sizes: { m: 390, l: 440 }, pool: "drinks" },

  // ——— Айс-кофе ———
  { id: "iced-latte", name: "Айс латте", cat: "drinks", emoji: "🧊", sizes: { s: 260, m: 300, l: 340 }, pool: "drinks", customizable: true, tags: ["hit"] },
  { id: "iced-spanish-latte", name: "Айс испанский латте", cat: "drinks", emoji: "🧊", sizes: { m: 320, l: 370 }, pool: "drinks", customizable: true },
  { id: "iced-pistachio-latte", name: "Айс фисташковый латте", cat: "drinks", emoji: "🧊", sizes: { s: 350, m: 400, l: 450 }, pool: "drinks", customizable: true },
  { id: "espresso-tonic", name: "Эспрессо-тоник", cat: "drinks", emoji: "🧊", sizes: { s: 260, m: 300, l: 340 }, pool: "drinks" },

  // ——— Летние ———
  { id: "berry-garden", name: "Ягодный сад", cat: "drinks", emoji: "🫐", price: 420, pool: "drinks", tags: ["new"] },
  { id: "peach-jasmine-drink", name: "Персик жасмин", cat: "drinks", emoji: "🍑", price: 440, pool: "drinks" },
  { id: "cucumber-lime", name: "Огурец лайм", cat: "drinks", emoji: "🥒", price: 390, pool: "drinks" },

  // ——— Смузи ———
  { id: "smoothie-green", name: "Зелёная энергия", cat: "drinks", emoji: "🥤", price: 490, pool: "drinks" },
  { id: "smoothie-tropical", name: "Тропическое солнце", cat: "drinks", emoji: "🥤", price: 520, pool: "drinks", tags: ["hit"] },
  { id: "smoothie-berry", name: "Ягодный заряд", cat: "drinks", emoji: "🥤", price: 510, pool: "drinks" },

  // ——— Авторские чаи ———
  { id: "tea-peach-jasmine", name: "Чай персик жасмин", cat: "drinks", emoji: "🫖", price: 620, pool: "drinks" },
  { id: "tea-sea-buckthorn", name: "Чай облепиха апельсин", cat: "drinks", emoji: "🫖", price: 650, pool: "drinks" },
  { id: "tea-raspberry-mint", name: "Чай малина мята", cat: "drinks", emoji: "🫖", price: 620, pool: "drinks" },
  { id: "tea-ginger-lime", name: "Чай имбирь лайм мёд", cat: "drinks", emoji: "🫖", price: 620, pool: "drinks" },
  { id: "tea-apple-cinnamon", name: "Чай яблоко корица ваниль", cat: "drinks", emoji: "🫖", price: 620, pool: "drinks" },

  // ——— Фреши ———
  { id: "fresh-orange", name: "Фреш апельсин", cat: "drinks", emoji: "🍊", price: 490, pool: "drinks" },
  { id: "fresh-grapefruit", name: "Фреш грейпфрут", cat: "drinks", emoji: "🍊", price: 520, pool: "drinks" },
  { id: "fresh-orange-carrot", name: "Фреш апельсин морковь", cat: "drinks", emoji: "🥕", price: 450, pool: "drinks" },

  // ——— Милкшейки ———
  { id: "milkshake-pistachio", name: "Милкшейк фисташковый", cat: "drinks", emoji: "🥤", price: 520, pool: "drinks" },
  { id: "milkshake-chocolate", name: "Милкшейк шоколадный", cat: "drinks", emoji: "🥤", price: 490, pool: "drinks" },

  // ——— Какао ———
  { id: "cocoa-classic", name: "Классическое какао", cat: "drinks", emoji: "☕", price: 360, pool: "drinks" },
  { id: "cocoa-salted-caramel", name: "Какао солёная карамель", cat: "drinks", emoji: "☕", price: 390, pool: "drinks" },
  { id: "hot-chocolate", name: "Горячий шоколад", cat: "drinks", emoji: "🍫", price: 430, pool: "drinks" },

  // ——— Прохладительные ———
  { id: "mors", name: "Морс", cat: "drinks", emoji: "🫐", price: 220, pool: "drinks" },
  { id: "water", name: "Вода (с газом / без газа)", cat: "drinks", emoji: "💧", price: 220, pool: "drinks" },
  { id: "cola-zero", name: "Cola Zero", cat: "drinks", emoji: "🥤", price: 220, pool: "drinks" },
  { id: "tonic-drink", name: "Тоник", cat: "drinks", emoji: "🥤", price: 220, pool: "drinks" },

  // ——— Чай ———
  { id: "tea-assam", name: "Чай Ассам", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },
  { id: "tea-sencha", name: "Чай Сенча", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },
  { id: "tea-milk", name: "Чай молочный", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },
  { id: "tea-earl-grey", name: "Чай Эрл Грей", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },
  { id: "tea-jasmine", name: "Чай жасмин", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },
  { id: "tea-tatar", name: "Чай татарский", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },
  { id: "tea-rooibos", name: "Чай ройбуш", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },
  { id: "tea-altai", name: "Чай алтайский", cat: "drinks", emoji: "🫖", price: 420, pool: "drinks" },

  // ——— Хоспер ———
  { id: "shashlik-chicken-thigh", name: "Шашлык из куриного бедра", cat: "food", emoji: "🍖", price: 480, pool: "meat" },
  { id: "shashlik-chicken-fillet", name: "Шашлык из куриного филе", cat: "food", emoji: "🍖", price: 480, pool: "meat", desc: "В горчичном маринаде" },
  { id: "shashlik-beef", name: "Шашлык из говядины", cat: "food", emoji: "🍖", price: 990, pool: "meat", tags: ["hit"] },
  { id: "lula-chicken", name: "Люля-кебаб из курицы", cat: "food", emoji: "🍖", price: 480, pool: "meat" },
  { id: "lula-chicken-cheese", name: "Люля-кебаб из курицы с сыром", cat: "food", emoji: "🍖", price: 490, pool: "meat" },
  { id: "lula-lamb", name: "Люля-кебаб из баранины", cat: "food", emoji: "🍖", price: 690, pool: "meat" },
  { id: "steak-beef-tenderloin", name: "Стейк из говяжьей вырезки", cat: "food", emoji: "🥩", price: 990, pool: "meat", tags: ["hit"] },
  { id: "steak-butcher", name: "Стейк мясника", cat: "food", emoji: "🥩", price: 410, pool: "meat" },
  { id: "steak-chicken", name: "Стейк из куриного филе", cat: "food", emoji: "🍗", price: 490, pool: "meat" },
  { id: "steak-salmon", name: "Стейк из лосося", cat: "food", emoji: "🐟", price: 1190, pool: "fish", tags: ["hit"] },

  // ——— Гарниры ———
  { id: "grilled-vegetables", name: "Овощи гриль", cat: "food", emoji: "🥗", price: 490, pool: "salad" },
  { id: "grilled-corn", name: "Кукуруза гриль", cat: "food", emoji: "🌽", price: 270, pool: "food" },
  { id: "fries", name: "Картофель фри", cat: "food", emoji: "🍟", price: 270, pool: "food", tags: ["hit"] },
  { id: "potato-wedges", name: "Картофельные дольки", cat: "food", emoji: "🥔", price: 270, pool: "food" },
  { id: "grilled-mushrooms", name: "Шампиньоны на углях", cat: "food", emoji: "🍄", price: 330, pool: "food" },
  { id: "mashed-potato", name: "Картофельное пюре с зеленью", cat: "food", emoji: "🥔", price: 170, pool: "food" },
  { id: "fresh-vegetables", name: "Свежие овощи", cat: "food", emoji: "🥗", price: 220, pool: "salad" },

  // ——— Хлеб ———
  { id: "bread-borodinsky", name: "Хлеб бородинский", cat: "food", emoji: "🍞", price: 99, pool: "food" },
  { id: "bread-wheat", name: "Хлеб пшеничный тостовый", cat: "food", emoji: "🍞", price: 99, pool: "food" },
  { id: "bread-ciabatta", name: "Чиабатта", cat: "food", emoji: "🍞", price: 149, pool: "food" },

  // ——— Пицца ———
  { id: "pizza-pear-gorgonzola", name: "Пицца с грушей, горгондзолой и мёдом", cat: "food", emoji: "🍕", price: 740, pool: "pizza", tags: ["new"] },
  { id: "pizza-mushroom", name: "Грибная пицца с зелёным луком", cat: "food", emoji: "🍕", price: 690, pool: "pizza" },
  { id: "pizza-pepperoni", name: "Пицца пеперони", cat: "food", emoji: "🍕", price: 690, pool: "pizza", tags: ["hit"] },
  { id: "pizza-margherita", name: "Пицца маргарита", cat: "food", emoji: "🍕", price: 590, pool: "pizza" },
  { id: "pizza-shrimp-spinach", name: "Пицца с креветками и шпинатом", cat: "food", emoji: "🍕", price: 690, pool: "pizza" },
  { id: "pizza-caesar-chicken", name: "Пицца цезарь с цыплёнком", cat: "food", emoji: "🍕", price: 690, pool: "pizza" },
  { id: "pizza-cheese", name: "Сырная пицца", cat: "food", emoji: "🍕", price: 690, pool: "pizza" },
  { id: "pizza-ham-mushroom", name: "Пицца ветчина и грибы", cat: "food", emoji: "🍕", price: 740, pool: "pizza" },

  // ——— Роллы ———
  { id: "roll-philadelphia", name: "Филадельфия", cat: "food", emoji: "🍣", price: 890, pool: "sushi", tags: ["hit"], desc: "Лосось, сливочный сыр, огурец, авокадо" },
  { id: "roll-dragon", name: "Дракон", cat: "food", emoji: "🍣", price: 720, pool: "sushi", desc: "Угорь, огурец, краб, соус унаги, кунжут" },
  { id: "roll-tuna-salmon", name: "В стружке тунца с лососем", cat: "food", emoji: "🍣", price: 870, pool: "sushi" },
  { id: "roll-tuna-shrimp", name: "В стружке тунца с креветкой и манго", cat: "food", emoji: "🍣", price: 690, pool: "sushi" },
  { id: "roll-caesar-chicken", name: "Цезарь с курицей", cat: "food", emoji: "🍣", price: 660, pool: "sushi" },
  { id: "roll-salmon-mango", name: "С лососем, сыром и манго", cat: "food", emoji: "🍣", price: 890, pool: "sushi" },
  { id: "roll-classic-cucumber", name: "Классический с огурцом", cat: "food", emoji: "🍣", price: 330, pool: "sushi" },
  { id: "roll-classic-shrimp", name: "Классический с креветкой", cat: "food", emoji: "🍣", price: 350, pool: "sushi" },
  { id: "roll-classic-salmon", name: "Классический с лососем", cat: "food", emoji: "🍣", price: 380, pool: "sushi" },
  { id: "roll-hot-caesar", name: "Горячий цезарь", cat: "food", emoji: "🍣", price: 690, pool: "sushi", tags: ["hit"] },
  { id: "roll-hot-eel", name: "Сливочный угорь", cat: "food", emoji: "🍣", price: 740, pool: "sushi" },
  { id: "roll-hot-chicken-spicy", name: "С копчёным цыплёнком и соусом спайси", cat: "food", emoji: "🍣", price: 690, pool: "sushi" },
  { id: "roll-hot-shrimp", name: "С креветкой и ореховым соусом", cat: "food", emoji: "🍣", price: 690, pool: "sushi" },
  { id: "roll-hot-salmon-mango", name: "С лососем, манго и авокадо", cat: "food", emoji: "🍣", price: 890, pool: "sushi" },

  // ——— Салаты ———
  { id: "salad-caesar-chicken", name: "Цезарь с хрустящим цыплёнком", cat: "food", emoji: "🥗", price: 410, pool: "salad", tags: ["hit"] },
  { id: "salad-caesar-shrimp", name: "Цезарь с креветками", cat: "food", emoji: "🥗", price: 690, pool: "salad" },
  { id: "salad-greek", name: "Греческий с кремом брынзы", cat: "food", emoji: "🥗", price: 690, pool: "salad" },
  { id: "salad-roastbeef", name: "С ростбифом в азиатском стиле", cat: "food", emoji: "🥗", price: 590, pool: "salad" },
  { id: "salad-salmon", name: "Со слабосолёным лососем", cat: "food", emoji: "🥗", price: 690, pool: "salad" },
  { id: "salad-shrimp-mango", name: "С креветками, манго и ореховым соусом", cat: "food", emoji: "🥗", price: 690, pool: "salad" },
  { id: "salad-green", name: "Зелёный салат в базиликовой заправке", cat: "food", emoji: "🥗", price: 590, pool: "salad" },

  // ——— Поке ———
  { id: "poke-salmon", name: "Поке с лососем", cat: "food", emoji: "🥗", price: 690, pool: "salad", desc: "Рис, огурец, манго, чука, эдамаме, нори, соус поке" },
  { id: "poke-eel", name: "Поке с угрём", cat: "food", emoji: "🥗", price: 690, pool: "salad" },
  { id: "poke-shrimp", name: "Поке с креветкой", cat: "food", emoji: "🥗", price: 690, pool: "salad" },

  // ——— Супы ———
  { id: "soup-chicken", name: "Домашний куриный бульон", cat: "food", emoji: "🍲", price: 290, pool: "soup" },
  { id: "soup-borscht", name: "Борщ с говядиной", cat: "food", emoji: "🍲", price: 410, pool: "soup", tags: ["hit"] },
  { id: "soup-tom-yum", name: "Том ям с морепродуктами", cat: "food", emoji: "🍲", price: 690, pool: "soup" },
  { id: "soup-mushroom", name: "Грибной крем-суп", cat: "food", emoji: "🍲", price: 410, pool: "soup" },
  { id: "soup-pumpkin", name: "Тыквенный крем-суп с креветками", cat: "food", emoji: "🍲", price: 510, pool: "soup" },

  // ——— Вторые блюда ———
  { id: "crispy-chicken-salad", name: "Хрустящий цыплёнок с салатом", cat: "food", emoji: "🍗", price: 690, pool: "meat", desc: "С соусом блю-чиз" },
  { id: "chicken-cutlet-puree", name: "Куриная котлета с пюре", cat: "food", emoji: "🍗", price: 690, pool: "meat" },
  { id: "beef-stroganoff", name: "Бефстроганов с пюре", cat: "food", emoji: "🥩", price: 790, pool: "meat", tags: ["hit"] },
  { id: "beef-rus", name: "Биф а-ля рус", cat: "food", emoji: "🥩", price: 890, pool: "meat" },
  { id: "salmon-grill", name: "Стейк лосося гриль", cat: "food", emoji: "🐟", price: 1310, pool: "fish", tags: ["hit"] },
  { id: "tuna-grill", name: "Стейк тунца гриль", cat: "food", emoji: "🐟", price: 910, pool: "fish" },
  { id: "burger-beef", name: "Бургер с котлетой из говядины", cat: "food", emoji: "🍔", price: 690, pool: "food", tags: ["hit"] },
  { id: "burger-chicken", name: "Бургер с куриной котлетой", cat: "food", emoji: "🍔", price: 640, pool: "food" },

  // ——— Паста ———
  { id: "pasta-shrimp", name: "Паста с креветками", cat: "food", emoji: "🍝", price: 690, pool: "food", desc: "В сливочно-томатном соусе" },
  { id: "pasta-chicken-mushroom", name: "Паста с курицей и грибами", cat: "food", emoji: "🍝", price: 590, pool: "food" },
  { id: "pasta-beef", name: "Паста с говядиной", cat: "food", emoji: "🍝", price: 690, pool: "food" },
  { id: "pasta-seafood", name: "Паста с морепродуктами", cat: "food", emoji: "🍝", price: 790, pool: "food" },

  // ——— Десерты ———
  { id: "honey-cake", name: "Медовик с солёной карамелью", cat: "desserts", emoji: "🍰", price: 350, pool: "dessert", tags: ["hit"] },
  { id: "red-velvet", name: "Красный бархат", cat: "desserts", emoji: "🍰", price: 350, pool: "dessert" },
  { id: "meringue-roll", name: "Меренговый рулет с малиной", cat: "desserts", emoji: "🍰", price: 350, pool: "dessert" },
  { id: "cheesecake", name: "Чизкейк манго-маракуйя", cat: "desserts", emoji: "🍰", price: 350, pool: "dessert", tags: ["hit"] },
  { id: "vanilla-praline", name: "Ванильный крем с пралине", cat: "desserts", emoji: "🍰", price: 350, pool: "dessert" },
  { id: "carrot-cake", name: "Морковный торт", cat: "desserts", emoji: "🍰", price: 350, pool: "dessert" },
  { id: "panna-cotta", name: "Ванильная панна-котта с клубникой", cat: "desserts", emoji: "🍰", price: 350, pool: "dessert", tags: ["new"] },
  { id: "cookie", name: "Печенье", cat: "desserts", emoji: "🍪", price: 120, pool: "dessert" },
];

const categories = [
  { id: "breakfast", name: "Завтраки", imageUrl: pexels(1640777, 800) },
  { id: "coffee", name: "Кофе", imageUrl: pexels(302899, 800) },
  { id: "drinks", name: "Чай и напитки", imageUrl: pexels(1417945, 800) },
  { id: "food", name: "Еда", imageUrl: pexels(1279330, 800) },
  { id: "desserts", name: "Десерты", imageUrl: pexels(291528, 800) },
];

/** Названия подгрупп по секциям в RAW (как в PDF) */
const SECTION_GROUP_NAMES = {
  Завтраки: ["Завтраки", "Сырники и блинчики"],
  Сэндвичи: ["Сэндвичи и круассаны сытные", "Сэндвичи и круассаны сладкие"],
  "Кофе чёрный": "Чёрный кофе",
  "Кофе с молоком": "Кофе с молоком",
  "Фирменный кофе": "Фирменный кофе",
  Nitro: "Nitro Coffee",
  Шоты: "Кофейные шоты",
  Матча: "Матча",
  "Колд брю": "Колд брю",
  "Айс-кофе": "Айс-кофе",
  Летние: "Летние напитки",
  Смузи: "Смузи",
  "Авторские чаи": "Авторские чаи",
  Фреши: "Фреши",
  Милкшейки: "Милкшейки",
  Какао: "Какао",
  Прохладительные: "Прохладительные напитки",
  Чай: "Чай",
  Хоспер: "Хоспер",
  Гарниры: "Гарниры",
  Хлеб: "Хлеб",
  Пицца: "Пицца",
  Роллы: ["Роллы фирменные", "Горячие роллы темпура"],
  Салаты: "Салаты",
  Поке: "Поке",
  Супы: "Супы",
  "Вторые блюда": "Вторые блюда",
  Паста: "Паста",
  Десерты: "Десерты",
};

const SPLIT_LIMITS = {
  Завтраки: [4, 2],
  Сэндвичи: [3, 3],
  Роллы: [9, 5],
};

function resolveGroup(section, indexInSection) {
  const mapping = SECTION_GROUP_NAMES[section];
  if (!mapping) return section;
  if (typeof mapping === "string") return mapping;

  const limits = SPLIT_LIMITS[section];
  if (!limits) return mapping[0];
  if (indexInSection < limits[0]) return mapping[0];
  return mapping[1];
}

function applyMenuGroups(items) {
  const src = readFileSync(fileURLToPath(import.meta.url), "utf8");
  const groupById = new Map();
  let section = "";
  let sectionIndex = 0;

  for (const line of src.split("\n")) {
    const sectionMatch = line.match(/\/\/ ——— (.+?) ———/);
    if (sectionMatch) {
      section = sectionMatch[1];
      sectionIndex = 0;
      continue;
    }

    const idMatch = line.match(/id:\s*"([^"]+)"/);
    if (!idMatch || !section) continue;

    groupById.set(idMatch[1], resolveGroup(section, sectionIndex));
    sectionIndex += 1;
  }

  for (const item of items) {
    item.group = groupById.get(item.id);
  }
}

applyMenuGroups(RAW);

function toProduct(item) {
  const pool = item.pool ?? item.cat;
  const localPhoto = `/uploads/menu/${item.id}.jpg`;
  const localPath = join(root, "public", "uploads", "menu", `${item.id}.jpg`);
  const product = {
    id: item.id,
    categoryId: item.cat,
    name: item.name,
    description: item.desc ?? "",
    emoji: item.emoji,
    basePrice: item.price ?? item.sizes?.m ?? item.sizes?.s ?? 0,
    imageUrl: existsSync(localPath) ? localPhoto : imageFor(pool, item.id),
    group: item.group,
  };
  if (item.sizes) product.sizes = item.sizes;
  if (item.customizable) product.customizable = true;
  if (item.tags?.length) product.tags = item.tags;
  return product;
}

const menu = {
  menuVersion: 4,
  categories,
  products: RAW.map(toProduct),
  settings: {
    deliveryFee: 149,
    freeDeliveryFrom: 800,
    estimatedMinutes: "25–40",
  },
};

const outPath = join(root, "data", "menu.json");
writeFileSync(outPath, JSON.stringify(menu, null, 2), "utf-8");
console.log(`Wrote ${menu.products.length} products to ${outPath}`);
