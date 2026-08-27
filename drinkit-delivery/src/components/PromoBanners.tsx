import Image from "next/image";
import { promos } from "@/lib/media";

export function PromoBanners() {
  return (
    <section className="px-4 py-3">
      <div className="mx-auto max-w-lg min-w-0">
        <p className="mb-2 text-sm font-medium lowercase text-[var(--text)]">
          комбо и акции
        </p>
        <div className="flex gap-3 overflow-x-auto overscroll-x-contain scrollbar-hide">
        {promos.map((promo) => (
          <article
            key={promo.id}
            className={`relative h-[120px] w-[78vw] max-w-[260px] min-w-[78vw] flex-none overflow-hidden rounded-3xl bg-gradient-to-br ${promo.gradient} p-4 text-white shadow-lg sm:w-[240px] sm:min-w-[240px] sm:max-w-[240px]`}
          >
            <Image
              src={promo.image}
              alt=""
              fill
              className="object-cover opacity-35"
              sizes="240px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="pointer-events-none absolute -right-4 -top-4 text-5xl opacity-40">
              {promo.emoji}
            </div>
            <div className="relative">
              <p className="text-lg font-black leading-tight">{promo.title}</p>
              <p className="mt-1 text-sm text-white/90">{promo.subtitle}</p>
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
