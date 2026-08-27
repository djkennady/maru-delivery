"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, MapPin, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface DeliveryHeaderProps {
  showBack?: boolean;
}

export function DeliveryHeader({ showBack = false }: DeliveryHeaderProps) {
  const t = useTranslations("delivery");
  const { itemCount } = useCart();

  return (
    <header className="delivery-theme sticky top-0 z-50 border-b border-[var(--delivery-border)] bg-[var(--delivery-bg)]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2">
          {showBack ? (
            <Link
              href="/delivery"
              className="flex shrink-0 items-center gap-1 rounded-xl p-2 text-[var(--delivery-muted)] transition hover:bg-[var(--delivery-surface)] hover:text-[var(--delivery-text)]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <Link href="/" className="flex shrink-0 items-center gap-1 rounded-xl p-2 text-[var(--delivery-muted)] transition hover:bg-[var(--delivery-surface)] hover:text-[var(--delivery-text)]">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight text-[var(--delivery-text)]">
              {t("brand")}
            </p>
            <p className="flex items-center gap-1 truncate text-xs text-[var(--delivery-muted)]">
              <MapPin className="h-3 w-3 shrink-0" />
              {t("addressShort")}
            </p>
          </div>
        </div>

        {!showBack && (
          <Link
            href="/delivery/checkout"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--delivery-accent-soft)] text-[var(--delivery-accent)] transition hover:bg-[var(--delivery-accent)] hover:text-white"
            aria-label={t("cart")}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--delivery-accent)] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
