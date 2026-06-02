const CYRILLIC: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function slugify(text: string): string {
  const transliterated = text
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => CYRILLIC[char] ?? char)
    .join("");

  const slug = transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

  return slug || `item-${Date.now()}`;
}

export function uniqueSlug(base: string, existing: Set<string>): string {
  let slug = slugify(base);
  if (!existing.has(slug)) return slug;

  let index = 2;
  while (existing.has(`${slug}-${index}`)) {
    index += 1;
  }
  return `${slug}-${index}`;
}
