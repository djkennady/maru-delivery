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
}

export function SiteHeader({
  showBack = false,
  backHref = "/",
  backLabel = "Назад",
}: SiteHeaderProps) {
  const { itemCount } = useCart();
  const { profile, hasProfile } = useUser();
  const firstName = hasProfile ? getFirstName(profile.name) : null;

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
                  Алабуга · доставка
                </span>
              </p>
            </>
          )}
        </div>

        {!showBack && (
          <div className="flex shrink-0 items-center gap-2">
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
