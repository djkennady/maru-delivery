import type { Locale, LocalizedString } from "@/types/venue";

export function localized(
  value: LocalizedString,
  locale: Locale,
): string {
  return value[locale] ?? value.ru;
}
