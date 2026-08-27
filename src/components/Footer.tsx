"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted">
        <p className="font-medium text-foreground/80">{t("network")}</p>
        <p className="mt-1">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
