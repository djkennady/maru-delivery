import Link from "next/link";
import { AdminPanel } from "@/components/AdminPanel";
import { BrandLogo } from "@/components/BrandLogo";
import { DrinkitAmbientBackground } from "@/components/DrinkitAmbientBackground";

export default function AdminPage() {
  return (
    <div className="drinkit-skin relative isolate min-h-full bg-black text-white">
      <DrinkitAmbientBackground />
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/85 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo size="sm" variant="onDark" linked={false} />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                МАРУ · админ
              </p>
              <p className="truncate text-base font-semibold text-white">
                Кабинет
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold text-white/85 transition hover:bg-white/15"
          >
            На сайт
          </Link>
        </div>
      </header>
      <AdminPanel />
    </div>
  );
}
