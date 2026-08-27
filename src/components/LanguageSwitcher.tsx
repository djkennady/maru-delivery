"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const otherLocale = locale === "ru" ? "en" : "ru";
  const label = locale === "ru" ? "EN" : "RU";

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      aria-label={locale === "ru" ? "Switch to English" : "Переключить на русский"}
      className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted transition hover:border-gold/50 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {label}
    </Link>
  );
}
