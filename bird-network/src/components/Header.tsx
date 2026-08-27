import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Header() {
  const t = await getTranslations("footer");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold ring-1 ring-gold/30">
            B
          </span>
          <span className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-gold">
            {t("network")}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
