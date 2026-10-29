"use client";

import Link from "next/link";
import { MapPin, ShoppingBag, User } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { getFirstName } from "@/lib/loyalty";

interface SiteHeaderProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  variant?: "light" | "drinkit";
}

export function SiteHeader({
  showBack = false,
  backHref = "/",
  backLabel = "Назад",
  variant = "light",
}: SiteHeaderProps) {
  const { itemCount } = useCart();
  const { profile, hasProfile } = useUser();
  const firstName = hasProfile ? getFirstName(profile.name) : null;
  const drinkit = variant === "drinkit";

  if (drinkit) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            {showBack ? (
              <Link href={backHref} className="flex min-w-0 items-center gap-2">
                <BrandLogo size="sm" linked={false} variant="onDark" />
                <span className="truncate text-sm font-semibold text-white">
                  {backLabel}
                </span>
              </Link>
            ) : (
              <>
                <BrandLogo size="sm" variant="onDark" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {firstName ? `привет, ${firstName}` : "МАРУ"}
                  </p>
                  <p className="flex items-center gap-1 truncate text-[11px] text-white/45">
                    <MapPin className="h-3 w-3 shrink-0" />
                    Алабуга · самовывоз · −10%
                  </p>
                </div>
              </>
            )}
          </div>

          {!showBack ? (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/hall"
                className="rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold text-white/85 transition hover:bg-white/15"
              >
                Зал
              </Link>
              <Link
                href="/account"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80"
                aria-label="Личный кабинет"
              >
                <User className="h-4 w-4" />
              </Link>
              <Link
                href="/checkout"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#3b82f6] text-white"
                aria-label="Корзина самовывоза"
              >
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            </div>
          ) : null}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-orange-200/50 bg-white/45 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-3">
          {showBack ? (
            <Link href={backHref} className="flex min-w-0 items-center gap-2">
              <BrandLogo size="sm" linked={false} variant="onLight" />
              <span className="truncate text-sm font-semibold text-[var(--text)]">
                {backLabel}
              </span>
            </Link>
          ) : (
            <>
              <BrandLogo size="md" variant="onLight" />
              <p className="hidden min-w-0 flex-col sm:flex">
                {firstName ? (
                  <span className="truncate text-sm font-semibold text-[var(--text)]">
                    Привет, {firstName}
                  </span>
                ) : null}
                <span className="flex items-center gap-1 truncate text-xs text-[var(--muted)]">
                  <MapPin className="h-3 w-3 shrink-0" />
                  Алабуга · самовывоз
                </span>
              </p>
            </>
          )}
        </div>

        {!showBack && (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/menu"
              className="rounded-full bg-[var(--accent-warm)] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Меню в зале
            </Link>
            <Link
              href="/account"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                hasProfile
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                  : "bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              }`}
              aria-label="Личный кабинет"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/checkout"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-warm-soft)] to-[var(--accent-soft)] text-[var(--accent-warm)] transition hover:from-[var(--accent-warm)] hover:to-[var(--accent)] hover:text-white"
              aria-label="Корзина"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
