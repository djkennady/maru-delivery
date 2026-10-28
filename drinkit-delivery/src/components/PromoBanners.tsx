import Image from "next/image";
import { promos } from "@/lib/media";

export function PromoBanners() {
  return (
    <section className="px-4 py-4 md:px-6">
      <div className="mx-auto max-w-7xl min-w-0">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium lowercase tracking-[0.18em] text-white/40">
              акции
            </p>
            <h2 className="text-xl font-semibold lowercase text-white md:text-2xl">
              комбо и подарки
            </h2>
          </div>
          <p className="text-[11px] font-medium text-[#93c5fd]">самовывоз −10%</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo, index) => (
            <article
              key={promo.id}
              className={`drinkit-rise relative h-[150px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${promo.gradient} p-5 text-white shadow-lg ring-1 ring-white/10`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Image
                src={promo.image}
                alt=""
                fill
                quality={90}
                className="object-cover opacity-40"
                sizes="(max-width: 1024px) 50vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
              <div className="pointer-events-none absolute -right-3 -top-3 text-5xl opacity-40">
                {promo.emoji}
              </div>
              <div className="relative">
                <p className="text-lg font-black leading-tight md:text-xl">
                  {promo.title}
                </p>
                <p className="mt-1 text-sm text-white/90">{promo.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
