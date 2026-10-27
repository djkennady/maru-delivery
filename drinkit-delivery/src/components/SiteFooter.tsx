"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const hall = pathname === "/" || pathname === "/menu";
  const shop = pathname === "/order" || pathname === "/checkout";

  if (hall) {
    return (
      <footer className="relative z-10 bg-[#12110e] px-6 pb-10 pt-2 text-center text-[10px] leading-relaxed text-[#858579]">
        <p>ООО «Мару»</p>
        <p>ИНН 1650452447 · ОГРН 1261600020328</p>
      </footer>
    );
  }

  if (shop) {
    return (
      <footer className="bg-black px-4 pb-28 pt-6">
        <div className="mx-auto max-w-lg text-center text-[10px] leading-relaxed text-white/35">
          <p>ООО «Мару» · самовывоз в Алабуге</p>
          <p>ИНН 1650452447 · ОГРН 1261600020328</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="px-4 pb-28 pt-8">
      <div className="mx-auto max-w-lg text-center text-[10px] leading-relaxed text-[var(--muted)]/80">
        <p>ООО «Мару»</p>
        <p>ИНН 1650452447 · ОГРН 1261600020328</p>
      </div>
    </footer>
  );
}
