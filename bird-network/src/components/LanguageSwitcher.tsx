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
      className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white/80 transition hover:border-gold hover:text-gold"
    >
      {label}
    </Link>
  );
}
