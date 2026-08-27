"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NETWORK_LOGO } from "@/lib/assets";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  isVenueRoute?: boolean;
}

export function Header({ isVenueRoute = false }: HeaderProps) {
  const t = useTranslations("header");

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isVenueRoute
          ? "border-white/5 bg-black/40"
          : "border-white/10 bg-background/85"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        <div className="flex min-w-0 items-center gap-2">
          {isVenueRoute && (
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t("backToNetwork")}</span>
            </Link>
          )}
          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:h-9 sm:w-9">
              <Image
                src={NETWORK_LOGO}
                alt={t("network")}
                fill
                className="object-contain p-0.5"
                sizes="36px"
                priority
              />
            </div>
            {!isVenueRoute && (
              <span className="truncate text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-gold sm:text-lg">
                {t("network")}
              </span>
            )}
          </Link>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
